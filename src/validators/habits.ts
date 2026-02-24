import { z } from 'zod';

export const CreateHabitSchema = z.object({
  name: z.string().min(1, 'Name is required').max(20, 'Name must be 20 characters or less'),
  species: z.enum(['health', 'fitness', 'mindfulness', 'learning', 'social']),
});

export const StatType = z.enum(['happiness', 'hunger', 'energy']);
export type Stat = z.infer<typeof StatType>;
