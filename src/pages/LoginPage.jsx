import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { login } from '../api/auth';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, setAuth } = useAuth();
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('adminpassword123');
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const response = await login({ email, password });
      setAuth(response.user, response.tokens.accessToken, response.tokens.refreshToken);
      toast.success('Welcome back. Logged in successfully.');
      navigate('/');
    } catch (error) {
      const message = error?.response?.data?.message || 'Login failed. Please verify your credentials.';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="login-shell">
      <section className="login-card">
        <p className="eyebrow">Supervisor Access</p>
        <h1>University Course Management</h1>
        <p className="subtitle">Sign in to manage course records from one secure dashboard.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="username"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
            />
          </label>

          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="hint">Pre-filled test account is ready for quick evaluation.</p>
      </section>
    </main>
  );
}

export default LoginPage;
