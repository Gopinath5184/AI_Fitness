import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Flame, Award, History, TrendingUp, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const StudentDashboard = () => {
  const [workouts, setWorkouts] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get('/workouts/my');
        setWorkouts(data);
      } catch (err) {
        console.error('Failed to fetch history:', err);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '700' }}>Hey, <span className="gradient-text">{user?.name}</span>! 👋</h1>
        <p style={{ color: 'var(--text-muted)' }}>Ready to crush your goals today?</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div className="glass card" style={{ textAlign: 'center' }}>
          <Flame size={40} color="#ff4b2b" style={{ marginBottom: '10px' }} />
          <h3 style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Current Streak</h3>
          <p style={{ fontSize: '2rem', fontWeight: '700' }}>{user?.streak || 0} Days</p>
        </div>
        <div className="glass card" style={{ textAlign: 'center' }}>
          <Award size={40} color="var(--primary)" style={{ marginBottom: '10px' }} />
          <h3 style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Total Points</h3>
          <p style={{ fontSize: '2rem', fontWeight: '700' }}>{user?.points || 0}</p>
        </div>
        <div className="glass card" style={{ textAlign: 'center' }}>
          <TrendingUp size={40} color="var(--accent)" style={{ marginBottom: '10px' }} />
          <h3 style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Consistency</h3>
          <p style={{ fontSize: '2rem', fontWeight: '700' }}>{user?.consistencyScore || 85}%</p>
        </div>
      </div>

      <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <History size={24} color="var(--primary)" />
          <h2 style={{ fontSize: '1.5rem' }}>Recent Activity</h2>
        </div>

        <div style={{ display: 'grid', gap: '15px' }}>
          {workouts.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>No workouts logged yet. Start your journey!</p>
          ) : (
            workouts.map(workout => (
              <div key={workout._id} className="glass" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '600', margin: 0 }}>{workout.exercise?.name}</h3>
                    <span style={{ background: 'rgba(56, 189, 248, 0.1)', color: 'var(--primary)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '700' }}>
                      +{workout.pointsAwarded} pts
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '15px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> {workout.duration < 1 ? '< 1' : Math.round(workout.duration)} mins</span>
                    <span>{workout.sets?.length} Sets</span>
                  </div>
                  <div style={{ marginTop: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {workout.sets?.map((s, i) => (
                      <span key={i} style={{ background: 'var(--surface)', padding: '2px 8px', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {s.weight}kg × {s.reps}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                    {workout.status === 'approved' ? (
                      <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={14} /> Approved</span>
                    ) : workout.status === 'pending' ? (
                      <span style={{ color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={14} /> Pending</span>
                    ) : (
                      <span style={{ color: 'var(--error)' }}>Rejected</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default StudentDashboard;
