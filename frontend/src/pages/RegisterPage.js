import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import API_BASE_URL from '../apiBaseUrl';
import mountainBg from '../images/health1.jpg';

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    role: 'student',
    rciId: '',
    department: '',
    year: '',
    rollNumber: ''
  });

  const { login } = useAuth();
 const { username, email, password, password2, role, rciId, department, year, rollNumber } = formData;
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('');

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
  e.preventDefault();

  if (password !== password2) {
    setMessage('⚠️ Passwords do not match');
    setMessageType('error');
    return;
  }

  if (!email.endsWith('@dbit.in')) {
    setMessage('❌ Only @dbit.in email addresses are allowed.');
    setMessageType('error');
    return;
  }

  // 🔹 Generate Grade/Year format
  let gradeYear = '';

  if (role === 'student') {
    gradeYear = `${year}_${department}_${rollNumber}`;
  }

  // 🔹 Data sent to backend
  const dataToSend = { username, email, password, role };

if (role === 'student') {
  dataToSend.profile = {
    department,
    year,
    rollNumber,
    grade: `${year}_${department}_${rollNumber}`
  };
}

if (role === 'counsellor') {
  dataToSend.rciId = rciId;
}

  if (role === 'student') {
    dataToSend.profile = {
      department,
      year,
      rollNumber,
      grade: gradeYear
    };
  }

  if (role === 'counsellor') {
    dataToSend.rciId = rciId;
  }

  try {
    const res = await axios.post(
      `${API_BASE_URL}/api/auth/register`,
      dataToSend
    );

    const { token, role: userRole, userId, username: returnedUsername } = res.data;

    login(token, userRole, userId, returnedUsername);

    localStorage.setItem('hasConsent', 'false');
    localStorage.setItem('hasCompletedAssessment', 'false');

    setMessage('✅ Registration successful! Redirecting...');
    setMessageType('success');

  } catch (error) {
    console.error('Registration failed:', error);
    setMessage(error.response?.data?.msg || '❌ Registration failed. Please try again.');
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
        <h2 style={styles.heading}>Create Your Account</h2>

        {message && (
          <div
            style={{
              ...styles.message,
              backgroundColor:
                messageType === 'success' ? 'rgba(46, 125, 50, 0.10)' : 'rgba(198, 40, 40, 0.2)',
              border: `1px solid ${messageType === 'success' ? '#81c784' : '#ef9a9a'}`,
              color: messageType === 'success' ? '#a5d6a7' : '#ffcdd2',
            }}
          >
            {message}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={onChange}
              required
              style={styles.input}
            />
          </div>
        

          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
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

          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              name="password2"
              value={password2}
              onChange={onChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Register as</label>
            <select name="role" value={role} onChange={onChange} style={styles.input}>
              <option value="student">Student</option>
              <option value="counsellor">Counsellor</option>
            </select>
          </div>
          {role === 'student' && (
  <>
    <div style={styles.formGroup}>
      <label style={styles.label}>Department</label>
      <select
        name="department"
        value={department}
        onChange={onChange}
        required
        style={styles.input}
      >
        <option value="">Select Department</option>
        <option value="IT">IT</option>
        <option value="COMPS">Comps</option>
        <option value="EXTC">EXTC</option>
        <option value="MECH">Mech</option>
      </select>
    </div>

    <div style={styles.formGroup}>
      <label style={styles.label}>Year</label>
      <select
        name="year"
        value={year}
        onChange={onChange}
        required
        style={styles.input}
      >
        <option value="">Select Year</option>
        <option value="FE">FE</option>
        <option value="SE">SE</option>
        <option value="TE">TE</option>
        <option value="BE">BE</option>
      </select>
    </div>

    <div style={styles.formGroup}>
      <label style={styles.label}>Roll Number</label>
      <input
        type="number"
        name="rollNumber"
        value={rollNumber}
        onChange={onChange}
        required
        style={styles.input}
      />
    </div>
  </>
)}

          {role === 'counsellor' && (
            <div style={styles.formGroup}>
              <label style={styles.label}>RCI ID</label>
              <input
                type="text"
                name="rciId"
                value={rciId}
                onChange={onChange}
                required
                style={styles.input}
              />
            </div>
          )}

          <button type="submit" style={styles.button}>
            Register
          </button>
        </form>

        <p style={styles.linkText}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>
            Login Here
          </Link>
        </p>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(40px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}

const styles = {
  page: {
  position: 'relative',
  minHeight: '100vh',
  width: '100%',
  overflowY: 'auto',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  padding: '40px 0',
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
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(15px)',
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
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
  },
  formGroup: {
    marginBottom: '25px',
    textAlign: 'left',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '1.1em',
    color: '#060210ff',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '10px',
    border: 'none',
    outline: 'none',
    background: 'rgba(255, 255, 255, 0.2)',
    color: '#fff',
    fontSize: '1em',
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
    color: '#ddd',
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

export default RegisterPage;