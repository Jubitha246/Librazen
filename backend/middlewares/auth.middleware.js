import jwt from 'jsonwebtoken';
import User from '../model/user.model.js';

// Middleware to check if the user is authenticated
export const isAuth = async (req, res, next) => {
  try {
    // Extract token from the Authorization header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) return res.status(401).json({ message: 'Invalid token' });
    // Find the user by ID
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found' });
    // Attach the user to the request object
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};
// Middleware to check if the user is an admin
export const isAdmin = (req, res, next) => {
  if (req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied' });
  }
};
