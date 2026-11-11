const Exercise = require('../models/Exercise');

// Get all exercises
exports.getExercises = async (req, res) => {
  try {
    const exercises = await Exercise.find();
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create exercise (Trainer only)
exports.createExercise = async (req, res) => {
  try {
    const exercise = await Exercise.create(req.body);
    res.status(201).json(exercise);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update exercise (Trainer only)
exports.updateExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(exercise);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete exercise (Trainer only)
exports.deleteExercise = async (req, res) => {
  try {
    await Exercise.findByIdAndDelete(req.params.id);
    res.json({ message: 'Exercise removed' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

