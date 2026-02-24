type Species = 'cat' | 'dragon' | 'blob' | 'plant' | 'rock';

export type Pet = {
  id: number;
  name: string;
  species: Species;
  happiness: number;
  hunger: number;
  energy: number;
  lastFedAt: Date;
};
export type PetResponse = Omit<Pet, 'lastFedAt'> & {
  lastFedAt: string;
  stage: string;
  stageEmoji: string;
};
