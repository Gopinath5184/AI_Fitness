import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, User, Check, X, Info, Edit3, Trash2, List } from 'lucide-react';

const TrainerDashboard = () => {
  const [workouts, setWorkouts] = useState([]);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'all'
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [editForm, setEditForm] = useState({ duration: 0, pointsAwarded: 0, status: 'pending', sets: [] });

  useEffect(() => {
    fetchWorkouts();
  }, [activeTab]);

  const fetchWorkouts = async () => {
    try {
      const endpoint = activeTab === 'pending' ? '/workouts/pending' : '/workouts/all';
      const { data } = await api.get(endpoint);
      setWorkouts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const verifyWorkout = async (id, status) => {
    try {
      await api.put(`/workouts/verify/${id}`, { status });
      fetchWorkouts();
    } catch (err) {
      alert('Verification failed');
    }
  };

  const startEditing = (workout) => {
    setEditingWorkout(workout._id);
    setEditForm({
      duration: Math.round(workout.duration),
      pointsAwarded: workout.pointsAwarded,
      status: workout.status,
      sets: workout.sets.map(s => ({ ...s }))
    });
  };

  const handleSetChange = (index, field, value) => {
    const newSets = [...editForm.sets];
    newSets[index][field] = Number(value);
    setEditForm({ ...editForm, sets: newSets });
  };

  const addSet = () => {
    setEditForm({ ...editForm, sets: [...editForm.sets, { reps: 0, weight: 0 }] });
  };

  const removeSet = (index) => {
    const newSets = editForm.sets.filter((_, i) => i !== index);
    setEditForm({ ...editForm, sets: newSets });
  };

  const saveEdit = async () => {
    try {
      await api.put(`/workouts/${editingWorkout}`, editForm);
      setEditingWorkout(null);
      fetchWorkouts();
    } catch (err) {
      alert('Edit failed');
    }
  };

  const deleteWorkout = async (id) => {
    if (!window.confirm('Delete this workout?')) return;
    try {
      await api.delete(`/workouts/${id}`);
      fetchWorkouts();
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '700' }}>Trainer <span className="gradient-text">Control Center</span> 🛡️</h1>
        <p style={{ color: 'var(--text-muted)' }}>Validate student activities, edit records, and maintain community integrity.</p>
      </header>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <button 
          onClick={() => setActiveTab('pending')}
          className="btn" 
          style={{ background: activeTab === 'pending' ? 'var(--primary)' : 'var(--surface)', color: 'white' }}
        >
          <ShieldCheck size={20} /> Pending Reviews
        </button>
        <button 
          onClick={() => setActiveTab('all')}
          className="btn" 
          style={{ background: activeTab === 'all' ? 'var(--primary)' : 'var(--surface)', color: 'white' }}
        >
          <List size={20} /> All Workouts
        </button>
      </div>

      <section>
        <div style={{ display: 'grid', gap: '20px' }}>
          {workouts.length === 0 ? (
            <div className="glass" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              {activeTab === 'pending' ? 'All clear! No pending workouts for review.' : 'No workouts found.'}
            </div>
          ) : (
            workouts.map(workout => (
              <div key={workout._id} className="glass card" style={{ padding: '25px', display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', minWidth: '200px' }}>
                  <div style={{ background: 'var(--surface)', padding: '10px', borderRadius: '50%' }}>
                    <User size={24} color="var(--primary)" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem' }}>{workout.user?.name}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>ID: {workout.user?.registerNumber}</p>
                  </div>
                </div>

                <div style={{ flex: '1', minWidth: '250px' }}>
                  <h4 style={{ color: 'var(--primary)', marginBottom: '5px' }}>{workout.exercise?.name}</h4>
                  
                  {editingWorkout === workout._id ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '10px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div className="input-group">
                          <label>Duration (min)</label>
                          <input type="number" value={editForm.duration} onChange={e => setEditForm({...editForm, duration: e.target.value})} />
                        </div>
                        <div className="input-group">
                          <label>Status</label>
                          <select value={editForm.status} onChange={e => setEditForm({...editForm, status: e.target.value})} style={{ padding: '12px', background: 'var(--surface)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', borderRadius: '12px' }}>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>
                      </div>

                      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <h5 style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Sets Configuration</h5>
                          <button onClick={addSet} className="btn" style={{ padding: '5px 10px', fontSize: '0.8rem', background: 'var(--surface)' }}>+ Add Set</button>
                        </div>
                        {editForm.sets.map((set, index) => (
                          <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '8px', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', width: '20px' }}>{index + 1}.</span>
                            <input type="number" placeholder="Weight" value={set.weight} onChange={e => handleSetChange(index, 'weight', e.target.value)} style={{ flex: 1, padding: '8px' }} />
                            <input type="number" placeholder="Reps" value={set.reps} onChange={e => handleSetChange(index, 'reps', e.target.value)} style={{ flex: 1, padding: '8px' }} />
                            <button onClick={() => removeSet(index)} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }}><X size={16} /></button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                        {workout.sets.map((s, i) => (
                          <span key={i} style={{ background: 'var(--surface)', padding: '2px 8px', borderRadius: '6px', fontSize: '0.8rem' }}>
                            {s.weight}kg × {s.reps}
                          </span>
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: '15px' }}>
                        <span>Duration: {Math.round(workout.duration)} mins</span>
                        <span style={{ color: 'var(--primary)', fontWeight: '600' }}>Points: {workout.pointsAwarded}</span>
                        <span style={{ 
                          color: workout.status === 'approved' ? 'var(--success)' : 
                                 workout.status === 'rejected' ? 'var(--error)' : 'var(--warning)', 
                          fontWeight: '600', textTransform: 'capitalize' 
                        }}>
                          {workout.status}
                        </span>
                      </div>
                    </div>
                  )
                }       {workout.aiFeedback && !editingWorkout && (
                    <p style={{ marginTop: '10px', fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Info size={14} /> AI Flag: {workout.aiFeedback}
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', minWidth: '180px' }}>
                  {editingWorkout === workout._id ? (
                    <>
                      <button onClick={saveEdit} className="btn" style={{ background: 'var(--primary)', color: 'white' }}>Save</button>
                      <button onClick={() => setEditingWorkout(null)} className="btn" style={{ background: 'var(--surface)' }}>Cancel</button>
                    </>
                  ) : (
                    <>
                      {activeTab === 'pending' && (
                        <>
                          <button onClick={() => verifyWorkout(workout._id, 'approved')} className="btn" style={{ background: 'rgba(63, 185, 80, 0.1)', color: 'var(--success)', border: '1px solid var(--success)', padding: '8px' }}>
                            <Check size={18} />
                          </button>
                          <button onClick={() => verifyWorkout(workout._id, 'rejected')} className="btn" style={{ background: 'rgba(255, 123, 114, 0.1)', color: 'var(--error)', border: '1px solid var(--error)', padding: '8px' }}>
                            <X size={18} />
                          </button>
                        </>
                      )}
                      <button onClick={() => startEditing(workout)} className="btn" style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', border: '1px solid #38bdf8', padding: '8px' }}>
                        <Edit3 size={18} />
                      </button>
                      <button onClick={() => deleteWorkout(workout._id)} className="btn" style={{ background: 'rgba(255, 123, 114, 0.1)', color: 'var(--error)', border: '1px solid var(--error)', padding: '8px' }}>
                        <Trash2 size={18} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default TrainerDashboard;
