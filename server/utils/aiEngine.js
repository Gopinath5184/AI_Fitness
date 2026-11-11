const Workout = require('../models/Workout');

const validateWorkout = async (workoutData, userId) => {
  let score = 100;
  let feedback = [];

  const { exerciseId, sets, startTime, endTime } = workoutData;
  const start = new Date(startTime);
  const end = new Date(endTime);
  const durationMs = end - start;
  const durationMins = durationMs / (1000 * 60);

  // 1. Rule: Minimum Duration (e.g., 15 mins for a valid session)
  if (durationMins < 5) {
    score -= 30;
    feedback.push('Workout duration is unusually short.');
  }

  // 2. Rule: Extremely Fast Logging (e.g., < 2 mins per set)
  const timePerSet = durationMins / (sets ? sets.length : 1);
  if (timePerSet < 2) {
    score -= 20;
    feedback.push('Logging speed suggests manual entry without breaks.');
  }

  // 3. Rule: Check for Unrealistic Weight Increase
  const previousWorkout = await Workout.findOne({ user: userId, exercise: exerciseId }).sort({ createdAt: -1 });

  if (previousWorkout && previousWorkout.sets && sets) {
    const prevMaxWeight = Math.max(...previousWorkout.sets.map(s => s.weight));
    const currentMaxWeight = Math.max(...sets.map(s => s.weight));

    if (currentMaxWeight > prevMaxWeight * 1.5) { // 50% jump in one session
      score -= 40;
      feedback.push('Significant weight jump detected. Please verify form.');
    }
    
    // 4. Rule: Identical Logs (Spam detection)
    const prevSetsString = JSON.stringify(previousWorkout.sets.map(s => ({ r: s.reps, w: s.weight })));
    const currSetsString = JSON.stringify(sets.map(s => ({ r: s.reps, w: s.weight })));
    
    if (prevSetsString === currSetsString) {
      score -= 20;
      feedback.push('Identical sets to previous workout detected.');
    }
  }

  // Final score clamping
  score = Math.max(0, score);

  return {
    score,
    feedback: feedback.join(' '),
    status: score > 80 ? 'approved' : 'pending', 
  };
};

module.exports = { validateWorkout };
