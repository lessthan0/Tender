import { z } from 'zod';
export const HabitCategoryEnum = z.enum(['health', 'fitness', 'mindfulness', 'learning', 'social']);
export type HabitCategory = z.infer<typeof HabitCategoryEnum>;
export const StatBoostEnum = z.enum(['happiness', 'hunger', 'energy']);
export type StatBoost = z.infer<typeof StatBoostEnum>;
export const StatType = z.enum(['happiness', 'hunger', 'energy']);
export type Stat = z.infer<typeof StatType>;

export const CreateHabitSchema = z.object({
  name: z.string().min(1).max(50),
  category: HabitCategoryEnum,
  targetFrequency: z.number().int().min(1).max(7),
  statBoost: StatBoostEnum,
});

export type CreateHabitBody = z.infer<typeof CreateHabitSchema>;
