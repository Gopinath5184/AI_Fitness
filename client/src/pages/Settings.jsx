import { useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Settings as SettingsIcon, Save } from 'lucide-react';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    registerNumber: user?.registerNumber || '',
    password: ''
  });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put('/users/profile', formData);
      updateUser(data);
      setFormData(prev => ({ ...prev, password: '' }));
      setMessage('Profile updated successfully!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <SettingsIcon size={60} color="var(--primary)" style={{ marginBottom: '15px' }} />
        <h1 style={{ fontSize: '2.5rem', fontWeight: '700' }}>Account <span className="gradient-text">Settings</span></h1>
      </header>

      <div className="glass fade-in" style={{ padding: '30px', borderRadius: '16px' }}>
        {message && <div style={{ padding: '10px', marginBottom: '20px', background: 'var(--surface)', borderRadius: '8px', textAlign: 'center', color: message.includes('failed') ? 'var(--error)' : 'var(--success)' }}>{message}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
          <div className="input-group">
            <label>Full Name</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          </div>
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          </div>
          <div className="input-group">
            <label>Register Number</label>
            <input type="text" value={formData.registerNumber} onChange={(e) => setFormData({...formData, registerNumber: e.target.value})} required={user?.role === 'student'} />
          </div>
          <div className="input-group">
            <label>New Password (leave blank to keep current)</label>
            <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
            <Save size={20} /> Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
