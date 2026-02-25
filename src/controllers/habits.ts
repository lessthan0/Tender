import { habits } from '../models/habits.js';

import express, { Request, Response } from 'express';
import { isCooked, msg, parsePetId } from '../controllers/pets.js';
import { Habits } from '../entities/Habit.js';
import { pets } from '../models/pets.js';
import { CreateHabitBody, CreateHabitSchema, HabitCategoryEnum } from '../validators/habits.js';
const app = express();
app.use(express.json());

let nextHabitId = 1;

export function postHabitsbyPetID(req: Request, res: Response): Response {
  const petId = parsePetId(req);
  if (petId === null) return msg(res, 404, 'Pet not found');

  const pet = pets.find((p) => p.id === petId);
  if (!pet) return msg(res, 404, 'Pet not found');

  if (isCooked(pet)) {
    return msg(res, 400, 'This pet has been cooked. Adopt a new one.');
  }

  const parsed = CreateHabitSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);

  const body: CreateHabitBody = parsed.data;

  const habiter: Habits = {
    id: nextHabitId++,
    petId,
    name: body.name,
    category: body.category,
    targetFrequency: body.targetFrequency,
    statBoost: body.statBoost,
  };

  habits.push(habiter);
  return res.status(201).json(habiter);
}

export function getHabitsbyPetID(req: Request, res: Response): Response {
  const petId = parsePetId(req);

  if (petId === null) return msg(res, 404, 'Pet not found');

  const pet = pets.find((p) => p.id === petId);
  if (!pet) return msg(res, 404, 'Pet not found');

  let result = habits.filter((h) => h.petId === petId);

  if (req.query.category !== undefined) {
    if (typeof req.query.category !== 'string') return res.status(200).json([]);
    const cat = HabitCategoryEnum.safeParse(req.query.category);
    if (!cat.success) return res.status(200).json([]);
    result = result.filter((h) => h.category === cat.data);
  }

  return res.status(200).json(result);
}
