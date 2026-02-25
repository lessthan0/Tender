import { differenceInMilliseconds } from 'date-fns';
import express, { Request, Response } from 'express';
import { Pet, PetResponse } from '../entities/Pet.js';
import { habits } from '../models/habits.js';
import { logs } from '../models/logs.js';
import { petIdCounter, pets } from '../models/pets.js';
import { CreatePetSchema, UpdatePetNameBody, UpdatePetNameSchema } from '../validators/pets.js';

const app = express();
app.use(express.json());
export const NEGLECT_THRESHOLD_MS = 1000 * 60 * 60 * 24;

export function msg(res: express.Response, code: number, message: string): typeof res {
  return res.status(code).json({ message });
}

export function clamp0to100(n: number): number {
  return Math.max(0, Math.min(100, n));
}
export function toPetResponse(p: Pet): PetResponse {
  const { stage, stageEmoji } = computeStageFromSpec(p);
  return {
    ...p,
    lastFedAt: p.lastFedAt.toISOString(),
    stage,
    stageEmoji,
  };
}
export function parsePetId(req: express.Request): number | null {
  const n = Number(req.params.petId);
  if (!Number.isInteger(n) || n <= 0) return null;
  return n;
}

export function isCooked(pet: Pet): boolean {
  return differenceInMilliseconds(new Date(), pet.lastFedAt) > NEGLECT_THRESHOLD_MS;
}

export function totalLogsForPet(petId: number): number {
  let count = 0;
  for (const l of logs) if (l.petId === petId) count++;
  return count;
}

export function createPet(req: Request, res: Response): void {
  const result = CreatePetSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ errors: result.error });
    return;
  }

  const newPet: Pet = {
    id: petIdCounter.value++,
    name: result.data.name,
    species: result.data.species,
    happiness: 50,
    hunger: 50,
    energy: 50,
    lastFedAt: new Date(),
  };

  pets.push(newPet);
  res.status(201).json(newPet);
}

function computeStageFromSpec(pet: Pet): { stage: string; stageEmoji: string } {
  if (isCooked(pet)) {
    return { stage: 'Cooked', stageEmoji: '🍗' };
  }

  const totalLogs = getTotalLogsForPet(pet.id);

  if (totalLogs === 0) return { stage: 'Egg', stageEmoji: '🥚' };
  if (totalLogs >= 1 && totalLogs <= 4) return { stage: 'Hatching', stageEmoji: '🐣' };
  if (totalLogs >= 5 && totalLogs <= 14) return { stage: 'Growing', stageEmoji: '🐥' };
  return { stage: 'Grown', stageEmoji: '🐓' };
}
function getTotalLogsForPet(petId: number): number {
  let count = 0;
  for (const l of logs) if (l.petId === petId) count++;
  return count;
}

export function getPetbyID(req: Request, res: Response): Response {
  const petId = parsePetId(req);
  if (petId === null) return msg(res, 404, 'Pet not found');

  const pet = pets.find((p) => p.id === petId);
  if (!pet) return msg(res, 404, 'Pet not found');

  return res.status(200).json(toPetResponse(pet));
}

export function putPetbyID(req: Request, res: Response): Response {
  const petId = parsePetId(req);
  if (petId === null) return msg(res, 404, 'Pet not found');

  const pet = pets.find((p) => p.id === petId);
  if (!pet) return msg(res, 404, 'Pet not found');

  const parsed = UpdatePetNameSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);

  const body: UpdatePetNameBody = parsed.data;
  pet.name = body.name;

  return res.status(200).json(toPetResponse(pet));
}

export function deletePetbyID(req: Request, res: Response): Response {
  const petId = parsePetId(req);
  if (petId === null) return msg(res, 404, 'Pet not found');

  const idx = pets.findIndex((p) => p.id === petId);
  if (idx === -1) return msg(res, 404, 'Pet not found');

  pets.splice(idx, 1);

  // optional cleanup
  for (let i = habits.length - 1; i >= 0; i--) if (habits[i].petId === petId) habits.splice(i, 1);
  for (let i = logs.length - 1; i >= 0; i--) if (logs[i].petId === petId) logs.splice(i, 1);

  return res.status(204).send();
}
