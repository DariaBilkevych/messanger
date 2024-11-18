import bcrypt from 'bcryptjs';
import User from '../models/user-model.js';

import { cloudinary } from '../utils/cloudinary.js';

export const getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      phoneNumber: user.phoneNumber,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Something went wrong', error: error.message });
  }
};

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const receivedUsers = await User.find({ _id: { $ne: loggedInUser } })
      .select('-password -refreshToken')
      .sort({
        firstName: 1,
      });

    res.status(200).json(receivedUsers);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Something went wrong', error: error.message });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const loggedInUser = req.user._id;
    const regex = new RegExp(query, 'i');

    const users = await User.find({
      _id: { $ne: loggedInUser },
      $or: [
        { firstName: { $regex: regex } },
        { lastName: { $regex: regex } },
        {
          $expr: {
            $regexMatch: {
              input: { $concat: ['$firstName', ' ', '$lastName'] },
              regex: regex,
            },
          },
        },
      ],
    }).sort({ firstName: 1 });

    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Something went wrong', error: error.message });
  }
};

export const updateName = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;

    if (!firstName || !lastName) {
      return res
        .status(400)
        .json({ message: 'First name and last name are required' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { firstName, lastName },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Something went wrong', error: error.message });
  }
};

export const updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const newAvatar = await cloudinary.uploader.upload(req.file.path, {
      folder: 'avatars',
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: newAvatar.secure_url },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      avatar: updatedUser.avatar,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Something went wrong', error: error.message });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await User.findByIdAndUpdate(
      req.user._id,
      { password: hashedPassword },
      { new: true }
    );

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Something went wrong', error: error.message });
  }
};

export const deleteAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.avatar && user.avatar.includes('cloudinary.com')) {
      const avatarPublicId = user.avatar.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(avatarPublicId);
    }

    const defaultAvatar = `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: defaultAvatar },
      { new: true }
    );

    res.status(200).json({
      avatar: updatedUser.avatar,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Something went wrong', error: error.message });
  }
};
