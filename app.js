import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import userRoutes from './routes/user.js';
import paperRoutes from './routes/papers.js'; // Assuming you have a paper route file


dotenv.config();

const app = express();


app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', userRoutes);
app.use('/paper',paperRoutes)

export default app;
