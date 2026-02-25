import express, { Request, Response } from 'express';
import { isCooked, msg, parsePetId } from '../controllers/pets.js';
import { Log } from '../entities/Log.js';
import { habits } from '../models/habits.js';
import { logs } from '../models/logs.js';
import { pets } from '../models/pets.js';
import { CreateLogBody, CreateLogSchema } from '../validators/logs.js';

const app = express();
app.use(express.json());
let nextLogId = 1;

function clamp0to100(n: number): number {
  return Math.max(0, Math.min(100, n));
}

export function postLogbyPetID(req: Request, res: Response): Response {
  const petId = parsePetId(req);
  if (petId === null) return msg(res, 404, 'Pet not found');

  const pet = pets.find((p) => p.id === petId);
  if (!pet) return msg(res, 404, 'Pet not found');

  if (isCooked(pet)) {
    return msg(res, 400, 'This pet has been cooked. Adopt a new one.');
  }

  const parsed = CreateLogSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);

  const body: CreateLogBody = parsed.data;

  // Validate habitId belongs to this pet
  const habit = habits.find((h) => h.id === body.habitId);
  if (!habit || habit.petId !== petId) {
    return msg(res, 400, 'Habit does not belong to this pet');
  }

  // Create log
  const log: Log = {
    id: nextLogId++,
    petId,
    habitId: body.habitId,
    date: body.date,
    note: body.note,
  };
  logs.push(log);

  // Boost pet stat by +10 clamped at 100
  const boost = habit.statBoost;
  if (boost === 'happiness') pet.happiness = clamp0to100(pet.happiness + 10);
  if (boost === 'hunger') pet.hunger = clamp0to100(pet.hunger + 10);
  if (boost === 'energy') pet.energy = clamp0to100(pet.energy + 10);

  // Reset neglect timer on every log
  pet.lastFedAt = new Date();

  return res.status(201).json(log);
}
