import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="logo">AccountHub</div>
        <nav>
          <Link to="/dashboard" className="nav-link active">Dashboard</Link>
          <Link to="/settings" className="nav-link">Settings</Link>
          <button onClick={logout} className="btn btn-outline">
            Logout
          </button>
        </nav>
      </header>

      <main className="dashboard-content">
        <div className="welcome-card">
          <h1>Welcome back, {user?.name}</h1>
          <p>Here's an overview of your account.</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Email</h3>
            <p>{user?.email}</p>
          </div>
          <div className="stat-card">
            <h3>Member Since</h3>
            <p>
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : 'Just now'}
            </p>
          </div>
          <div className="stat-card">
            <h3>Account Status</h3>
            <p className="status-active">Active</p>
          </div>
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-row">
            <Link to="/settings" className="action-btn">
              Edit Profile
            </Link>
            <Link to="/settings" className="action-btn">
              Change Password
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
