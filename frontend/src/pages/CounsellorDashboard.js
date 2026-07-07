import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

  .cdash-root {
    min-height: 100vh;
    background: var(--cream);
    font-family: 'DM Sans', sans-serif;
    position: relative;
    overflow-x: hidden;
  }

  .cdash-root::before,
  .cdash-root::after {
    content: '';
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
  }
  .cdash-root::before {
    width: 700px; height: 700px;
    background: radial-gradient(circle, rgba(122,158,126,0.13) 0%, transparent 70%);
    top: -200px; right: -200px;
    animation: blobFloat1 18s ease-in-out infinite;
  }
  .cdash-root::after {
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

  .cdash-wrap {
    position: relative;
    z-index: 1;
    max-width: 1000px;
    margin: 0 auto;
    padding: 60px 24px 100px;
  }

  .cdash-header {
    text-align: center;
    margin-bottom: 64px;
    opacity: 0;
    transform: translateY(28px);
    animation: fadeUp 0.9s cubic-bezier(.22,1,.36,1) 0.1s forwards;
  }

  .cdash-eyebrow {
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

  .cdash-title {
    font-family: 'Fraunces', Georgia, serif;
    font-size: clamp(2.2rem, 5vw, 3.4rem);
    font-weight: 300;
    color: var(--ink);
    line-height: 1.15;
    margin: 0 0 20px;
    letter-spacing: -0.02em;
  }

  .cdash-title em {
    font-style: italic;
    color: var(--sage);
  }

  .cdash-content {
    opacity: 0;
    animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) 0.35s forwards;
  }

  .cdash-urgent-card {
    background: var(--white);
    border-radius: var(--radius);
    padding: 40px;
    box-shadow: var(--shadow-mid);
    border: 1px solid rgba(196,119,90,0.2);
    margin-bottom: 50px;
    position: relative;
    overflow: hidden;
  }
  .cdash-urgent-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; width: 6px; height: 100%;
    background: var(--clay);
  }

  .cdash-section-heading {
    font-family: 'Fraunces', serif;
    font-size: 1.8rem;
    color: var(--ink-mid);
    margin-bottom: 30px;
    font-weight: 400;
    text-align: center;
  }

  .cdash-urgent-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .cdash-urgent-item {
    background: var(--cream);
    border: 1.5px solid var(--cream-warm);
    border-radius: var(--radius-sm);
    padding: 20px 25px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.22s ease;
  }

  .cdash-urgent-item:hover {
    border-color: var(--clay-light);
    transform: translateY(-2px);
    box-shadow: var(--shadow-soft);
  }

  .cdash-urgent-info p {
    margin: 0 0 5px;
    font-family: 'DM Sans', sans-serif;
    color: var(--ink-soft);
  }

  .cdash-urgent-name {
    font-size: 1.15rem;
    color: var(--ink);
    font-weight: 600;
  }

  .cdash-urgent-zone {
    color: var(--clay);
    font-weight: 600;
    display: inline-block;
    background: rgba(196,119,90,0.1);
    padding: 2px 10px;
    border-radius: 100px;
    font-size: 0.85rem;
    margin-left: 8px;
  }

  .cdash-urgent-btn {
    display: inline-block;
    text-align: center;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    font-weight: 500;
    color: var(--white);
    background: linear-gradient(135deg, var(--clay) 0%, #a85e42 100%);
    border: none;
    padding: 12px 24px;
    border-radius: 100px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(.22,1,.36,1);
    box-shadow: 0 4px 15px rgba(196,119,90,0.3);
  }

  .cdash-urgent-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(196,119,90,0.4);
  }

  .cdash-no-data {
    text-align: center;
    color: var(--ink-soft);
    font-style: italic;
    background: var(--cream);
    padding: 20px;
    border-radius: var(--radius-sm);
  }

  .cdash-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 25px;
  }

  .cdash-link-card {
    background: var(--white);
    border-radius: var(--radius);
    padding: 30px;
    box-shadow: var(--shadow-soft);
    border: 1px solid rgba(122,158,126,0.1);
    text-align: center;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 120px;
    transition: all 0.22s ease;
  }

  .cdash-link-card:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-mid);
    border-color: var(--sage-light);
    background: var(--sage-pale);
  }

  .cdash-link-text {
    font-family: 'Fraunces', serif;
    font-size: 1.25rem;
    color: var(--ink-mid);
    font-weight: 400;
  }

  @keyframes fadeUp {
    to { opacity: 1; transform: translateY(0); }
  }
`;

function CounsellorDashboard() {
  const { user } = useAuth();
  const userName = user?.username || "Counsellor";
  const [pendingReferrals, setPendingReferrals] = useState([]);
  const styleRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const el = document.createElement('style');
    el.textContent = CSS;
    document.head.appendChild(el);
    styleRef.current = el;
    return () => el.remove();
  }, []);

  useEffect(() => {
    const fetchRedStudents = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/api/dass21/reports/all-consented`, {
           headers: { 'x-auth-token': token }
        });
        const allReports = res.data.reports || [];
        
        // Filter for red and unique students
        const redStudentsMap = new Map();
        allReports.forEach(report => {
           if (report.recommendation === 'Red' && report.userId) {
              if (!redStudentsMap.has(report.userId._id)) {
                  redStudentsMap.set(report.userId._id, report);
              }
           }
        });
        
        const contactedIds = JSON.parse(localStorage.getItem('contactedRedStudents')) || [];
        
        const urgentReferrals = Array.from(redStudentsMap.values()).filter(
            report => !contactedIds.includes(report.userId._id)
        );
        
        setPendingReferrals(urgentReferrals);
      } catch (e) {
         console.error("Failed to fetch pending referrals");
      }
    };
    
    if (user && user.role === 'counsellor') {
        fetchRedStudents();
    }
  }, [user]);

  const handleContactStudent = async (studentId, studentUsername) => {
    try {
        const contactedIds = JSON.parse(localStorage.getItem('contactedRedStudents')) || [];
        if (!contactedIds.includes(studentId)) {
            contactedIds.push(studentId);
            localStorage.setItem('contactedRedStudents', JSON.stringify(contactedIds));
        }
        setPendingReferrals(prev => prev.filter(ref => ref.userId._id !== studentId));
        
        // Redirect seamlessly to the student profile to trigger the Booking flow
        navigate(`/counsellor/student-profile/${studentId}`);
    } catch(err) {
        console.error(err);
    }
  };

  return (
    <div className="cdash-root">
      <div className="cdash-wrap">
        <header className="cdash-header">
          <span className="cdash-eyebrow">Professional Portal</span>
          <h1 className="cdash-title">Welcome back, <em>{userName}</em>.</h1>
          <p style={{color: 'var(--ink-soft)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.75'}}>
            Here you can manage your schedule, review student assessments, and orchestrate care.
          </p>
        </header>

        <div className="cdash-content">
          <div className="cdash-urgent-card">
            <h3 className="cdash-section-heading">Urgent: Pending Referrals</h3>
            {pendingReferrals.length > 0 ? (
              <ul className="cdash-urgent-list">
                {pendingReferrals.map(report => (
                  <li key={report._id} className="cdash-urgent-item">
                    <div className="cdash-urgent-info">
                      <p>Student: <span className="cdash-urgent-name">{report.userId.username}</span></p>
                      <p>Alert Level: <span className="cdash-urgent-zone">{report.recommendation} Zone</span></p>
                    </div>
                    <div className="cdash-urgent-actions">
                      <button onClick={() => handleContactStudent(report.userId._id, report.userId.username)} className="cdash-urgent-btn">
                        Contact Student
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="cdash-no-data">
                Excellent—no urgent pending referrals at this time.
              </div>
            )}
          </div>

          <div className="cdash-grid">
            <Link to="/counsellor/manage-availability" className="cdash-link-card">
              <span className="cdash-link-text">Manage Availability</span>
            </Link>
            <Link to="/session-history" className="cdash-link-card">
              <span className="cdash-link-text">Session Records</span>
            </Link>
            <Link to="/counsellor/students" className="cdash-link-card">
              <span className="cdash-link-text">Student Directory & Requests</span>
            </Link>
            <Link to="/counsellor/all-dass-reports" className="cdash-link-card">
              <span className="cdash-link-text">Browse DASS Reports</span>
            </Link>
            <Link to="/manage-profile" className="cdash-link-card">
              <span className="cdash-link-text">View My Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CounsellorDashboard;