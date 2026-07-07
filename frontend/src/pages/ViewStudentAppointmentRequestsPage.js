import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import API_BASE_URL from '../apiBaseUrl';

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --sage: #7a9e7e;
    --sage-light: #a8c5ac;
    --sage-pale: #e8f0e9;
    --clay: #c4775a;
    --clay-light: #e8a98c;
    --ink: #1a1f1b;
    --ink-mid: #3d4a3f;
    --ink-soft: #6b7c6d;
    --cream: #f7f4ef;
    --cream-warm: #ede9e0;
    --white: #ffffff;
    --shadow-soft: 0 4px 24px rgba(26,31,27,0.07);
    --shadow-mid: 0 8px 40px rgba(26,31,27,0.12);
    --radius: 20px;
    --radius-sm: 12px;
  }

  .vreq-root {
    min-height: 100vh;
    background: var(--cream);
    font-family: 'DM Sans', sans-serif;
    position: relative;
    overflow-x: hidden;
  }

  .vreq-root::before,
  .vreq-root::after {
    content: '';
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
  }
  .vreq-root::before {
    width: 700px; height: 700px;
    background: radial-gradient(circle, rgba(122,158,126,0.13) 0%, transparent 70%);
    top: -200px; right: -200px;
    animation: blobFloat1 18s ease-in-out infinite;
  }
  .vreq-root::after {
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(196,119,90,0.09) 0%, transparent 70%);
    bottom: -100px; left: -100px;
    animation: blobFloat2 22s ease-in-out infinite;
  }

  @keyframes blobFloat1 {
    0%, 100% { transform: translate(0,0) scale(1); }
    50% { transform: translate(-40px, 60px) scale(1.08); }
  }
  @keyframes blobFloat2 {
    0%, 100% { transform: translate(0,0) scale(1); }
    50% { transform: translate(50px, -40px) scale(1.05); }
  }

  .vreq-wrap {
    position: relative;
    z-index: 1;
    max-width: 900px;
    margin: 0 auto;
    padding: 60px 24px 100px;
  }

  .vreq-header {
    text-align: center;
    margin-bottom: 50px;
    opacity: 0;
    transform: translateY(28px);
    animation: fadeUp 0.9s cubic-bezier(.22,1,.36,1) 0.1s forwards;
  }

  .vreq-eyebrow {
    display: inline-block;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--sage);
    background: rgba(122,158,126,0.12);
    padding: 6px 16px;
    border-radius: 100px;
    margin-bottom: 20px;
  }

  .vreq-title {
    font-family: 'Fraunces', Georgia, serif;
    font-size: clamp(2.2rem, 5vw, 3.4rem);
    font-weight: 300;
    color: var(--ink);
    line-height: 1.15;
    margin: 0 0 15px;
    letter-spacing: -0.02em;
  }

  .vreq-title em {
    font-style: italic;
    color: var(--sage);
  }

  .vreq-content {
    opacity: 0;
    animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) 0.35s forwards;
  }

  .vreq-list {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
    margin-bottom: 50px;
  }

  .vreq-item {
    background: var(--white);
    border-radius: var(--radius);
    padding: 30px;
    box-shadow: var(--shadow-soft);
    border: 1px solid rgba(122,158,126,0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: transform 0.22s, box-shadow 0.22s;
    gap: 20px;
    flex-wrap: wrap;
  }
  .vreq-item:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-mid);
  }

  .vreq-info p {
    margin: 0 0 8px;
    font-family: 'DM Sans', sans-serif;
    color: var(--ink-soft);
    font-size: 0.95rem;
  }
  .vreq-info p strong {
    color: var(--ink);
    font-weight: 600;
  }
  
  .vreq-details {
    background: var(--sage-pale);
    padding: 15px 25px;
    border-radius: var(--radius-sm);
    min-width: 200px;
  }
  .vreq-details p {
    margin: 0 0 5px;
    font-family: 'DM Sans', sans-serif;
    color: var(--ink-mid);
    line-height: 1.6;
  }
  .vreq-details p:last-child {
    margin: 0;
  }
  .vreq-details p strong {
    color: var(--ink-mid);
    font-weight: 600;
  }

  .vreq-actions {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
    align-items: center;
  }

  .vreq-btn {
    display: inline-block;
    text-align: center;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    font-weight: 500;
    color: var(--white);
    background: linear-gradient(135deg, var(--sage) 0%, #5a8a5f 100%);
    border: none;
    padding: 12px 24px;
    border-radius: 100px;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.3s cubic-bezier(.22,1,.36,1);
    box-shadow: 0 4px 15px rgba(122,158,126,0.3);
  }
  .vreq-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(122,158,126,0.4);
    color: var(--white);
  }

  .vreq-btn-sec {
    display: inline-block;
    text-align: center;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    font-weight: 500;
    color: var(--ink-mid);
    background: transparent;
    border: 1.5px solid var(--sage);
    padding: 12px 24px;
    border-radius: 100px;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.3s;
  }
  .vreq-btn-sec:hover {
    background: var(--sage-pale);
    color: var(--ink);
    transform: translateY(-2px);
  }

  .vreq-empty {
    text-align: center;
    background: var(--white);
    padding: 50px;
    border-radius: var(--radius);
    box-shadow: var(--shadow-soft);
    color: var(--ink-soft);
    font-style: italic;
    font-family: 'DM Sans', sans-serif;
    margin-bottom: 50px;
    font-size: 1.1rem;
  }

  @keyframes fadeUp {
    to { opacity: 1; transform: translateY(0); }
  }
`;

function ViewStudentAppointmentRequestsPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const styleRef = useRef(null);

  useEffect(() => {
    const el = document.createElement('style');
    el.textContent = CSS;
    document.head.appendChild(el);
    styleRef.current = el;
    return () => el.remove();
  }, []);

  useEffect(() => {
    fetchUpcomingAppointments();
  }, [user]);

  const fetchUpcomingAppointments = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/appointments/upcoming`, {
        headers: { 'x-auth-token': token }
      });
      setAppointments(res.data.appointments);
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
      setError('Could not load appointments.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsDone = async (appointmentId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/api/appointments/${appointmentId}/complete`, {}, {
        headers: { 'x-auth-token': token }
      });
      fetchUpcomingAppointments(); 
    } catch (err) {
      console.error('Failed to update appointment status:', err);
      alert('Could not update appointment. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="vreq-root" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{fontFamily: "'Fraunces', serif", fontSize: '1.2rem', color: 'var(--ink-mid)', fontStyle: 'italic'}}>
          Loading student requests...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="vreq-root" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{fontFamily: "'DM Sans', sans-serif", fontSize: '1.2rem', color: 'var(--clay)'}}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="vreq-root">
      <div className="vreq-wrap">
        <header className="vreq-header">
          <span className="vreq-eyebrow">Directory</span>
          <h1 className="vreq-title">Upcoming <em>Appointments</em></h1>
        </header>

        <div className="vreq-content">
          {appointments.length > 0 ? (
            <div className="vreq-list">
              {appointments.map(app => (
                <div key={app._id} className="vreq-item">
                  <div className="vreq-info">
                    <p style={{fontSize: '1.15rem', color: 'var(--ink)'}}><strong>{app.studentName}</strong></p>
                    <p>Booked on: {new Date(app.createdAt).toLocaleDateString()}</p>
                  </div>
                  
                  <div className="vreq-details">
                    <p><strong>Date:</strong> {new Date(app.date).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> {app.time}</p>
                  </div>
                  
                  <div className="vreq-actions">
                    <Link
                      to={`/counsellor/student-profile/${app.studentId?._id}`}
                      className="vreq-btn-sec"
                    >
                      View Profile
                    </Link>
                    <button 
                      onClick={() => handleMarkAsDone(app._id)} 
                      className="vreq-btn"
                    >
                      Mark as Done
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="vreq-empty">
              You have no upcoming appointments at this time.
            </div>
          )}

          <div style={{textAlign: 'center'}}>
             <Link to="/counsellor/dashboard" className="vreq-btn-sec" style={{borderStyle: 'dashed'}}>
                Back to Dashboard
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewStudentAppointmentRequestsPage;