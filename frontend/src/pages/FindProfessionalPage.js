import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import API_BASE_URL from '../apiBaseUrl';
import ProfessionalCard from '../components/ProfessionalCard';

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

  .find-root {
    min-height: 100vh;
    background: var(--cream);
    font-family: 'DM Sans', sans-serif;
    position: relative;
    overflow-x: hidden;
  }

  .find-root::before,
  .find-root::after {
    content: '';
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
  }
  .find-root::before {
    width: 700px; height: 700px;
    background: radial-gradient(circle, rgba(122,158,126,0.13) 0%, transparent 70%);
    top: -200px; right: -200px;
    animation: blobFloat1 18s ease-in-out infinite;
  }
  .find-root::after {
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

  .find-wrap {
    position: relative;
    z-index: 1;
    max-width: 900px;
    margin: 0 auto;
    padding: 60px 24px 100px;
  }

  .find-header {
    text-align: center;
    margin-bottom: 64px;
    opacity: 0;
    transform: translateY(28px);
    animation: fadeUp 0.9s cubic-bezier(.22,1,.36,1) 0.1s forwards;
  }

  .find-eyebrow {
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

  .find-title {
    font-family: 'Fraunces', Georgia, serif;
    font-size: clamp(2.2rem, 5vw, 3.4rem);
    font-weight: 300;
    color: var(--ink);
    line-height: 1.15;
    margin: 0 0 20px;
    letter-spacing: -0.02em;
  }

  .find-title em {
    font-style: italic;
    color: var(--sage);
  }

  .find-subtitle {
    font-size: 0.97rem;
    color: var(--ink-soft);
    line-height: 1.75;
    max-width: 520px;
    margin: 0 auto;
  }

  .find-content {
    display: flex;
    justify-content: center;
    opacity: 0;
    animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) 0.3s forwards;
  }

  @keyframes fadeUp {
    to { opacity: 1; transform: translateY(0); }
  }
`;

function FindProfessionalPage() {
  const [counsellor, setCounsellor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const styleRef = useRef(null);

  useEffect(() => {
    const el = document.createElement('style');
    el.textContent = CSS;
    document.head.appendChild(el);
    styleRef.current = el;
    return () => el.remove();
  }, []);

  useEffect(() => {
    const fetchMainCounsellor = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/api/counsellors/main`, {
          headers: { 'x-auth-token': token }
        });

        const profile = res.data.profile;
        const adaptedCounsellor = {
          id: res.data._id,
          name: res.data.username,
          specialization: profile.specialization || ['General Counselling'],
          bio: profile.bio || 'Provides expert mental health support for our students.',
          rating: 4.9, 
          experience: `${profile.yearsOfExperience || '10+'} years experience`,
        };

        setCounsellor(adaptedCounsellor);
      } catch (err) {
        console.error("ERROR: Failed to fetch counsellor.", err);
        setError(err.response?.data?.msg || 'Could not fetch the counsellor. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMainCounsellor();
  }, []);

  if (loading) {
    return (
      <div className="find-root" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{fontFamily: "'Fraunces', serif", fontSize: '1.2rem', color: 'var(--ink-mid)', fontStyle: 'italic'}}>
          Finding your professional...
        </div>
      </div>
    );
  }

  return (
    <div className="find-root">
      <div className="find-wrap">
        <header className="find-header">
          <span className="find-eyebrow">Support Team</span>
          <h1 className="find-title">Connect with a <em>Professional</em></h1>
          <p className="find-subtitle">
            Our designated professional is available to provide expert guidance and has access to all student reports for comprehensive support.
          </p>
        </header>

        <div className="find-content">
          {error && <p style={{color: 'var(--clay)', fontStyle: 'italic'}}>{error}</p>}
          {counsellor && <ProfessionalCard professional={counsellor} />}
        </div>
      </div>
    </div>
  );
}

export default FindProfessionalPage;