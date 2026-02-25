import { z } from 'zod';

export const CreateLogSchema = z.object({
  habitId: z.number().int(),
  date: z.date().min(1), // spec says ISO 8601 date string like "YYYY-MM-DD"
  note: z.string().max(200).optional(),
});

export type CreateLogBody = z.infer<typeof CreateLogSchema>;
