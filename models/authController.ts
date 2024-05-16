// authController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User, { UserDocument } from './User';

const JWT_SECRET = '123456';

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Tìm người dùng trong cơ sở dữ liệu
    const user: UserDocument | null = await User.findOne({ email });

    if (!user) {
      res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });
      return;
    }

    // So sánh mật khẩu đã hash
    const isPasswordValid: boolean = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });
      return;
    }

    // Tạo mã thông báo JWT
    const token: string = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

    // Trả về token
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Đã xảy ra lỗi trong quá trình đăng nhập.' });
  }
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    // Lấy tất cả người dùng từ cơ sở dữ liệu
    const users: UserDocument[] = await User.find();

    // Trả về danh sách người dùng
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Đã xảy ra lỗi trong quá trình lấy thông tin người dùng.' });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Kiểm tra xem người dùng đã tồn tại chưa
    const existingUser: UserDocument | null = await User.findOne({ email });

    if (existingUser) {
      res.status(400).json({ message: 'Email đã tồn tại.' });
      return;
    }

    // Hash mật khẩu trước khi lưu vào cơ sở dữ liệu
    const hashedPassword: string = await bcrypt.hash(password, 10);

    // Tạo người dùng mới
    const newUser: UserDocument = new User({
      email,
      password: hashedPassword,
    });

    // Lưu người dùng vào cơ sở dữ liệu
    await newUser.save();

    // Trả về thông tin về người dùng mới được tạo
    res.status(201).json({ message: 'Người dùng đã được tạo thành công.' });
  } catch (error) {
    res.status(500).json({ message: 'Đã xảy ra lỗi trong quá trình tạo người dùng.' });
  }
};
