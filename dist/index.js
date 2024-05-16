"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const mongoose_1 = __importDefault(require("mongoose"));
const authController_1 = require("./models/authController");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
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
