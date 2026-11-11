const express = require('express');
const router = express.Router();
const { getAllUsers, createStudentManually, deleteUser, updateProfile, adjustPoints } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/profile')
  .put(protect, updateProfile);

router.route('/')
  .get(protect, authorize('trainer'), getAllUsers)
  .post(protect, authorize('trainer'), createStudentManually);

router.route('/:id')
  .delete(protect, authorize('trainer'), deleteUser);

router.route('/:id/points')
  .put(protect, authorize('trainer'), adjustPoints);

module.exports = router;
