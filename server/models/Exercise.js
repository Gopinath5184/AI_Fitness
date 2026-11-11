const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: String,
    enum: ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Cardio', 'Core'],
    required: true,
  },
  basePoints: {
    type: Number,
    required: true,
    default: 10,
  },
  expectedDuration: {
    type: Number, // in minutes
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner',
  },
  description: String,
}, { timestamps: true });

module.exports = mongoose.model('Exercise', exerciseSchema);
