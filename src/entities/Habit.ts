export type Habit = 'health' | 'fitness' | 'mindfulness' | 'learning' | 'social';

export type Habits = {
  id: number;
  petId: number;
  name: string;
  category: Habit;
  targetFrequency: number;
  statBoost: Enumerator;
};
