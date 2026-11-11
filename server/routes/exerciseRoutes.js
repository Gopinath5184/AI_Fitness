const express = require('express');
const router = express.Router();
const { getExercises, createExercise, updateExercise, deleteExercise } = require('../controllers/exerciseController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getExercises)
  .post(protect, authorize('trainer'), createExercise);

router.route('/:id')
  .put(protect, authorize('trainer'), updateExercise)
  .delete(protect, authorize('trainer'), deleteExercise);

module.exports = router;
