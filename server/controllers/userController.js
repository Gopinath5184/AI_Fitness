const User = require('../models/User');
const Workout = require('../models/Workout');

// Get all students (Trainer only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'student' }).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a student manually (Trainer only)
exports.createStudentManually = async (req, res) => {
  try {
    const { name, email, registerNumber, password } = req.body;
    
    const userExists = await User.findOne({ $or: [{ email }, { registerNumber }] });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, registerNumber, password, role: 'student' });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a user and their data (Trainer only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    await Workout.deleteMany({ user: req.params.id });
    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User and all associated data deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update student profile
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, email, registerNumber, password } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;
    if (registerNumber) user.registerNumber = registerNumber;
    if (password) user.password = password; 

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      registerNumber: user.registerNumber,
      role: user.role
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Adjust user points (Trainer only)
exports.adjustPoints = async (req, res) => {
  try {
    const { points } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.points += Number(points);
    if (user.points < 0) user.points = 0;
    
    await user.save();
    res.json({ message: 'Points adjusted successfully', points: user.points });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
