import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthCard from '../components/AuthCard.jsx';
import InputField from '../components/InputField.jsx';
import PasswordField from '../components/PasswordField.jsx';
import { registerUser } from '../utils/api.js';

const initialForm = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const nextErrors = {};

    if (!form.name.trim()) nextErrors.name = 'Full name is required.';
    if (!form.email.trim()) nextErrors.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Please provide a valid email.';
    if (!form.password) nextErrors.password = 'Password is required.';
    else if (form.password.length < 8) nextErrors.password = 'Use at least 8 characters.';
    if (!form.confirmPassword) nextErrors.confirmPassword = 'Please confirm your password.';
    else if (form.confirmPassword !== form.password) nextErrors.confirmPassword = 'Passwords do not match.';

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
      const response = await registerUser(form);
      setStatus({ type: 'success', message: response.message || 'Account created successfully.' });
      setTimeout(() => navigate('/login', { replace: true }), 1200);
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Could not create account.' });
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
          <h2>Built for dependable team operations.</h2>
        </div>
        <p className="brand-copy">
          Create a secure account to manage projects, approvals, and daily work from one place.
        </p>
      </div>

      <AuthCard
        title="Create account"
        subtitle="Set up your workspace in minutes."
        accent="linear-gradient(135deg, rgba(97, 163, 255, 0.8), rgba(32, 188, 170, 0.75))"
        footer={
          <p>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        }
      >
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <InputField
            id="name"
            name="name"
            label="Full name"
            value={form.name}
            onChange={handleChange}
            placeholder="Jordan Lee"
            autoComplete="name"
            error={errors.name}
            disabled={isSubmitting}
          />

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
            placeholder="Minimum 8 characters"
            autoComplete="new-password"
            error={errors.password}
            disabled={isSubmitting}
          />

          <PasswordField
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm password"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter password"
            autoComplete="new-password"
            error={errors.confirmPassword}
            disabled={isSubmitting}
          />

          {status.type === 'error' && <div className="form-status form-status--error">{status.message}</div>}
          {status.type === 'success' && <div className="form-status form-status--success">{status.message}</div>}

          <button className="primary-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>
      </AuthCard>
    </div>
  );
};

export default RegisterPage;
