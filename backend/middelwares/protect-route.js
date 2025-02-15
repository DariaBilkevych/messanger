import jwt from 'jsonwebtoken';
import User from '../models/user-model.js';

const protectRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token =
      authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : null;

    if (!token) {
      return res
        .status(401)
        .json({ error: 'Unauthorized - no access token provided!' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
      return res
        .status(401)
        .json({ error: 'Unauthorized - invalid access token!' });
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
