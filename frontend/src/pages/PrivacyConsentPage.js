import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

  .consent-root {
    min-height: 100vh;
    background: var(--cream);
    font-family: 'DM Sans', sans-serif;
    position: relative;
    overflow-x: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px 24px;
  }

  .consent-root::before,
  .consent-root::after {
    content: '';
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
  }
  .consent-root::before {
    width: 700px; height: 700px;
    background: radial-gradient(circle, rgba(122,158,126,0.13) 0%, transparent 70%);
    top: -200px; right: -200px;
    animation: blobFloat1 18s ease-in-out infinite;
  }
  .consent-root::after {
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

  .consent-card {
    position: relative;
    z-index: 1;
    background: var(--white);
    border-radius: var(--radius);
    padding: 50px 60px;
    box-shadow: var(--shadow-mid);
    border: 1px solid rgba(122,158,126,0.1);
    max-width: 800px;
    width: 100%;
    opacity: 0;
    transform: translateY(28px);
    animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) 0.1s forwards;
  }

  .consent-eyebrow {
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
    text-align: center;
  }

  .consent-header-wrapper {
    text-align: center;
    margin-bottom: 40px;
  }

  .consent-title {
    font-family: 'Fraunces', Georgia, serif;
    font-size: clamp(2rem, 4vw, 2.8rem);
    font-weight: 300;
    color: var(--ink);
    line-height: 1.15;
    margin: 0;
    letter-spacing: -0.02em;
  }

  .consent-paragraph {
    font-size: 1.05rem;
    color: var(--ink-soft);
    line-height: 1.7;
    margin-bottom: 30px;
  }

  .consent-list {
    list-style: none;
    padding: 0;
    margin: 0 0 40px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .consent-list li {
    font-size: 1rem;
    color: var(--ink-mid);
    line-height: 1.6;
    padding-left: 28px;
    position: relative;
  }

  .consent-list li::before {
    content: '•';
    position: absolute;
    left: 8px;
    color: var(--sage);
    font-size: 1.5rem;
    line-height: 1;
    top: -2px;
  }

  .consent-agreement-box {
    background: var(--sage-pale);
    border-radius: var(--radius-sm);
    padding: 24px;
    margin-bottom: 40px;
  }

  .consent-checkbox-label {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    cursor: pointer;
  }

  .consent-checkbox {
    appearance: none;
    -webkit-appearance: none;
    width: 24px;
    height: 24px;
    border: 2px solid var(--sage);
    border-radius: 6px;
    background: var(--white);
    position: relative;
    cursor: pointer;
    flex-shrink: 0;
    margin-top: 2px;
    transition: all 0.2s;
  }

  .consent-checkbox:checked {
    background: var(--sage);
  }

  .consent-checkbox:checked::after {
    content: '✓';
    position: absolute;
    color: white;
    font-size: 16px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .consent-label-text {
    font-size: 0.95rem;
    color: var(--ink-mid);
    line-height: 1.6;
  }
  .consent-label-text strong {
    color: var(--ink);
  }

  .consent-policy-link {
    color: var(--clay);
    text-decoration: none;
    font-weight: 500;
  }
  .consent-policy-link:hover {
    text-decoration: underline;
  }

  .consent-buttons {
    display: flex;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
  }

  .consent-btn {
    display: inline-block;
    text-align: center;
    font-family: 'DM Sans', sans-serif;
    font-size: 1.05rem;
    font-weight: 500;
    color: var(--white);
    background: linear-gradient(135deg, var(--sage) 0%, #5a8a5f 100%);
    border: none;
    padding: 16px 36px;
    border-radius: 100px;
    cursor: pointer;
    letter-spacing: 0.02em;
    text-decoration: none;
    transition: all 0.3s cubic-bezier(.22,1,.36,1);
    box-shadow: 0 4px 20px rgba(122,158,126,0.35);
  }
  .consent-btn.disabled,
  .consent-btn:disabled {
    background: #ccc;
    box-shadow: none;
    cursor: not-allowed;
    transform: none !important;
  }
  .consent-btn:hover:not(:disabled) {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 8px 32px rgba(122,158,126,0.45);
    color: var(--white);
  }

  .consent-btn-sec {
    display: inline-block;
    text-align: center;
    font-family: 'DM Sans', sans-serif;
    font-size: 1.05rem;
    font-weight: 500;
    color: var(--ink-mid);
    background: transparent;
    border: 1.5px solid var(--cream-warm);
    padding: 16px 36px;
    border-radius: 100px;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.3s;
  }
  .consent-btn-sec:hover {
    background: var(--cream-warm);
    color: var(--ink);
    border-color: var(--clay-light);
    transform: translateY(-2px);
  }

  @keyframes fadeUp {
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 600px) {
    .consent-card {
      padding: 30px 20px;
    }
  }
`;

function PrivacyConsentPage() {
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const styleRef = useRef(null);

  useEffect(() => {
    const el = document.createElement('style');
    el.textContent = CSS;
    document.head.appendChild(el);
    styleRef.current = el;
    return () => el.remove();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (agreed) {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
            alert('Authentication token missing. Please log in again.');
            navigate('/login', { replace: true });
            return;
        }

        const consentData = {
          userId: user.id,
          consent: true
        };

        const res = await axios.post(`${API_BASE_URL}/api/users/consent`, consentData, {
          headers: {
            'x-auth-token': token
          }
        });

        localStorage.setItem('hasConsent', 'true');
        localStorage.setItem('consentToShareDASS', 'true'); 
        
        if (user && user.role === 'student') {
          navigate('/assessment', { replace: true });
        } else {
          navigate('/student/dashboard', { replace: true }); 
        }
      } catch (error) {
        console.error('Failed to save consent:', error);
        alert(error.response?.data?.msg || 'Failed to save consent. Please try again.');
      }
    } else {
      alert('You must agree to the privacy policy to proceed.');
    }
  };

  const handleDisagree = () => {
    if(window.confirm('You chose not to agree. You cannot proceed without consent. Return to home?')) {
      localStorage.removeItem('hasConsent');
      localStorage.removeItem('consentToShareDASS');
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="consent-root">
      <div className="consent-card">
        <div className="consent-header-wrapper">
          <span className="consent-eyebrow">Data Privacy</span>
          <h2 className="consent-title">Privacy <em>Consent</em></h2>
        </div>
        
        <p className="consent-paragraph">
          Your privacy is paramount. To help us provide the best support, we may use the results of your DASS-21 assessment.
          Please read the following carefully:
        </p>
        
        <ul className="consent-list">
          <li>Your DASS-21 scores (Depression, Anxiety, Stress) will be calculated and stored securely.</li>
          <li>A personalized report will be generated and sent to your registered email.</li>
          <li><strong>Optional Consent for Counsellor Sharing:</strong> If your DASS-21 results indicate a high level of concern (e.g., "Red" recommendation), you have the option to consent to share these results with a designated counsellor. This helps them proactively reach out and offer support.</li>
          <li>All personal data and session notes will be encrypted and accessible only to authorized personnel as per our Privacy Policy.</li>
        </ul>

        <div className="consent-agreement-box">
          <label className="consent-checkbox-label">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="consent-checkbox"
            />
            <span className="consent-label-text">
              I understand and explicitly consent to the collection and processing of my DASS-21 results as described above,
              including the <strong>optional sharing with a counsellor if my results are high and I consent to it</strong>. I agree to the <Link to="/privacy-policy" className="consent-policy-link">Privacy Policy</Link>.
            </span>
          </label>
        </div>

        <div className="consent-buttons">
          <button type="submit" onClick={handleSubmit} className="consent-btn" disabled={!agreed}>
            Agree and Proceed
          </button>
          <button type="button" onClick={handleDisagree} className="consent-btn-sec">
            Disagree
          </button>
        </div>
      </div>
    </div>
  );
}

export default PrivacyConsentPage;