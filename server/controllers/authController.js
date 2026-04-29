import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  res.cookie('token', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user }
  });
};

export const register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    console.log(`[Register Attempt] Name: ${name}, Email: ${email}, Role: ${role || 'user'}`);
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`[Register Failed] User already exists: ${email}`);
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: role || 'user'
    });

    console.log(`[Register Success] User Created: ${user.name} (${user.role})`);
    createSendToken(user, 201, res);
  } catch (error) {
    console.error(`[Register Error] ${error.message}`);
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    console.log(`[Login Attempt] Email: ${email}, User Found: ${!!user}`);

    if (!user || !(await user.comparePassword(password, user.password))) {
      console.log(`[Login Failed] Invalid credentials for: ${email}`);
      return res.status(401).json({ message: 'Incorrect email or password' });
    }

    console.log(`[Login Success] User: ${user.name} (${user.role})`);

    createSendToken(user, 200, res);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res.cookie('token', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
