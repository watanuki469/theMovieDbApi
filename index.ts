import dotenv from 'dotenv';
dotenv.config();

import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import http from "http";
import mongoose from 'mongoose';
import { createUser, getAllUsers, login } from './models/authController';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/v1/login', login);
app.get('/api/v1/users', getAllUsers);
app.post('/api/v1/register', createUser);

const server = http.createServer(app);

mongoose.connect('mongodb+srv://admin:vNyLVQug8B7quWE4@cluster0.3avkh2c.mongodb.net/theMovieDb').then(() => {
    console.log('MongoDb Connected');
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((err) => {
    console.log({ err });
    process.exit(1);
});
