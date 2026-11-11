import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Trophy, Medal, Crown } from 'lucide-react';

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data } = await api.get('/workouts/leaderboard');
        setLeaders(data);
      } catch (err) {
        console.error(err);
      }
    };
    
    // Fetch immediately
    fetchLeaderboard();
    
    // Set up polling every 5 seconds for live updates
    const intervalId = setInterval(fetchLeaderboard, 5000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const getRankIcon = (rank) => {
    if (rank === 0) return <Crown color="#FFD700" size={24} />;
    if (rank === 1) return <Medal color="#C0C0C0" size={24} />;
    if (rank === 2) return <Medal color="#CD7F32" size={24} />;
    return <span style={{ width: '24px', textAlign: 'center', fontWeight: 'bold', color: 'var(--text-muted)' }}>{rank + 1}</span>;
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <Trophy size={60} color="var(--primary)" style={{ marginBottom: '15px' }} />
        <h1 style={{ fontSize: '2.5rem', fontWeight: '700' }}><span className="gradient-text">Live Hall of Fame</span> <span style={{fontSize: '1rem', color: 'var(--success)', animation: 'pulse 2s infinite'}}>● Live</span></h1>
        <p style={{ color: 'var(--text-muted)' }}>Top performers across the community</p>
      </header>

      <div className="glass" style={{ borderRadius: '24px', overflow: 'hidden' }}>
        {leaders.map((leader, index) => (
          <div key={leader._id} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '20px 30px', 
            borderBottom: index !== leaders.length - 1 ? '1px solid var(--glass-border)' : 'none',
            background: leader._id === user._id ? 'rgba(0, 242, 254, 0.05)' : 'transparent'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              {getRankIcon(index)}
              <div>
                <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>{leader.name}</span>
                {leader._id === user._id && <span style={{ marginLeft: '10px', fontSize: '0.75rem', background: 'var(--primary)', color: '#000', padding: '2px 8px', borderRadius: '10px', fontWeight: '700' }}>YOU</span>}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Streak</div>
                <div style={{ fontWeight: '700', color: '#ff4b2b' }}>{leader.streak} 🔥</div>
              </div>
              <div style={{ textAlign: 'center', minWidth: '80px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Points</div>
                <div style={{ fontWeight: '700', fontSize: '1.2rem', color: 'var(--primary)' }}>{leader.points}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
