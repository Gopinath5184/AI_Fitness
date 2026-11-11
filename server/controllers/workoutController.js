const Workout = require('../models/Workout');
const Exercise = require('../models/Exercise');
const User = require('../models/User');
const { validateWorkout } = require('../utils/aiEngine');

// Log a workout (Student)
exports.logWorkout = async (req, res) => {
  try {
    const { exerciseId, sets, startTime, endTime } = req.body;
    
    const exercise = await Exercise.findById(exerciseId);
    if (!exercise) return res.status(404).json({ message: 'Exercise not found' });

    // AI Validation
    const validation = await validateWorkout(req.body, req.user._id);

    const duration = (new Date(endTime) - new Date(startTime)) / (1000 * 60);
    
    // Points Calculation: Base Points + Total Volume (Weight * Reps)
    const volumePoints = sets && sets.length > 0 ? sets.reduce((sum, s) => sum + ((s.weight || 0) * (s.reps || 0)), 0) : 0;
    const points = (exercise.basePoints || 10) + volumePoints;

    const workout = await Workout.create({
      user: req.user._id,
      exercise: exerciseId,
      sets,
      startTime,
      endTime,
      duration,
      confidenceScore: validation.score,
      status: validation.status,
      pointsAwarded: Math.round(points),
      aiFeedback: validation.feedback
    });

    if (validation.status === 'approved') {
      const user = await User.findById(req.user._id);
      if (user) {
        user.points += workout.pointsAwarded;
        user.lastWorkoutDate = new Date();
        await user.save();
      }
    }

    res.status(201).json(workout);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get User's History
exports.getMyWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user._id }).populate('exercise').sort({ createdAt: -1 });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Trainer: Get Pending Workouts
exports.getPendingWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ status: 'pending' })
      .populate('user', 'name registerNumber')
      .populate('exercise')
      .sort({ createdAt: -1 });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Trainer: Get All Workouts
exports.getAllWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find()
      .populate('user', 'name registerNumber')
      .populate('exercise')
      .sort({ createdAt: -1 });

    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Trainer: Verify Workout
exports.verifyWorkout = async (req, res) => {
  try {
    const { status, bonusPoints } = req.body;
    
    const workout = await Workout.findById(req.params.id);
    if (!workout) return res.status(404).json({ message: 'Workout not found' });

    workout.status = status;
    if (status === 'approved') {
      const user = await User.findById(workout.user);
      if (user) {
        user.points += workout.pointsAwarded + (bonusPoints || 0);
        await user.save();
      }
    }
    await workout.save();

    res.json({ message: 'Workout verified' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({ role: 'student' }).sort({ points: -1, streak: -1 }).limit(10).select('name points streak consistencyScore');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Trainer: Edit Workout
exports.editWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id).populate('exercise');
    if (!workout) return res.status(404).json({ message: 'Workout not found' });

    const oldPoints = workout.pointsAwarded;

    if (req.body.sets) {
      workout.sets = req.body.sets;
      const volumePoints = workout.sets.length > 0 ? workout.sets.reduce((sum, s) => sum + ((s.weight || 0) * (s.reps || 0)), 0) : 0;
      const basePoints = workout.exercise ? (workout.exercise.basePoints || 10) : 10;
      const newPoints = basePoints + volumePoints;
      
      workout.pointsAwarded = Math.round(newPoints);
    }
    
    if (req.body.status) workout.status = req.body.status;
    if (req.body.duration) workout.duration = req.body.duration;
    
    await workout.save();

    // Update user points if there's a difference and it is approved
    if (workout.status === 'approved' && oldPoints !== workout.pointsAwarded) {
       const user = await User.findById(workout.user);
       if (user) {
          user.points = user.points - oldPoints + workout.pointsAwarded;
          await user.save();
       }
    }

    res.json(workout);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Trainer: Delete Workout
exports.deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) return res.status(404).json({ message: 'Workout not found' });
    
    // If it was approved, maybe remove points? We'll just delete for now to keep it simple
    if (workout.status === 'approved') {
      const user = await User.findById(workout.user);
      if (user) {
        user.points -= workout.pointsAwarded;
        await user.save();
      }
    }
    
    await workout.deleteOne();
    res.json({ message: 'Workout deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
