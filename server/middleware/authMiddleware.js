const jwt  = require('jsonwebtoken');
const User = require('../models/User');

exports.verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer '))
      return res.status(401).json({ message: 'No token provided.' });

    const token   = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user    = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found.' });

    req.user = {
      id:       user.id,
      fullName: user.full_name,
      email:    user.email,
      role:     user.role,
      college:  user.college,
      course:   user.department,
      department: user.department,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};