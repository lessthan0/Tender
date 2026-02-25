//export type Habit = 'health' | 'fitness' | 'mindfulness' | 'learning' | 'social';
import { HabitCategory, StatBoost } from '../validators/habits.js';
export type Habits = {
  id: number;
  petId: number;
  name: string;
  category: HabitCategory;
  targetFrequency: number;
  statBoost: StatBoost;
};
