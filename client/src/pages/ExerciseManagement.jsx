import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit2, Trash2, Dumbbell } from 'lucide-react';

const ExerciseManagement = () => {
  const [exercises, setExercises] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  const [formData, setFormData] = useState({ name: '', category: 'Chest', basePoints: 10, expectedDuration: 30, difficulty: 'Beginner' });
  const { user } = useAuth();

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const { data } = await api.get('/exercises');
      setExercises(data);
    } catch (err) {
      console.error(err);
    }
  };

  const startEditing = (ex) => {
    setEditingExercise(ex._id);
    setFormData({
      name: ex.name,
      category: ex.category,
      basePoints: ex.basePoints,
      expectedDuration: ex.expectedDuration,
      difficulty: ex.difficulty
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingExercise) {
        await api.put(`/exercises/${editingExercise}`, formData);
      } else {
        await api.post('/exercises', formData);
      }
      setShowForm(false);
      setEditingExercise(null);
      setFormData({ name: '', category: 'Chest', basePoints: 10, expectedDuration: 30, difficulty: 'Beginner' });
      fetchExercises();
    } catch (err) {
      alert('Failed to save exercise');
    }
  };

  const deleteExercise = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/exercises/${id}`);
      fetchExercises();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const toggleForm = () => {
    if (showForm) {
      setEditingExercise(null);
      setFormData({ name: '', category: 'Chest', basePoints: 10, expectedDuration: 30, difficulty: 'Beginner' });
    }
    setShowForm(!showForm);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700' }}>Exercise <span className="gradient-text">Library</span></h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage the available exercises for students.</p>
        </div>
        <button onClick={toggleForm} className="btn btn-primary">
          <Plus size={20} /> {showForm ? 'Cancel' : 'Add New'}
        </button>
      </header>

      {showForm && (
        <div className="glass fade-in" style={{ padding: '30px', borderRadius: '16px', marginBottom: '40px' }}>
          <h2 style={{ marginBottom: '20px', fontSize: '1.2rem' }}>{editingExercise ? 'Edit Exercise' : 'Add New Exercise'}</h2>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div className="input-group">
              <label>Exercise Name</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className="input-group">
              <label>Category</label>
              <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                {['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Cardio', 'Core'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label>Base Points</label>
              <input type="number" value={formData.basePoints} onChange={(e) => setFormData({...formData, basePoints: e.target.value})} />
            </div>
            <div className="input-group">
              <label>Expected Duration (mins)</label>
              <input type="number" value={formData.expectedDuration} onChange={(e) => setFormData({...formData, expectedDuration: e.target.value})} />
            </div>
            <div className="input-group">
              <label>Difficulty</label>
              <select value={formData.difficulty} onChange={(e) => setFormData({...formData, difficulty: e.target.value})}>
                {['Beginner', 'Intermediate', 'Advanced'].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <button type="submit" className="btn btn-primary" style={{ width: '200px' }}>{editingExercise ? 'Update Exercise' : 'Save Exercise'}</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {exercises.map(ex => (
          <div key={ex._id} className="glass card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <Dumbbell size={24} color="var(--primary)" />
              <div>
                <h3 style={{ fontSize: '1.1rem' }}>{ex.name}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{ex.category} • {ex.difficulty}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>Base: {ex.basePoints} pts</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => startEditing(ex)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><Edit2 size={18} /></button>
              <button onClick={() => deleteExercise(ex._id)} style={{ background: 'transparent', border: 'none', color: 'var(--error)', cursor: 'pointer' }}><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExerciseManagement;
