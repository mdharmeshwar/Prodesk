import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore.js';
import { getProtectedTasks } from '../utils/api.js';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, token, logout } = useAuthStore();
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!token) {
        navigate('/login', { replace: true });
        return;
      }

      try {
        const response = await getProtectedTasks(token);
        setTasks(response.data.tasks || []);
      } catch (error) {
        logout();
        navigate('/login', { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [logout, navigate, token]);

  const onLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="dashboard-shell">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Workspace</p>
          <h1>Dashboard</h1>
        </div>
        <button className="secondary-button" type="button" onClick={onLogout}>
          Log out
        </button>
      </header>

      <div className="dashboard-grid">
        <motion.section className="panel panel--highlight" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <p className="eyebrow">Authenticated state</p>
          <h2>{user?.name || 'Team member'}</h2>
          <dl className="identity-list">
            <div>
              <dt>Email</dt>
              <dd>{user?.email || 'Not available'}</dd>
            </div>
            <div>
              <dt>User ID</dt>
              <dd>{user?.id || user?._id || 'Unknown'}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>Authenticated</dd>
            </div>
          </dl>
        </motion.section>

        <motion.section className="panel" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <p className="eyebrow">Protected access</p>
          <h2>Session status</h2>
          {isLoading ? (
            <div className="inline-loading">Loading secure workspace…</div>
          ) : (
            <div className="task-list">
              {tasks.map((task) => (
                <div className="task-item" key={task.id}>
                  <span className="task-badge">{task.status}</span>
                  <span>{task.title}</span>
                </div>
              ))}
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
};

export default DashboardPage;
