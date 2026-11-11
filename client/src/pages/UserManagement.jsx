import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Trash2, Users, Mail, Hash, ShieldAlert } from 'lucide-react';

const UserManagement = () => {
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', registerNumber: '', password: 'studentpassword123' });
  const { user } = useAuth();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data } = await api.get('/users');
      setStudents(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users', formData);
      setShowForm(false);
      setFormData({ name: '', email: '', registerNumber: '', password: 'studentpassword123' });
      fetchStudents();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create student');
    }
  };

  const [userToDelete, setUserToDelete] = useState(null);

  const deleteUser = (id) => {
    setUserToDelete(id);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await api.delete(`/users/${userToDelete}`);
      fetchStudents();
      setUserToDelete(null);
    } catch (err) {
      alert('Delete failed');
      setUserToDelete(null);
    }
  };

  const adjustPoints = async (id, points) => {
    try {
      await api.put(`/users/${id}/points`, { points });
      fetchStudents();
    } catch (err) {
      alert('Failed to adjust points');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700' }}>Student <span className="gradient-text">Management</span></h1>
          <p style={{ color: 'var(--text-muted)' }}>Create, manage, and monitor student accounts.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <UserPlus size={20} /> {showForm ? 'Cancel' : 'Add Student'}
        </button>
      </header>

      {showForm && (
        <div className="glass fade-in" style={{ padding: '30px', borderRadius: '16px', marginBottom: '40px' }}>
          <h3 style={{ marginBottom: '20px' }}>Register New Student</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div className="input-group">
              <label>Full Name</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className="input-group">
              <label>College Email</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
            </div>
            <div className="input-group">
              <label>Register Number</label>
              <input type="text" value={formData.registerNumber} onChange={(e) => setFormData({...formData, registerNumber: e.target.value})} required />
            </div>
            <div className="input-group">
              <label>Initial Password</label>
              <input type="text" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <button type="submit" className="btn btn-primary" style={{ width: '200px' }}>Create Account</button>
            </div>
          </form>
        </div>
      )}

      <div className="glass" style={{ borderRadius: '20px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--surface)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '20px' }}>Student</th>
              <th style={{ padding: '20px' }}>Register #</th>
              <th style={{ padding: '20px' }}>Points</th>
              <th style={{ padding: '20px' }}>Streak</th>
              <th style={{ padding: '20px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '20px' }}>
                  <div style={{ fontWeight: '600' }}>{student.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{student.email}</div>
                </td>
                <td style={{ padding: '20px' }}>{student.registerNumber}</td>
                <td style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button onClick={() => adjustPoints(student._id, -10)} style={{ background: 'rgba(255, 123, 114, 0.1)', color: 'var(--error)', border: '1px solid var(--error)', borderRadius: '4px', padding: '2px 6px', cursor: 'pointer', fontSize: '0.8rem' }}>-10</button>
                  <span style={{ color: 'var(--primary)', fontWeight: 'bold', minWidth: '30px', textAlign: 'center' }}>{student.points}</span>
                  <button onClick={() => adjustPoints(student._id, 10)} style={{ background: 'rgba(63, 185, 80, 0.1)', color: 'var(--success)', border: '1px solid var(--success)', borderRadius: '4px', padding: '2px 6px', cursor: 'pointer', fontSize: '0.8rem' }}>+10</button>
                </td>
                <td style={{ padding: '20px' }}>{student.streak} 🔥</td>
                <td style={{ padding: '20px' }}>
                  <button onClick={() => deleteUser(student._id)} style={{ background: 'transparent', border: 'none', color: 'var(--error)', cursor: 'pointer' }}>
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {students.length === 0 && <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No students found.</div>}
      </div>

      {userToDelete && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="glass" style={{ padding: '30px', borderRadius: '16px', maxWidth: '400px', textAlign: 'center' }}>
            <h3 style={{ color: 'var(--error)', marginBottom: '15px' }}>Confirm Deletion</h3>
            <p style={{ marginBottom: '25px', color: 'var(--text-muted)' }}>Are you sure you want to delete this student and ALL their workout history? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button onClick={() => setUserToDelete(null)} className="btn" style={{ background: 'var(--surface)' }}>Cancel</button>
              <button onClick={confirmDelete} className="btn" style={{ background: 'var(--error)', color: 'white' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
