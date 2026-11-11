import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Mail, Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      <div className="glass card fade-in" style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)' }}>Sign in to continue your fitness journey</p>
        </div>

        {error && <div style={{ background: 'rgba(255, 123, 114, 0.1)', color: 'var(--error)', padding: '10px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label><Mail size={16} /> Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="name@college.edu" />
          </div>

          <div className="input-group">
            <label><Lock size={16} /> Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', marginTop: '10px' }} disabled={loading}>
            {loading ? 'Signing in...' : <><LogIn size={20} /> Sign In</>}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '25px', color: 'var(--text-muted)' }}>
          New student? <Link to="/register" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' }}>Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
