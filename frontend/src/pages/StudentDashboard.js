import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import API_BASE_URL from '../apiBaseUrl';
import Chatbot from '../components/Chatbot';

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

  .dash-root {
    min-height: 100vh;
    background: var(--cream);
    font-family: 'DM Sans', sans-serif;
    position: relative;
    overflow-x: hidden;
  }

  .dash-root::before,
  .dash-root::after {
    content: '';
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
  }
  .dash-root::before {
    width: 700px; height: 700px;
    background: radial-gradient(circle, rgba(122,158,126,0.13) 0%, transparent 70%);
    top: -200px; right: -200px;
    animation: blobFloat1 18s ease-in-out infinite;
  }
  .dash-root::after {
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

  .dash-wrap {
    position: relative;
    z-index: 1;
    max-width: 1000px;
    margin: 0 auto;
    padding: 60px 24px 100px;
  }

  .dash-header {
    text-align: center;
    margin-bottom: 64px;
    opacity: 0;
    transform: translateY(28px);
    animation: fadeUp 0.9s cubic-bezier(.22,1,.36,1) 0.1s forwards;
  }

  .dash-eyebrow {
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

  .dash-title {
    font-family: 'Fraunces', Georgia, serif;
    font-size: clamp(2.2rem, 5vw, 3.4rem);
    font-weight: 300;
    color: var(--ink);
    line-height: 1.15;
    margin: 0 0 20px;
    letter-spacing: -0.02em;
  }

  .dash-title em {
    font-style: italic;
    color: var(--sage);
  }

  .dash-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 30px;
    opacity: 0;
    animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) 0.35s forwards;
  }

  .dash-card {
    background: var(--white);
    border-radius: var(--radius);
    padding: 32px 36px;
    box-shadow: var(--shadow-soft);
    border: 1px solid rgba(122,158,126,0.1);
    display: flex;
    flex-direction: column;
    transition: box-shadow 0.3s ease, transform 0.3s ease, border-color 0.3s ease;
  }

  .dash-card:hover {
    box-shadow: var(--shadow-mid);
    transform: translateY(-2px);
    border-color: rgba(122,158,126,0.22);
  }

  .dash-card-title {
    font-family: 'Fraunces', serif;
    font-size: 1.6rem;
    color: var(--ink-mid);
    margin-bottom: 24px;
    font-weight: 400;
  }

  .dash-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 16px;
    flex-grow: 1;
  }

  .dash-app-item {
    background: var(--cream);
    border: 1.5px solid var(--cream-warm);
    border-radius: var(--radius-sm);
    padding: 20px;
    transition: all 0.22s cubic-bezier(.22,1,.36,1);
  }
  .dash-app-item:hover {
    border-color: var(--sage-light);
    background: var(--sage-pale);
    transform: translateY(-2px);
  }

  .dash-app-name {
    font-family: 'Fraunces', serif;
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--sage);
    margin-bottom: 4px;
  }

  .dash-app-spec {
    font-size: 0.85rem;
    color: var(--ink-soft);
    margin-bottom: 12px;
  }

  .dash-app-time {
    display: inline-block;
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.05em;
    color: var(--clay);
    background: rgba(196,119,90,0.12);
    padding: 4px 12px;
    border-radius: 100px;
  }

  .dash-action-link {
    display: block;
    padding: 16px 20px;
    color: var(--ink);
    text-decoration: none;
    font-weight: 500;
    background: var(--cream);
    border: 1.5px solid var(--cream-warm);
    border-radius: var(--radius-sm);
    transition: all 0.22s cubic-bezier(.22,1,.36,1);
  }
  .dash-action-link:hover {
    border-color: var(--sage);
    background: var(--sage-pale);
    color: var(--ink-mid);
    transform: translateX(4px);
    box-shadow: 0 4px 16px rgba(122,158,126,0.15);
  }

  .dash-btn {
    display: inline-block;
    text-align: center;
    font-family: 'DM Sans', sans-serif;
    font-size: 1rem;
    font-weight: 500;
    color: var(--white);
    background: linear-gradient(135deg, var(--sage) 0%, #5a8a5f 100%);
    border: none;
    padding: 16px 32px;
    border-radius: 100px;
    cursor: pointer;
    letter-spacing: 0.02em;
    text-decoration: none;
    transition: all 0.3s cubic-bezier(.22,1,.36,1);
    box-shadow: 0 4px 20px rgba(122,158,126,0.35);
    margin-top: 24px;
    align-self: flex-start;
  }

  .dash-btn:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 8px 32px rgba(122,158,126,0.45);
    color: var(--white);
  }

  .dash-no-data {
    color: var(--ink-soft);
    font-style: italic;
    margin-bottom: 24px;
    flex-grow: 1;
  }

  .dash-divider {
    height: 1px;
    background: var(--cream-warm);
    margin: 8px 0;
  }

  @keyframes fadeUp {
    to { opacity: 1; transform: translateY(0); }
  }
`;

function StudentDashboard() {
  const { user } = useAuth();
  const userName = user?.username || "Student";
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChatbot, setShowChatbot] = useState(false);
  const styleRef = useRef(null);

  useEffect(() => {
    const el = document.createElement('style');
    el.textContent = CSS;
    document.head.appendChild(el);
    styleRef.current = el;
    return () => el.remove();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const token = localStorage.getItem('token');
        const [appointmentsRes, dassRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/appointments/upcoming`, {
            headers: { 'x-auth-token': token }
          }),
          axios.get(`${API_BASE_URL}/api/dass21/report/latest`, {
            headers: { 'x-auth-token': token }
          })
        ]);

        setUpcomingAppointments(appointmentsRes.data.appointments);
        
        if (dassRes.data?.latestResult?.recommendation === 'Yellow') {
          setShowChatbot(true);
        }

      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Could not load all dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="dash-root" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{fontFamily: "'Fraunces', serif", fontSize: '1.2rem', color: 'var(--ink-mid)', fontStyle: 'italic'}}>
          Loading your space...
        </div>
      </div>
    );
  }

  return (
    <div className="dash-root">
      <div className="dash-wrap">
        <header className="dash-header">
          <span className="dash-eyebrow">Student Portal</span>
          <h1 className="dash-title">Welcome back, <em>{userName}</em>.</h1>
          <p style={{color: 'var(--ink-soft)', maxWidth: '520px', margin: '0 auto', lineHeight: '1.75'}}>
            Manage your past and upcoming sessions, and retake assessments here.
          </p>
        </header>

        <div className="dash-grid">
          <div className="dash-card">
            <h3 className="dash-card-title">Appointments</h3>
            {error ? (
              <p className="dash-no-data" style={{color: 'var(--clay)'}}>{error}</p>
            ) : upcomingAppointments.length > 0 ? (
              <ul className="dash-list">
                {upcomingAppointments.map((app) => (
                  <li key={app._id} className="dash-app-item">
                    <div className="dash-app-name">{app.counselorName}</div>
                    <div className="dash-app-spec">{app.specialization}</div>
                    <div className="dash-app-time">
                      {new Date(app.date).toLocaleDateString()} at {app.time.split('-')[0]}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="dash-no-data">You have no upcoming appointments.</p>
            )}
            <Link to="/find-professional" className="dash-btn">Book a Session</Link>
          </div>

          <div className="dash-card">
            <h3 className="dash-card-title">Quick Actions</h3>
            <ul className="dash-list" style={{gap: '12px'}}>
              <li><Link to="/find-professional" className="dash-action-link">Find a New Psychiatrist</Link></li>
              <li><Link to="/assessment" className="dash-action-link">Retake Assessment</Link></li>
              <li><Link to="/assessment-report" className="dash-action-link">View Latest Report</Link></li>
              <li><Link to="/session-history" className="dash-action-link">View Session History</Link></li> 
              <li><Link to="/manage-profile" className="dash-action-link">Manage Profile</Link></li>
              <li className="dash-divider"></li>
              
            </ul>
          </div>
        </div>
      </div>
      {showChatbot && <Chatbot />}
    </div>
  );
}

export default StudentDashboard;