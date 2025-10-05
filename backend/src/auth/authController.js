import { User } from './userModel.js';
import { createHttpError } from '../shared/utils/errorHandler.js';
import { signToken } from '../shared/middleware/auth.js';

export async function signup(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) throw createHttpError(400, 'All fields are required');
    const existing = await User.findOne({ email });
    if (existing) throw createHttpError(409, 'Email already in use');
    const user = await User.create({ name, email, password });
    const token = signToken(user._id.toString());
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw createHttpError(400, 'Email and password required');
    const user = await User.findOne({ email });
    if (!user) throw createHttpError(401, 'Invalid credentials');
    const valid = await user.comparePassword(password);
    if (!valid) throw createHttpError(401, 'Invalid credentials');
    const token = signToken(user._id.toString());
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    next(err);
  }
}


