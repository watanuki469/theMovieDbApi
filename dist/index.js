"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const authController_1 = require("./models/authController");
const body_parser_1 = __importDefault(require("body-parser"));
const http_1 = __importDefault(require("http"));
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;
app.use(cors());
app.use(body_parser_1.default.json());
app.post('/login', authController_1.login);
app.get('/users', authController_1.getAllUsers);
app.post('/register', authController_1.createUser);
const server = http_1.default.createServer(app);
mongoose_1.default.connect('mongodb+srv://admin:vNyLVQug8B7quWE4@cluster0.3avkh2c.mongodb.net/theMovieDb').then(() => {
    console.log('MongoDb Connected');
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((err) => {
    console.log({ err });
    process.exit(1);
});
