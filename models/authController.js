const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./User');

const JWT_SECRET = '123456';

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Tìm người dùng trong cơ sở dữ liệu
    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });
      return;
    }

    // So sánh mật khẩu đã hash
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });
      return;
    }

    // Tạo mã thông báo JWT
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

    // Trả về token
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Đã xảy ra lỗi trong quá trình đăng nhập.' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    // Lấy tất cả người dùng từ cơ sở dữ liệu
    const users = await User.find();

    // Trả về danh sách người dùng
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Đã xảy ra lỗi trong quá trình lấy thông tin người dùng.' });
  }
};

const createUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Kiểm tra xem người dùng đã tồn tại chưa
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400).json({ message: 'Email đã tồn tại.' });
      return;
    }

    // Hash mật khẩu trước khi lưu vào cơ sở dữ liệu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng mới
    const newUser = new User({
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
export default {
  login,
  getAllUsers,
  createUser
}
