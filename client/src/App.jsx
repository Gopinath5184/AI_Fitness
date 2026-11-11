import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import TrainerDashboard from './pages/TrainerDashboard';
import WorkoutLogging from './pages/WorkoutLogging';
import ExerciseManagement from './pages/ExerciseManagement';
import UserManagement from './pages/UserManagement';
import Leaderboard from './pages/Leaderboard';
import Settings from './pages/Settings';

const PrivateRoute = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route path="/" element={
                <PrivateRoute>
                  <DashboardRouter />
                </PrivateRoute>
              } />

              <Route path="/log-workout" element={
                <PrivateRoute role="student">
                  <WorkoutLogging />
                </PrivateRoute>
              } />

              <Route path="/exercises" element={
                <PrivateRoute role="trainer">
                  <ExerciseManagement />
                </PrivateRoute>
              } />

              <Route path="/users" element={
                <PrivateRoute role="trainer">
                  <UserManagement />
                </PrivateRoute>
              } />

              <Route path="/leaderboard" element={
                <PrivateRoute>
                  <Leaderboard />
                </PrivateRoute>
              } />

              <Route path="/settings" element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              } />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

const DashboardRouter = () => {
  const { user } = useAuth();
  return user.role === 'trainer' ? <TrainerDashboard /> : <StudentDashboard />;
};

export default App;
