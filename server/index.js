require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
// app.use(morgan('dev'));

// MongoDB Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

const seedData = async () => {
  try {
    const User = require('./models/User');
    const Exercise = require('./models/Exercise');
    const Workout = require('./models/Workout');
    
    // Check for Gopi (now Student)
    let gopi = await User.findOne({ email: 'gopi@gmail.com' });
    if (gopi) {
      gopi.role = 'student';
      gopi.password = 'gopi@#123';
      await gopi.save();
    } else {
      await User.create({
        name: 'Gopi Student',
        email: 'gopi@gmail.com',
        password: 'gopi@#123',
        role: 'student'
      });
    }

    // Check for Trainer
    let trainer = await User.findOne({ email: 'trainer@gmail.com' });
    if (trainer) {
      trainer.role = 'trainer';
      trainer.password = 'pass@#123';
      await trainer.save();
    } else {
      await User.create({
        name: 'Main Trainer',
        email: 'trainer@gmail.com',
        password: 'pass@#123',
        role: 'trainer'
      });
    }
    console.log('Credentials updated: Student (gopi@gmail.com), Trainer (trainer@gmail.com)');


      // Create an Exercise if it doesn't exist
      let exercise = await Exercise.findOne({ name: 'Bench Press' });
      if (!exercise) {
        exercise = await Exercise.create({
          name: 'Bench Press',
          category: 'Chest',
          basePoints: 20,
          expectedDuration: 30,
          difficulty: 'Intermediate'
        });
      }

      // Create a Workout for the student if it doesn't exist
      const studentId = gopi ? gopi._id : (await User.findOne({ email: 'gopi@gmail.com' }))?._id;
      if (studentId) {
        const workoutExists = await Workout.findOne({ user: studentId, exercise: exercise._id });
        if (!workoutExists) {
          await Workout.create({
            user: studentId,
            exercise: exercise._id,
            sets: [{ reps: 10, weight: 135 }, { reps: 8, weight: 145 }],
            startTime: new Date(Date.now() - 3600000), // 1 hour ago
            endTime: new Date(),
            duration: 45,
            status: 'approved',
            pointsAwarded: 20
          });
          console.log('Seed data created');
        }
      }
  } catch (err) {
    console.error('Seeding error:', err.message);
  }
};

const startMongo = async () => {
  const connectionOptions = {
    serverSelectionTimeoutMS: 5000, // Reduced from 10s to 5s for faster local fallback
    socketTimeoutMS: 45000,
    family: 4 // Use IPv4
  };

  const connectToLocal = async () => {
    try {
      console.log('Switching to Local In-Memory MongoDB...');
      await mongoose.disconnect();
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const localUri = mongoServer.getUri();
      await mongoose.connect(localUri);
      console.log('Connected to Local In-Memory MongoDB');
      await seedData();
    } catch (localErr) {
      console.error('Failed to start local MongoDB:', localErr.message);
    }
  };

  try {
    mongoose.set('strictQuery', false);
    
    // Initial connection to Atlas
    await mongoose.connect(MONGO_URI, connectionOptions);
    console.log('Connected to MongoDB Atlas');
    await seedData();

    // Listen for connection errors after initial success
    mongoose.connection.on('error', async (err) => {
      console.warn('⚠️ MongoDB Atlas Connection lost.');
      if (err.message.includes('timeout') || err.message.includes('ETIMEDOUT')) {
        await connectToLocal();
      }
    });

  } catch (err) {
    console.warn('⚠️ Could not connect to MongoDB Atlas (network block/timeout/credential issue).');
    await connectToLocal();
  }
};

startMongo();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/exercises', require('./routes/exerciseRoutes'));
app.use('/api/workouts', require('./routes/workoutRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Basic Route
app.get('/', (req, res) => {
  res.send('Fitness App API is running...');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`UI Link: http://localhost:5173`);
});
