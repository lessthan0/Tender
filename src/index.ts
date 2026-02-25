import 'dotenv/config';
import express from 'express';
const app = express();
app.use(express.json());

import { getHabitsbyPetID, postHabitsbyPetID } from './controllers/habits.js';
import { postLogbyPetID } from './controllers/logs.js';
import { createPet, deletePetbyID, getPetbyID, putPetbyID } from './controllers/pets.js';
//Pets
app.post('/pets', createPet);
app.get('/pets/:petId', getPetbyID);
app.put('/pets/:petId', putPetbyID);
app.delete('/pets/:petId', deletePetbyID);
//Habits
app.post('/pets/:petId/habits', postHabitsbyPetID);
app.get('/pets/:petId/habits', getHabitsbyPetID);

//Logs
app.post('/pets/:petId/logs', postLogbyPetID);
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Tender listening on http://localhost:${PORT}`);
});
