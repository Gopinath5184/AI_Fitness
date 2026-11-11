import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Hash } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', registerNumber: '', password: '' });
  const [error, setError] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await register(formData);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      <div className="glass card fade-in" style={{ width: '100%', maxWidth: '450px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Join FlexAI</h2>
          <p style={{ color: 'var(--text-muted)' }}>Start tracking your gains today</p>
        </div>

        {error && <div style={{ background: 'rgba(255, 123, 114, 0.1)', color: 'var(--error)', padding: '10px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label><User size={16} /> Full Name</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required placeholder="John Doe" />
          </div>

          <div className="input-group">
            <label><Hash size={16} /> Register Number</label>
            <input type="text" value={formData.registerNumber} onChange={(e) => setFormData({...formData, registerNumber: e.target.value})} required placeholder="REG123456" />
          </div>

          <div className="input-group">
            <label><Mail size={16} /> College Email</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required placeholder="john@college.edu" />
          </div>

          <div className="input-group">
            <label><Lock size={16} /> Password</label>
            <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required placeholder="••••••••" />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', marginTop: '10px' }} disabled={loading}>
            {loading ? 'Creating Account...' : <><UserPlus size={20} /> Register</>}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '25px', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' }}>Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
