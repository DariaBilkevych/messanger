import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import User from '../models/user-model.js';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../utils/generateTokens.js';
import { setHttpOnlyCookie, clearHttpOnlyCookie } from '../utils/cookies.js';

export const signup = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, phoneNumber, password, expoPushToken } =
      req.body;

    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const avatar = `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`;
    const newUser = new User({
      firstName,
      lastName,
      phoneNumber,
      password,
      avatar,
      expoPushToken,
    });

    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    newUser.refreshToken = refreshToken;
    await newUser.save();

    setHttpOnlyCookie(res, 'refreshToken', refreshToken);

    res.status(201).json({
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        phoneNumber: newUser.phoneNumber,
        avatar: newUser.avatar,
        expoPushToken: newUser.expoPushToken,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Something went wrong', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { phoneNumber, password, expoPushToken } = req.body;

    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    user.expoPushToken = expoPushToken;
    await user.save();

    setHttpOnlyCookie(res, 'refreshToken', refreshToken);

    res.status(200).json({
      message: 'Logged in successfully',
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Something went wrong', error: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
      clearHttpOnlyCookie(res, 'refreshToken');
      return res.status(200).json({
        message: 'Logged out successfully, token was expired or invalid',
      });
    }

    const userId = decoded.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    user.expoPushToken = '';
    user.refreshToken = '';
    await user.save();

    clearHttpOnlyCookie(res, 'refreshToken');

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.log('Error in logout', error.message);
    res
      .status(500)
      .json({ message: 'Something went wrong', error: error.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.body.token || req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token is required' });
    }

    const user = await User.findOne({ refreshToken });
    if (!user) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: 'Invalid refresh token' });
        }

        const accessToken = generateAccessToken(decoded.userId);
        const newRefreshToken = generateRefreshToken(decoded.userId);

        user.refreshToken = newRefreshToken;
        await user.save();

        setHttpOnlyCookie(res, 'refreshToken', newRefreshToken);

        res.status(200).json({
          accessToken,
          newRefreshToken,
        });
      }
    );
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Something went wrong', error: error.message });
  }
};

export const verifyPhoneNumber = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res
        .status(404)
        .json({ message: 'User with this phone number not found!' });
    }

    res
      .status(200)
      .json({ message: 'Phone number verified', userId: user._id });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Something went wrong', error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id: userId } = req.params;
    const { newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    user.password = newPassword;
    await user.save();

    const accessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    user.refreshToken = newRefreshToken;
    await user.save();

    setHttpOnlyCookie(res, 'refreshToken', newRefreshToken);

    res.status(200).json({
      message: 'Password successfully changed!',
      accessToken,
      newRefreshToken,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'Something went wrong', error: error.message });
  }
};
