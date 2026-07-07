import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import API_BASE_URL from '../apiBaseUrl';
import mountainBg from '../images/health1.jpg';

function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('');
  const { login } = useAuth();

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    // Optional email restriction
    /*
    if (!email.endsWith('@dbit.in')) {
      setMessage('❌ Only @dbit.in email addresses are allowed.');
      setMessageType('error');
      return;
    }
    */

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true } // ensures cookies/auth headers work
      );

      const { token, role, userId, username } = res.data;
      login(token, role, userId, username);

      localStorage.setItem('hasConsent', 'true');
      localStorage.setItem('hasCompletedAssessment', 'true');

      setMessage('✅ Login successful!');
      setMessageType('success');
    } catch (error) {
      console.error('Login failed:', error);

      const errorMsg =
        error.response?.data?.msg ||
        error.response?.data?.message ||
        '❌ Login failed. Please check your credentials.';
      setMessage(errorMsg);
      setMessageType('error');
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div style={styles.page}>
      <img src={mountainBg} alt="Background" style={styles.bgImage} />

      <div style={styles.container}>
        <h2 style={styles.heading}>Login to Your Account</h2>

        {message && (
          <div
            style={{
              ...styles.message,
              backgroundColor:
                messageType === 'success'
                  ? 'rgba(46, 125, 50, 0.15)'
                  : 'rgba(198, 40, 40, 0.15)',
              border: `1px solid ${
                messageType === 'success' ? '#81c784' : '#ef9a9a'
              }`,
              color: messageType === 'success' ? '#a5d6a7' : '#ffcdd2',
            }}
          >
            {message}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email ID</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              required
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>

        <p style={styles.linkText}>
          Don’t have an account?{' '}
          <Link to="/register" style={styles.link}>
            Register
          </Link>
        </p>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(40px); }
            to { opacity: 1; transform: translateY(0); }
          }

          button:hover {
            box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
            transform: scale(1.02);
          }
        `}
      </style>
    </div>
  );
}

const styles = {
  page: {
    position: 'relative',
    height: '100vh',
    width: '100%',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: 'brightness(70%)',
    zIndex: -1,
  },
  container: {
    background: 'rgba(255, 255, 255, 0.10)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(20px) saturate(150%)',
    WebkitBackdropFilter: 'blur(20px) saturate(150%)',
    borderRadius: '20px',
    boxShadow: '0 8px 40px rgba(0, 0, 0, 0.4)',
    padding: '40px 30px',
    width: '90%',
    maxWidth: '400px',
    boxSizing: 'border-box',
    textAlign: 'center',
    color: '#fff',
    animation: 'fadeIn 1.5s ease-in-out',
  },
  heading: {
    marginBottom: '30px',
    fontSize: '2em',
    fontWeight: '700',
    textShadow: '0 0 10px rgba(255, 255, 255, 0.4)',
  },
  formGroup: {
    marginBottom: '25px',
    textAlign: 'left',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '1.1em',
    color: '#ffffff',
    textShadow: '0 0 4px rgba(255, 255, 255, 0.5)',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    outline: 'none',
    background: 'rgba(255, 255, 255, 0.1)',
    color: '#fff',
    fontSize: '1em',
    transition: 'all 0.3s ease',
  },
  button: {
    width: '100%',
    padding: '12px',
    background: 'linear-gradient(135deg, #8e2de2, #4a00e0)',
    color: 'white',
    border: 'none',
    borderRadius: '25px',
    cursor: 'pointer',
    fontSize: '1.1em',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
  },
  linkText: {
    marginTop: '25px',
    color: '#eee',
  },
  link: {
    color: '#fff',
    fontWeight: 'bold',
    textDecoration: 'underline',
  },
  message: {
    marginBottom: '20px',
    padding: '12px',
    borderRadius: '8px',
    fontWeight: '600',
    textAlign: 'center',
  },
};

export default LoginPage;
