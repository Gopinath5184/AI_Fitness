const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register Student
exports.registerStudent = async (req, res) => {
  try {
    const { name, registerNumber, email, password } = req.body;

    const userExists = await User.findOne({ $or: [{ email }, { registerNumber }] });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email or register number' });
    }

    const user = await User.create({ name, registerNumber, email, password, role: 'student' });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      console.log(`✅ [Auth] Login successful for ${email}`);
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    }
    
    console.log(`❌ [Auth] Invalid credentials for ${email}`);
    res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    console.error(`❌ [Auth] Login error: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};
