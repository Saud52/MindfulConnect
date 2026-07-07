import React, { useEffect, useState, useRef } from 'react';
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

  .report-root {
    min-height: 100vh;
    background: var(--cream);
    font-family: 'DM Sans', sans-serif;
    position: relative;
    overflow-x: hidden;
  }

  .report-root::before,
  .report-root::after {
    content: '';
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
  }
  .report-root::before {
    width: 700px; height: 700px;
    background: radial-gradient(circle, rgba(122,158,126,0.13) 0%, transparent 70%);
    top: -200px; right: -200px;
    animation: blobFloat1 18s ease-in-out infinite;
  }
  .report-root::after {
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

  .report-wrap {
    position: relative;
    z-index: 1;
    max-width: 900px;
    margin: 0 auto;
    padding: 60px 24px 100px;
  }

  .report-header {
    text-align: center;
    margin-bottom: 50px;
    opacity: 0;
    transform: translateY(28px);
    animation: fadeUp 0.9s cubic-bezier(.22,1,.36,1) 0.1s forwards;
  }

  .report-eyebrow {
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

  .report-title {
    font-family: 'Fraunces', Georgia, serif;
    font-size: clamp(2.2rem, 4vw, 3.2rem);
    font-weight: 300;
    color: var(--ink);
    line-height: 1.15;
    margin: 0 0 15px;
    letter-spacing: -0.02em;
  }

  .report-date {
    font-size: 0.95rem;
    color: var(--ink-soft);
    margin-bottom: 40px;
  }

  .recommendation-badge {
    padding: 25px 35px;
    border-radius: var(--radius-sm);
    margin-bottom: 50px;
    box-shadow: var(--shadow-soft);
    display: flex;
    flex-direction: column;
    align-items: center;
    opacity: 0;
    animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) 0.2s forwards;
  }

  .rec-heading {
    font-size: 1.5rem;
    font-family: 'Fraunces', serif;
    margin-bottom: 10px;
  }

  .rec-text {
    font-size: 1.15rem;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
  }

  .scores-section {
    background: var(--white);
    padding: 40px;
    border-radius: var(--radius);
    box-shadow: var(--shadow-soft);
    border: 1px solid rgba(122,158,126,0.1);
    margin-bottom: 50px;
    opacity: 0;
    animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) 0.3s forwards;
  }

  .section-heading {
    font-size: 1.8rem;
    font-family: 'Fraunces', serif;
    color: var(--ink-mid);
    margin-bottom: 30px;
    text-align: center;
    font-weight: 400;
  }

  .scores-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 25px;
  }

  .score-card {
    background: var(--cream);
    border: 1.5px solid var(--cream-warm);
    border-radius: var(--radius-sm);
    padding: 25px;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: all 0.22s cubic-bezier(.22,1,.36,1);
  }
  .score-card:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-soft);
    border-color: var(--sage-light);
  }

  .score-type {
    font-size: 1.1rem;
    color: var(--ink-soft);
    margin-bottom: 10px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .score-val {
    font-family: 'Fraunces', serif;
    font-size: 2.8rem;
    color: var(--ink-mid);
    line-height: 1;
    margin-bottom: 8px;
  }

  .score-sev {
    font-size: 0.85rem;
    font-weight: 600;
    padding: 4px 12px;
    border-radius: 100px;
    letter-spacing: 0.05em;
  }

  .bars-section {
    opacity: 0;
    animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) 0.4s forwards;
    background: var(--white);
    padding: 40px;
    border-radius: var(--radius);
    box-shadow: var(--shadow-soft);
    border: 1px solid rgba(122,158,126,0.1);
  }

  .next-steps-section {
    text-align: center;
    padding: 40px;
    background: var(--white);
    border-radius: var(--radius);
    box-shadow: var(--shadow-soft);
    border: 1px solid rgba(122,158,126,0.1);
    opacity: 0;
    animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) 0.5s forwards;
    margin-top: 40px;
  }

  .next-paragraph {
    color: var(--ink-soft);
    font-size: 1.05rem;
    line-height: 1.7;
    max-width: 700px;
    margin: 0 auto 30px auto;
  }

  .btn-group {
    display: flex;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
  }

  .report-btn {
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
  }
  .report-btn:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 8px 32px rgba(122,158,126,0.45);
    color: var(--white);
  }

  .report-btn-sec {
    display: inline-block;
    text-align: center;
    font-family: 'DM Sans', sans-serif;
    font-size: 1rem;
    font-weight: 500;
    color: var(--ink-mid);
    background: transparent;
    border: 1.5px solid var(--sage);
    padding: 16px 32px;
    border-radius: 100px;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.3s;
  }
  .report-btn-sec:hover {
    background: var(--sage-pale);
    color: var(--ink);
    transform: translateY(-2px);
  }

  .consent-info {
    font-size: 0.85rem;
    color: var(--clay);
    margin-top: 25px;
    font-style: italic;
    width: 100%;
  }

  @keyframes fadeUp {
    to { opacity: 1; transform: translateY(0); }
  }
`;

const DassScaleBar = ({ score, type, title }) => {
    const maxScore = 42;
    const thresholds = {
        depression: { normal: 9, mild: 13, moderate: 20, severe: 27, extreme: 42 },
        anxiety:    { normal: 7, mild: 9,  moderate: 14, severe: 19, extreme: 42 },
        stress:     { normal: 14, mild: 18, moderate: 25, severe: 33, extreme: 42 }
    };
    const typeThresholds = thresholds[type];
    
    // Updated colors to match the subtle theme
    const segments = [
        { label: 'Normal', end: typeThresholds.normal, color: 'var(--sage)' },
        { label: 'Mild', end: typeThresholds.mild, color: '#e8c468' },
        { label: 'Moderate', end: typeThresholds.moderate, color: '#e5a55d' },
        { label: 'Severe', end: typeThresholds.severe, color: 'var(--clay-light)' },
        { label: 'Extremely Severe', end: typeThresholds.extreme, color: 'var(--clay)' }
    ];
    
    const indicatorPosition = (score / maxScore) * 100;
    const clampedIndicatorPosition = Math.max(0, Math.min(100, indicatorPosition));
    
    let indicatorBgColor = 'var(--ink-mid)';
    if (score <= typeThresholds.normal) indicatorBgColor = segments[0].color;
    else if (score <= typeThresholds.mild) indicatorBgColor = segments[1].color;
    else if (score <= typeThresholds.moderate) indicatorBgColor = segments[2].color;
    else if (score <= typeThresholds.severe) indicatorBgColor = segments[3].color;
    else indicatorBgColor = segments[4].color;

    return (
        <div style={{marginBottom: '50px', position: 'relative', fontFamily: "'DM Sans', sans-serif"}}>
            <h4 style={{fontSize: '1.4em', color: 'var(--ink-mid)', marginBottom: '15px', fontFamily: "'Fraunces', serif", fontWeight: 400}}>{title}</h4>
            <div style={{display: 'flex', height: '40px', borderRadius: '100px', overflow: 'hidden', position: 'relative', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)', background: 'var(--cream-warm)'}}>
                {segments.map((segment, index) => {
                    const prevEnd = index === 0 ? 0 : segments[index - 1].end;
                    const width = (segment.end - prevEnd) / maxScore * 100;
                    return (
                        <div
                            key={segment.label}
                            style={{backgroundColor: segment.color, width: `${width}%`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '500', fontSize: '0.85em', textShadow: '1px 1px 2px rgba(0,0,0,0.15)', whiteSpace: 'nowrap'}}
                            title={`${segment.label} (${prevEnd + 1}-${segment.end})`}
                        >
                            {width > 15 && segment.label !== 'Extremely Severe' ? segment.label : ''}
                            {width > 15 && segment.label === 'Extremely Severe' ? 'Ext. Severe' : ''}
                        </div>
                    );
                })}
                <div style={{
                    position: 'absolute', top: '-45px', transform: 'translateX(-50%)', backgroundColor: indicatorBgColor, color: 'white', padding: '6px 12px', borderRadius: '6px', whiteSpace: 'nowrap', zIndex: 10, boxShadow: '0 4px 10px rgba(0,0,0,0.2)', fontSize: '0.85em', fontWeight: '500',
                    left: `${clampedIndicatorPosition}%`,
                }}>
                    <span>Score: {score}</span>
                    <div style={{
                        width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderTop: `8px solid ${indicatorBgColor}`, position: 'absolute', bottom: '-8px', left: '50%', transform: 'translateX(-50%)'
                    }}></div>
                </div>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.8rem', color: 'var(--ink-soft)', fontWeight: '500'}}>
                {segments.map(segment => (
                    <span key={segment.label} style={{flex: 1, textAlign: 'center'}}>
                        {segment.label === 'Extremely Severe' ? 'Ext. Severe' : segment.label}
                    </span>
                ))}
            </div>
        </div>
    );
};

function AssessmentReportPage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true); 
  const { user } = useAuth();
  const styleRef = useRef(null);

  useEffect(() => {
    const el = document.createElement('style');
    el.textContent = CSS;
    document.head.appendChild(el);
    styleRef.current = el;
    return () => el.remove();
  }, []);

  useEffect(() => {
    const fetchLatestDassResult = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }
        if (!user || user.role !== 'student') {
          setLoading(false);
          return;
        }

        const res = await axios.get(`${API_BASE_URL}/api/dass21/report/latest`, {
          headers: {
            'x-auth-token': token
          }
        });

        setReport(res.data.latestResult);
        localStorage.setItem('lastDASSResult', JSON.stringify(res.data.latestResult));
        
      } catch (error) {
        console.error('Failed to fetch DASS report:', error);
        setReport(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestDassResult();
  }, [user]);

  const getRecommendationStyle = (recommendation) => {
    switch (recommendation) {
      case 'Green':
        return { backgroundColor: 'var(--sage)', color: 'white' };
      case 'Yellow':
        return { backgroundColor: '#e8c468', color: 'var(--ink)' };
      case 'Red':
        return { backgroundColor: 'var(--clay)', color: 'white' };
      default:
        return {};
    }
  };
  
  const getSeverityBgColor = (severity) => {
    switch (severity) {
      case 'Normal': return 'var(--sage-pale)';
      case 'Mild': return '#fdf5df';
      case 'Moderate': return '#fcead5';
      case 'Severe': return '#f9e8e0';
      case 'Extremely Severe': return '#fae3df';
      default: return 'var(--cream)';
    }
  };

  const getSeverityTextColor = (severity) => {
    switch (severity) {
      case 'Normal': return 'var(--sage)';
      case 'Mild': return '#d1a015';
      case 'Moderate': return '#c47d25';
      case 'Severe': return 'var(--clay-light)';
      case 'Extremely Severe': return 'var(--clay)';
      default: return 'var(--ink-soft)';
    }
  };

  const getDassSeverityText = (score, type) => {
    const ranges = {
      depression: { normal: 9, mild: 13, moderate: 20, severe: 27 },
      anxiety: { normal: 7, mild: 9, moderate: 14, severe: 19 },
      stress: { normal: 14, mild: 18, moderate: 25, severe: 33 }
    };
    if (score <= ranges[type].normal) return 'Normal';
    if (score <= ranges[type].mild) return 'Mild';
    if (score <= ranges[type].moderate) return 'Moderate';
    if (score <= ranges[type].severe) return 'Severe';
    return 'Extremely Severe';
  };

  if (loading) {
    return (
      <div className="report-root" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{fontFamily: "'Fraunces', serif", fontSize: '1.2rem', color: 'var(--ink-mid)', fontStyle: 'italic'}}>
          Loading your report...
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="report-root" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px'}}>
        <h2 style={{fontFamily: "'Fraunces', serif", color: 'var(--clay)'}}>No Assessment Report Found</h2>
        <p style={{color: 'var(--ink-soft)'}}>Please complete the DASS-21 assessment first.</p>
        <Link to="/assessment" className="report-btn">Take Assessment Now</Link>
      </div>
    );
  }

  const depressionSeverityText = getDassSeverityText(report.depression, 'depression');
  const anxietySeverityText = getDassSeverityText(report.anxiety, 'anxiety');
  const stressSeverityText = getDassSeverityText(report.stress, 'stress');

  return (
    <div className="report-root">
      <div className="report-wrap">
        <header className="report-header">
          <span className="report-eyebrow">Confidential Results</span>
          <h1 className="report-title">Your Assessment <em>Report</em></h1>
          <p className="report-date">Generated on: {new Date(report.testDate).toLocaleDateString()}</p>
        </header>
        
        <div 
          className="recommendation-badge"
          style={getRecommendationStyle(report.recommendation)}
        >
          <h3 className="rec-heading">Overall Recommendation</h3>
          <p className="rec-text">{report.recommendation === 'Red' ? 'Immediate Action Recommended' : report.recommendation === 'Yellow' ? 'Consider Professional Support' : 'Good Mental Well-being'}</p>
        </div>

        <div className="scores-section">
          <h3 className="section-heading">Detailed Scores</h3>
          <div className="scores-grid">
            <div className="score-card">
              <span className="score-type">Depression</span>
              <span className="score-val">{report.depression}</span>
              <span className="score-sev" style={{background: getSeverityBgColor(depressionSeverityText), color: getSeverityTextColor(depressionSeverityText)}}>
                {depressionSeverityText}
              </span>
            </div>
            <div className="score-card">
              <span className="score-type">Anxiety</span>
              <span className="score-val">{report.anxiety}</span>
              <span className="score-sev" style={{background: getSeverityBgColor(anxietySeverityText), color: getSeverityTextColor(anxietySeverityText)}}>
                {anxietySeverityText}
              </span>
            </div>
            <div className="score-card">
              <span className="score-type">Stress</span>
              <span className="score-val">{report.stress}</span>
              <span className="score-sev" style={{background: getSeverityBgColor(stressSeverityText), color: getSeverityTextColor(stressSeverityText)}}>
                {stressSeverityText}
              </span>
            </div>
          </div>
        </div>

        <div className="bars-section">
          <h3 className="section-heading">Score Analysis</h3>
          <DassScaleBar score={report.depression} type="depression" title="Depression" />
          <DassScaleBar score={report.anxiety} type="anxiety" title="Anxiety" />
          <DassScaleBar score={report.stress} type="stress" title="Stress" />
        </div>

        <div className="next-steps-section">
          <h3 className="section-heading">What to do next?</h3>
          {report.recommendation === 'Red' && (
            <p className="next-paragraph">Your results suggest a high level of concern. We strongly recommend seeking immediate professional support. Please click below to find a specialist who can help.</p>
          )}
          {report.recommendation === 'Yellow' && (
            <p className="next-paragraph">Your results indicate that you might benefit from professional guidance. Consider exploring therapy options to address your concerns.</p>
          )}
          {report.recommendation === 'Green' && (
            <p className="next-paragraph">Your results suggest good mental well-being. Continue practicing self-care and mindfulness. Feel free to explore our resources.</p>
          )}
          
          <div className="btn-group">
            {report.recommendation === 'Red' || report.recommendation === 'Yellow' ? (
              <Link to="/find-professional" className="report-btn">Find a Professional</Link>
            ) : (
              <Link to="/student/dashboard" className="report-btn">Go to Dashboard</Link>
            )}
            <Link to="/assessment" className="report-btn-sec">Retake Assessment</Link>
            {report.consentToShare && report.recommendation === 'Red' && (
                <p className="consent-info">* Your results have been flagged for review by a counsellor due to your consent and high scores.</p>
            )}
          </div>
        </div>
      </div>
      <Chatbot zone={report.recommendation} />


    </div>
  );
}

export default AssessmentReportPage;