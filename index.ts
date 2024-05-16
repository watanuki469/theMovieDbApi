import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Notes2 from './models/Notes2';
import { createUser, getAllUsers, login } from './models/authController';
import bodyParser from 'body-parser';

const express = require('express');
const cors = require('cors');
const app = express();
const PORT=5000
app.use(cors()); 
app.use(bodyParser.json());
mongoose.connect('mongodb+srv://admin:vNyLVQug8B7quWE4@cluster0.3avkh2c.mongodb.net/theMovieDb');

app.post('/login', login);
app.get('/users', getAllUsers);
app.post('/register', createUser);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
