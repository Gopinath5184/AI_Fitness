const express = require('express');
const router = express.Router();
const { logWorkout, getMyWorkouts, getPendingWorkouts, verifyWorkout, getLeaderboard } = require('../controllers/workoutController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('student'), logWorkout);
router.get('/my', protect, getMyWorkouts);
router.get('/pending', protect, authorize('trainer'), getPendingWorkouts);
router.get('/all', protect, authorize('trainer'), require('../controllers/workoutController').getAllWorkouts);
router.put('/verify/:id', protect, authorize('trainer'), verifyWorkout);
router.get('/leaderboard', protect, getLeaderboard);

// Trainer management routes
router.route('/:id')
  .put(protect, authorize('trainer'), exports.editWorkout || require('../controllers/workoutController').editWorkout)
  .delete(protect, authorize('trainer'), exports.deleteWorkout || require('../controllers/workoutController').deleteWorkout);

module.exports = router;
