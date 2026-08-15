import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthCard from '../components/AuthCard.jsx';
import InputField from '../components/InputField.jsx';
import PasswordField from '../components/PasswordField.jsx';
import { useAuthStore } from '../store/authStore.js';
import { loginUser } from '../utils/api.js';

const initialForm = {
  email: '',
  password: '',
};

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const nextErrors = {};

    if (!form.email.trim()) nextErrors.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Provide a valid email.';

    if (!form.password) nextErrors.password = 'Password is required.';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
    if (status.type !== 'idle') setStatus({ type: 'idle', message: '' });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setStatus({ type: 'idle', message: '' });

    try {
      const response = await loginUser(form);
      login(response.data.user, response.data.token);
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Unable to sign in.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page-shell">
      <div className="auth-page-shell__brand">
        <div className="brand-mark">P</div>
        <div>
          <p className="eyebrow">ProDesk</p>
          <h2>Operational clarity for every account.</h2>
        </div>
        <p className="brand-copy">
          Monitor work, secure access, and keep your team moving with a single, reliable workspace.
        </p>
      </div>

      <AuthCard
        title="Sign in"
        subtitle="Access your workspace and continue where you left off."
        accent="linear-gradient(135deg, rgba(97, 163, 255, 0.9), rgba(115, 98, 255, 0.75))"
        footer={
          <p>
            Need an account? <Link to="/register">Create one</Link>
          </p>
        }
      >
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <InputField
            id="email"
            name="email"
            label="Email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="name@company.com"
            autoComplete="email"
            error={errors.email}
            disabled={isSubmitting}
          />

          <PasswordField
            id="password"
            name="password"
            label="Password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            autoComplete="current-password"
            error={errors.password}
            disabled={isSubmitting}
          />

          {status.type === 'error' && <div className="form-status form-status--error">{status.message}</div>}

          <button className="primary-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </AuthCard>
    </div>
  );
};

export default LoginPage;
