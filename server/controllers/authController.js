const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const User   = require('../models/User');

exports.register = async (req, res) => {
  try {
    const { fullName, email, password, college, department, year, bloc } = req.body;

    if (!fullName || !email || !password || !college || !department || !year || !bloc)
      return res.status(400).json({ message: 'Please fill in all fields.' });

    const existing = await User.findByEmail(email);
    if (existing)
      return res.status(400).json({ message: 'Email is already registered.' });

    const hashed = await bcrypt.hash(password, 10);
    const id     = await User.create({ fullName, email, password: hashed, college, department, year, bloc });
    const token  = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ token, user: { id, fullName, email, role: 'student' } });

  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Please fill in all fields.' });

    const user = await User.findByEmail(email);
    if (!user)
      return res.status(400).json({ message: 'Invalid email or password.' });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: 'Invalid email or password.' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        role: user.role,
        college: user.college,
        course: user.department,  
        year: user.year,
        bloc: user.bloc
      },
    });

  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error.' });
  }
};