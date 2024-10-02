import User from '../models/user-model.js';

export const getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
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
    const receivedUsers = await User.find({ _id: { $ne: loggedInUser } }).sort({
      firstName: 1,
    });

    res.status(200).json(receivedUsers);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Something went wrong', error: error.message });
  }
};
