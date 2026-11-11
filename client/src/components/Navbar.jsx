import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, LogOut, Award, Layout, PlusCircle, Settings, Users } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="glass" style={{ margin: '20px', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: '20px', zIndex: 100 }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'inherit' }}>
        <img src="https://cdn.vectorstock.com/i/1000v/95/42/gym-body-fitness-logo-man-and-woman-athletic-vector-47899542.jpg" alt="Gym" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
        <span style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '1px' }}>FLEX<span style={{ color: 'var(--primary)' }}>AI</span></span>
      </Link>

      <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
        <Link to="/" className="nav-link"><Layout size={20} /> Dashboard</Link>
        <Link to="/leaderboard" className="nav-link"><Award size={20} /> Leaderboard</Link>
        
        {user.role === 'student' && (
          <Link to="/log-workout" className="nav-link"><PlusCircle size={20} /> Log Workout</Link>
        )}
        
        {user.role === 'trainer' && (
          <>
            <Link to="/exercises" className="nav-link"><Settings size={20} /> Exercises</Link>
            <Link to="/users" className="nav-link"><Users size={20} /> Students</Link>
          </>
        )}

        <Link to="/settings" className="nav-link"><Settings size={20} /> Profile</Link>

        <button onClick={handleLogout} className="btn" style={{ background: 'transparent', color: 'var(--error)', border: '1px solid var(--error)' }}>
          <LogOut size={18} /> Logout
        </button>
      </div>

      <style>{`
        .nav-link {
          text-decoration: none;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
          transition: color 0.3s;
        }
        .nav-link:hover {
          color: var(--primary);
        }
      `}</style>
    </nav>
  );
};

export default Navbar;