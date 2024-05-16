"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.getAllUsers = exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("./User"));
const JWT_SECRET = '123456';
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // Tìm người dùng trong cơ sở dữ liệu
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });
            return;
        }
        // So sánh mật khẩu đã hash
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });
            return;
        }
        // Tạo mã thông báo JWT
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
        // Trả về token
        res.status(200).json({ token });
    }
    catch (error) {
        res.status(500).json({ message: 'Đã xảy ra lỗi trong quá trình đăng nhập.' });
    }
});
exports.login = login;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Lấy tất cả người dùng từ cơ sở dữ liệu
        const users = yield User_1.default.find();
        // Trả về danh sách người dùng
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'Đã xảy ra lỗi trong quá trình lấy thông tin người dùng.' });
    }
});
exports.getAllUsers = getAllUsers;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // Kiểm tra xem người dùng đã tồn tại chưa
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'Email đã tồn tại.' });
            return;
        }
        // Hash mật khẩu trước khi lưu vào cơ sở dữ liệu
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Tạo người dùng mới
        const newUser = new User_1.default({
            email,
            password: hashedPassword,
        });
        // Lưu người dùng vào cơ sở dữ liệu
        yield newUser.save();
        // Trả về thông tin về người dùng mới được tạo
        res.status(201).json({ message: 'Người dùng đã được tạo thành công.' });
    }
    catch (error) {
        res.status(500).json({ message: 'Đã xảy ra lỗi trong quá trình tạo người dùng.' });
    }
});
exports.createUser = createUser;
