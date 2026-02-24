import 'dotenv/config'; // Load environment variables
import express from 'express';
//import { Habit } from './entities/Habit.js';
//import { Log } from './entities/Log.js';
//import { Pet } from './entities/Pet.js';
const app = express();
app.use(express.json());

import { createPet } from './controllers/pets.js';
app.post('/pets', createPet);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Tender listening on http://localhost:${PORT}`);
});
