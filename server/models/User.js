const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  registerNumber: {
    type: String,
    unique: true,
    sparse: true, // Only for students
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['student', 'trainer'],
    default: 'student',
  },
  points: {
    type: Number,
    default: 0,
  },
  streak: {
    type: Number,
    default: 0,
  },
  lastWorkoutDate: {
    type: Date,
  },
  consistencyScore: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
