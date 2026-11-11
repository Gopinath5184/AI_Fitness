# College Gym Fitness Community Application 🏋️‍♂️

A full-stack (MERN) AI-powered fitness platform designed for college gyms to manage student progress, validate workouts, and foster community engagement through gamification.

---

## 🚀 Key Features

### 1. **AI-Powered Workout Validation**
- Automatically evaluates logged workouts for authenticity using a custom-built rule engine.
- Flags suspicious activities such as unrealistic weight jumps, manual spamming, or unusually short durations.
- Confidence scores determine if a workout is automatically approved or sent for trainer review.

### 2. **Gamification & Rewards System**
- **Dynamic Points Formula**: `Points = Base Points + Total Volume (Weight × Reps)`.
- Real-time **Leaderboard** to encourage healthy competition among students.
- **Consistency Tracking**: Monitors workout streaks and calculates consistency scores.

### 3. **Role-Based Management**
- **Students**: Log workouts via a mobile-responsive interface and track their fitness journey.
- **Trainers**: Manage the exercise library, review flagged workouts, and edit student records for data integrity.

---

## 🛠️ Technology Stack

- **Frontend**: React.js, Vite, Framer Motion, Lucide React, Chart.js.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Atlas) with Mongoose ODM.
- **Security**: JWT Authentication, Role-Based Access Control (RBAC), Password Hashing (BcryptJS).

---

## 🏗️ Architecture

### **Database Schema**
- **User**: Profile data, role (Student/Trainer), total points, streaks, consistency score.
- **Exercise**: Name, category, base points, difficulty level, expected duration.
- **Workout**: User reference, exercise reference, sets (weight/reps), timestamps, AI feedback, approval status.

### **API Endpoints**
- `POST /api/auth/register` & `/api/auth/login`
- `GET /api/exercises` (Student/Trainer)
- `POST /api/exercises` & `PUT /api/exercises/:id` (Trainer Only)
- `POST /api/workouts` (Student)
- `GET /api/workouts/pending` (Trainer Review)
- `PUT /api/workouts/:id` (Trainer Edit)

---

## 🏃‍♂️ How to Run Locally

### 1. **Prerequisites**
- Node.js (v16+)
- MongoDB Atlas Account (or local MongoDB)

### 2. **Installation**
```bash
# Clone the repository
git clone <repo-url>

# Install dependencies for Server
cd server
npm install

# Install dependencies for Client
cd ../client
npm install
```

### 3. **Environment Variables**
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 4. **Run the Application**
```bash
# Start Server (from /server)
npm run dev

# Start Client (from /client)
npm run dev
```

---

## 🎯 Interview Talking Points

- **The Problem**: "Students often lose motivation or log fake data in fitness apps."
- **My Solution**: "I built a community-driven app with an AI validation layer that ensures points are earned fairly, making the gym experience more engaging and honest."
- **Technical Challenge**: "Implementing the role-based editing system where trainers can correct student logs while ensuring the points are automatically re-calculated correctly in the database."

---
*Created by [Your Name]*
