/* eslint-disable no-console */
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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

  .assess-root {
    min-height: 100vh;
    background: var(--cream);
    font-family: 'DM Sans', sans-serif;
    position: relative;
    overflow-x: hidden;
  }

  /* Soft organic background blobs */
  .assess-root::before,
  .assess-root::after {
    content: '';
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
  }
  .assess-root::before {
    width: 700px; height: 700px;
    background: radial-gradient(circle, rgba(122,158,126,0.13) 0%, transparent 70%);
    top: -200px; right: -200px;
    animation: blobFloat1 18s ease-in-out infinite;
  }
  .assess-root::after {
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

  .assess-wrap {
    position: relative;
    z-index: 1;
    max-width: 820px;
    margin: 0 auto;
    padding: 60px 24px 100px;
  }

  /* Header */
  .assess-header {
    text-align: center;
    margin-bottom: 64px;
    opacity: 0;
    transform: translateY(28px);
    animation: fadeUp 0.9s cubic-bezier(.22,1,.36,1) 0.1s forwards;
  }

  .assess-eyebrow {
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

  .assess-title {
    font-family: 'Fraunces', Georgia, serif;
    font-size: clamp(2.2rem, 5vw, 3.4rem);
    font-weight: 300;
    color: var(--ink);
    line-height: 1.15;
    margin: 0 0 20px;
    letter-spacing: -0.02em;
  }

  .assess-title em {
    font-style: italic;
    color: var(--sage);
  }

  .assess-subtitle {
    font-size: 0.97rem;
    color: var(--ink-soft);
    line-height: 1.75;
    max-width: 520px;
    margin: 0 auto;
  }

  /* Progress bar */
  .assess-progress-wrap {
    margin-bottom: 48px;
    opacity: 0;
    animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) 0.35s forwards;
  }

  .assess-progress-meta {
    display: flex;
    justify-content: space-between;
    font-size: 0.82rem;
    color: var(--ink-soft);
    margin-bottom: 10px;
    font-weight: 500;
  }

  .assess-progress-track {
    width: 100%;
    height: 6px;
    background: var(--cream-warm);
    border-radius: 100px;
    overflow: hidden;
  }

  .assess-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--sage-light), var(--sage));
    border-radius: 100px;
    transition: width 0.5s cubic-bezier(.22,1,.36,1);
  }

  /* Scale legend */
  .assess-legend {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 52px;
    opacity: 0;
    animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) 0.5s forwards;
  }

  .legend-chip {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 7px 14px;
    background: var(--white);
    border: 1px solid var(--cream-warm);
    border-radius: 100px;
    font-size: 0.8rem;
    color: var(--ink-mid);
    box-shadow: var(--shadow-soft);
  }

  .legend-num {
    font-family: 'Fraunces', serif;
    font-weight: 600;
    color: var(--sage);
    font-size: 1rem;
  }

  /* Question cards */
  .assess-questions {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .q-card {
    background: var(--white);
    border-radius: var(--radius);
    padding: 32px 36px;
    box-shadow: var(--shadow-soft);
    border: 1px solid rgba(122,158,126,0.1);
    opacity: 0;
    transform: translateY(20px);
    transition: box-shadow 0.3s ease, transform 0.3s ease, border-color 0.3s ease;
    animation: fadeUp 0.6s cubic-bezier(.22,1,.36,1) forwards;
  }

  .q-card:hover {
    box-shadow: var(--shadow-mid);
    transform: translateY(-2px);
    border-color: rgba(122,158,126,0.22);
  }

  .q-card.answered {
    border-color: rgba(122,158,126,0.28);
    background: linear-gradient(135deg, #ffffff 0%, rgba(232,240,233,0.4) 100%);
  }

  .q-meta {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 14px;
  }

  .q-number {
    font-family: 'Fraunces', serif;
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--white);
    background: var(--sage);
    width: 26px; height: 26px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    letter-spacing: 0;
  }

  .q-type-badge {
    font-size: 0.68rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 3px 10px;
    border-radius: 100px;
  }

  .q-type-D { background: rgba(196,119,90,0.12); color: var(--clay); }
  .q-type-A { background: rgba(122,158,126,0.12); color: var(--sage); }
  .q-type-S { background: rgba(168,197,172,0.2); color: var(--ink-mid); }

  .q-text {
    font-size: 1rem;
    font-weight: 400;
    color: var(--ink);
    line-height: 1.6;
    margin-bottom: 24px;
  }

  /* Radio row */
  .q-options {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
  }

  @media (max-width: 640px) {
    .q-options { grid-template-columns: repeat(2, 1fr); }
    .q-card { padding: 24px 20px; }
  }

  .q-option-label {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    position: relative;
  }

  .q-option-label input[type="radio"] {
    position: absolute;
    opacity: 0;
    width: 0; height: 0;
  }

  .q-option-box {
    width: 100%;
    padding: 12px 8px;
    border-radius: var(--radius-sm);
    border: 1.5px solid var(--cream-warm);
    background: var(--cream);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    transition: all 0.22s cubic-bezier(.22,1,.36,1);
    user-select: none;
  }

  .q-option-label:hover .q-option-box {
    border-color: var(--sage-light);
    background: var(--sage-pale);
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(122,158,126,0.15);
  }

  .q-option-label input:checked ~ .q-option-box {
    border-color: var(--sage);
    background: var(--sage-pale);
    box-shadow: 0 0 0 3px rgba(122,158,126,0.2), 0 4px 16px rgba(122,158,126,0.15);
    transform: translateY(-2px);
  }

  .q-option-score {
    font-family: 'Fraunces', serif;
    font-size: 1.3rem;
    font-weight: 600;
    color: var(--ink-soft);
    line-height: 1;
    transition: color 0.2s;
  }

  .q-option-label input:checked ~ .q-option-box .q-option-score {
    color: var(--sage);
  }

  .q-option-text {
    font-size: 0.68rem;
    color: var(--ink-soft);
    text-align: center;
    line-height: 1.3;
    transition: color 0.2s;
  }

  .q-option-label input:checked ~ .q-option-box .q-option-text {
    color: var(--ink-mid);
  }

  /* Checkmark for answered */
  .q-answered-mark {
    position: absolute;
    top: -8px; right: -8px;
    width: 22px; height: 22px;
    background: var(--sage);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    opacity: 0;
    transform: scale(0);
    transition: all 0.3s cubic-bezier(.34,1.56,.64,1);
    z-index: 2;
  }

  .q-card.answered .q-answered-mark {
    opacity: 1;
    transform: scale(1);
  }

  .q-answered-mark svg {
    width: 12px; height: 12px;
  }

  /* Submit area */
  .assess-submit-area {
    margin-top: 56px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    opacity: 0;
    animation: fadeUp 0.6s ease 0.8s forwards;
  }

  .assess-submit-info {
    font-size: 0.82rem;
    color: var(--ink-soft);
  }

  .assess-submit-btn {
    position: relative;
    font-family: 'DM Sans', sans-serif;
    font-size: 1rem;
    font-weight: 500;
    color: var(--white);
    background: linear-gradient(135deg, var(--sage) 0%, #5a8a5f 100%);
    border: none;
    padding: 18px 56px;
    border-radius: 100px;
    cursor: pointer;
    letter-spacing: 0.02em;
    transition: all 0.3s cubic-bezier(.22,1,.36,1);
    box-shadow: 0 4px 20px rgba(122,158,126,0.35);
    overflow: hidden;
  }

  .assess-submit-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.3s;
  }

  .assess-submit-btn:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 8px 32px rgba(122,158,126,0.45);
  }

  .assess-submit-btn:hover::before { opacity: 1; }
  .assess-submit-btn:active { transform: translateY(0) scale(0.99); }

  .assess-submit-btn:disabled {
    background: var(--cream-warm);
    color: var(--ink-soft);
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }

  .btn-shimmer {
    position: absolute;
    top: 0; left: -100%;
    width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
    animation: shimmer 2.5s infinite;
  }

  @keyframes shimmer {
    0% { left: -100%; }
    100% { left: 200%; }
  }

  @keyframes fadeUp {
    to { opacity: 1; transform: translateY(0); }
  }

  /* Submission loading overlay */
  .assess-overlay {
    position: fixed;
    inset: 0;
    background: rgba(247,244,239,0.9);
    backdrop-filter: blur(10px);
    z-index: 100;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.4s;
  }

  .assess-overlay.active {
    opacity: 1;
    pointer-events: all;
  }

  .spinner {
    width: 48px; height: 48px;
    border: 3px solid var(--cream-warm);
    border-top-color: var(--sage);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .overlay-text {
    font-family: 'Fraunces', serif;
    font-size: 1.2rem;
    color: var(--ink-mid);
    font-style: italic;
  }
`;

const typeLabels = { D: 'Mood', A: 'Anxiety', S: 'Stress' };

function AssessmentPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [answers, setAnswers] = useState(
    Array(21).fill('').reduce((acc, _, i) => ({ ...acc, [`q${i + 1}`]: '' }), {})
  );
  const [submitting, setSubmitting] = useState(false);
  const styleRef = useRef(null);

  useEffect(() => {
    const el = document.createElement('style');
    el.textContent = CSS;
    document.head.appendChild(el);
    styleRef.current = el;
    return () => el.remove();
  }, []);

  const questions = [
    { key: 'q1',  type: 'S', text: "I found it hard to wind down." },
    { key: 'q2',  type: 'A', text: "I was aware of dryness of my mouth." },
    { key: 'q3',  type: 'D', text: "I couldn't seem to experience any positive feeling at all." },
    { key: 'q4',  type: 'A', text: "I experienced breathing difficulty (e.g., excessively rapid breathing)." },
    { key: 'q5',  type: 'D', text: "I found it difficult to work up the initiative to do things." },
    { key: 'q6',  type: 'S', text: "I tended to over-react to situations." },
    { key: 'q7',  type: 'A', text: "I experienced trembling (e.g., in the hands)." },
    { key: 'q8',  type: 'S', text: "I felt that I was using a lot of nervous energy." },
    { key: 'q9',  type: 'A', text: "I was worried about situations in which I might panic and make a fool of myself." },
    { key: 'q10', type: 'D', text: "I felt that I had nothing to look forward to." },
    { key: 'q11', type: 'S', text: "I found myself getting agitated." },
    { key: 'q12', type: 'A', text: "I found it difficult to relax." },
    { key: 'q13', type: 'D', text: "I felt down-hearted and blue." },
    { key: 'q14', type: 'S', text: "I was intolerant of anything that kept me from getting on with what I was doing." },
    { key: 'q15', type: 'A', text: "I felt I was close to panic." },
    { key: 'q16', type: 'D', text: "I was unable to experience any pleasure or enjoyment." },
    { key: 'q17', type: 'A', text: "I felt I was not worth much as a person." },
    { key: 'q18', type: 'S', text: "I felt that I was rather touchy." },
    { key: 'q19', type: 'D', text: "I was aware of the action of my heart in the absence of physical exertion (e.g., sense of heart racing, missing a beat)." },
    { key: 'q20', type: 'A', text: "I felt I was going to crack up." },
    { key: 'q21', type: 'S', text: "I was terrified for no reason." },
  ];

  const radioOptions = [
    { value: '0', label: 'Not at all' },
    { value: '1', label: 'Some of the time' },
    { value: '2', label: 'A good part of time' },
    { value: '3', label: 'Most of the time' },
  ];

  const answeredCount = Object.values(answers).filter(v => v !== '').length;
  const progress = Math.round((answeredCount / questions.length) * 100);
  const allAnswered = answeredCount === questions.length;

  const handleRadioChange = (questionKey, value) => {
    setAnswers(prev => ({ ...prev, [questionKey]: value }));
  };

  const calculateDassScores = (ans) => {
    let D = 0, A = 0, S = 0;
    questions.forEach(q => {
      const score = parseInt(ans[q.key]) || 0;
      if (q.type === 'D') D += score;
      if (q.type === 'A') A += score;
      if (q.type === 'S') S += score;
    });
    return { depression: D * 2, anxiety: A * 2, stress: S * 2 };
  };

  const getSeverity = (score, type) => {
    const ranges = {
      depression: { normal: 9, mild: 13, moderate: 20, severe: 27 },
      anxiety:    { normal: 7, mild: 9,  moderate: 14, severe: 19 },
      stress:     { normal: 14, mild: 18, moderate: 25, severe: 33 },
    };
    if (score <= ranges[type].normal)   return 'Normal';
    if (score <= ranges[type].mild)     return 'Mild';
    if (score <= ranges[type].moderate) return 'Moderate';
    if (score <= ranges[type].severe)   return 'Severe';
    return 'Extremely Severe';
  };

  const getRecommendation = (depression, anxiety, stress) => {
    const sev = [getSeverity(depression, 'depression'), getSeverity(anxiety, 'anxiety'), getSeverity(stress, 'stress')];
    if (sev.some(s => s === 'Extremely Severe' || s === 'Severe')) return 'Red';
    if (sev.some(s => s === 'Moderate')) return 'Yellow';
    return 'Green';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const { depression, anxiety, stress } = calculateDassScores(answers);
    const recommendation = getRecommendation(depression, anxiety, stress);

    const assessmentResult = {
      depression, anxiety, stress, recommendation,
      testDate: new Date().toISOString(),
      consentToShare: localStorage.getItem('consentToShareDASS') === 'true',
    };

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Authentication token missing. Please log in again.');
        navigate('/login', { replace: true });
        return;
      }

      // eslint-disable-next-line no-unused-vars
      // const res = await axios.post('http://10.0.1.21:5000/api/dass21/submit', assessmentResult, {
      const res = await axios.post(`${API_BASE_URL}/api/dass21/submit`, assessmentResult, {
        headers: { 'x-auth-token': token },
      });

      localStorage.setItem('lastDASSResult', JSON.stringify(assessmentResult));
      localStorage.setItem('hasCompletedAssessment', 'true');

      if (recommendation === 'Red' && assessmentResult.consentToShare) {
        const studentInfo = { id: user.id, username: user.username, email: user.email, dassResult: assessmentResult };
        let highDassReferrals = JSON.parse(localStorage.getItem('highDassReferrals')) || [];
        highDassReferrals.push({ student: studentInfo, referralDate: new Date().toISOString(), status: 'Pending', counsellorId: 'mock-counsellor-id-1' });
        localStorage.setItem('highDassReferrals', JSON.stringify(highDassReferrals));
      }

      navigate('/assessment-report', { replace: true });
    } catch (error) {
      console.error('Failed to submit assessment:', error);
      alert(error.response?.data?.msg || 'Failed to submit assessment. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="assess-root">
      {/* Submission overlay */}
      <div className={`assess-overlay${submitting ? ' active' : ''}`}>
        <div className="spinner" />
        <p className="overlay-text">Preparing your results…</p>
      </div>

      <div className="assess-wrap">
        {/* Header */}
        <header className="assess-header">
          <span className="assess-eyebrow">Confidential · DASS-21</span>
          <h1 className="assess-title">How have you been <em>feeling</em> lately?</h1>
          <p className="assess-subtitle">
            Answer based on the past week. There are no right or wrong answers — this is a guide to help find the right support for you.
          </p>
        </header>

        {/* Progress */}
        <div className="assess-progress-wrap">
          <div className="assess-progress-meta">
            <span>{answeredCount} of {questions.length} answered</span>
            <span>{progress}%</span>
          </div>
          <div className="assess-progress-track">
            <div className="assess-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Legend */}
        <div className="assess-legend">
          {[
            { score: '0', text: 'Not at all' },
            { score: '1', text: 'Sometimes' },
            { score: '2', text: 'Often' },
            { score: '3', text: 'Most of the time' },
          ].map(l => (
            <div className="legend-chip" key={l.score}>
              <span className="legend-num">{l.score}</span>
              <span>{l.text}</span>
            </div>
          ))}
        </div>

        {/* Questions */}
        <form onSubmit={handleSubmit}>
          <div className="assess-questions">
            {questions.map((q, i) => {
              const isAnswered = answers[q.key] !== '';
              return (
                <div
                  key={q.key}
                  className={`q-card${isAnswered ? ' answered' : ''}`}
                  style={{ animationDelay: `${0.08 * i + 0.5}s` }}
                >
                  {/* Answered checkmark */}
                  <div className="q-answered-mark">
                    <svg viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>

                  <div className="q-meta">
                    <span className="q-number">{i + 1}</span>
                    <span className={`q-type-badge q-type-${q.type}`}>{typeLabels[q.type]}</span>
                  </div>
                  <p className="q-text">{q.text}</p>

                  <div className="q-options">
                    {radioOptions.map(opt => (
                      <label className="q-option-label" key={`${q.key}-${opt.value}`}>
                        <input
                          type="radio"
                          name={q.key}
                          value={opt.value}
                          checked={answers[q.key] === opt.value}
                          onChange={() => handleRadioChange(q.key, opt.value)}
                          required
                        />
                        <div className="q-option-box">
                          <span className="q-option-score">{opt.value}</span>
                          <span className="q-option-text">{opt.label}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submit */}
          <div className="assess-submit-area">
            {!allAnswered && (
              <p className="assess-submit-info">
                {questions.length - answeredCount} question{questions.length - answeredCount !== 1 ? 's' : ''} remaining
              </p>
            )}
            <button
              type="submit"
              className="assess-submit-btn"
              disabled={!allAnswered || submitting}
            >
              <span className="btn-shimmer" />
              See My Recommendations
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AssessmentPage;