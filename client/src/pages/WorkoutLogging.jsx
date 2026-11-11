import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Send, Clock, Play } from 'lucide-react';

const WorkoutLogging = () => {
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [sets, setSets] = useState([{ reps: 10, weight: 20 }]);
  const [startTime] = useState(new Date());
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExercises = async () => {
      const { data } = await api.get('/exercises');
      setExercises(data);
    };
    fetchExercises();
  }, []);

  const addSet = () => setSets([...sets, { reps: 10, weight: 20 }]);
  const removeSet = (index) => setSets(sets.filter((_, i) => i !== index));
  const updateSet = (index, field, value) => {
    const newSets = [...sets];
    newSets[index][field] = Number(value);
    setSets(newSets);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/workouts', {
        exerciseId: selectedExercise,
        sets,
        startTime,
        endTime: new Date()
      });
      navigate('/');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to log workout');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px' }}>
      <div className="glass card fade-in">
        <h2 className="gradient-text" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Play size={24} color="var(--primary)" /> Log Your Session
        </h2>

        <div className="input-group">
          <label>Select Exercise</label>
          <select value={selectedExercise} onChange={(e) => setSelectedExercise(e.target.value)} required>
            <option value="">-- Choose Exercise --</option>
            {exercises.map(ex => (
              <option key={ex._id} value={ex._id}>{ex.name} ({ex.category})</option>
            ))}
          </select>
        </div>

        <div style={{ margin: '30px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ fontSize: '1.2rem' }}>Sets & Reps</h3>
            <button onClick={addSet} className="btn" style={{ background: 'var(--surface)', color: 'var(--primary)', border: '1px solid var(--primary)' }}>
              <Plus size={18} /> Add Set
            </button>
          </div>

          {sets.map((set, index) => (
            <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 50px', gap: '15px', marginBottom: '15px', alignItems: 'end' }}>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Weight (kg)</label>
                <input type="number" value={set.weight} onChange={(e) => updateSet(index, 'weight', e.target.value)} />
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Reps</label>
                <input type="number" value={set.reps} onChange={(e) => updateSet(index, 'reps', e.target.value)} />
              </div>
              <button onClick={() => removeSet(index)} style={{ background: 'transparent', border: 'none', color: 'var(--error)', cursor: 'pointer', paddingBottom: '12px' }}>
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        <div style={{ background: 'var(--surface)', padding: '15px', borderRadius: '12px', marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Clock size={20} color="var(--text-muted)" />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Started {startTime.toLocaleTimeString()}</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Estimated Points</div>
            <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--primary)' }}>
              {selectedExercise ? (
                (exercises.find(ex => ex._id === selectedExercise)?.basePoints || 10) + 
                sets.reduce((sum, s) => sum + (Number(s.weight || 0) * Number(s.reps || 0)), 0)
              ) : 0} pts
            </div>
          </div>
        </div>

        <button onClick={handleSubmit} className="btn btn-primary" style={{ width: '100%', padding: '15px' }} disabled={!selectedExercise}>
          <Send size={20} /> Submit Workout
        </button>
      </div>
    </div>
  );
};

export default WorkoutLogging;
