import jwt from 'jsonwebtoken';
import User from '../models/user-model.js';

const protectRoute = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res
        .status(401)
        .json({ error: 'Unauthorized - no refresh token provided!' });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    if (!decoded) {
      return res
        .status(401)
        .json({ error: 'Unauthorized - invalid refresh token!' });
    }

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found!' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log('Error in protectRoute middleware: ', error.message);
    res
      .status(500)
      .json({ message: 'Something went wrong', error: error.message });
  }
};

export default protectRoute;
