const mongoose = require('mongoose');

const setSchema = new mongoose.Schema({
  reps: Number,
  weight: Number,
});

const workoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  exercise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise',
    required: true,
  },
  sets: [setSchema],
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number, // calculated in minutes
  },
  confidenceScore: {
    type: Number,
    default: 100,
  },
  status: {
    type: String,
    enum: ['approved', 'pending', 'rejected'],
    default: 'pending',
  },
  pointsAwarded: {
    type: Number,
    default: 0,
  },
  aiFeedback: String,
}, { timestamps: true });

module.exports = mongoose.model('Workout', workoutSchema);
