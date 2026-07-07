import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
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

  .dhist-root {
    min-height: 100vh;
    background: var(--cream);
    font-family: 'DM Sans', sans-serif;
    position: relative;
    overflow-x: hidden;
  }

  .dhist-root::before,
  .dhist-root::after {
    content: '';
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
  }
  .dhist-root::before {
    width: 700px; height: 700px;
    background: radial-gradient(circle, rgba(122,158,126,0.13) 0%, transparent 70%);
    top: -200px; right: -200px;
    animation: blobFloat1 18s ease-in-out infinite;
  }
  .dhist-root::after {
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

  .dhist-wrap {
    position: relative;
    z-index: 1;
    max-width: 900px;
    margin: 0 auto;
    padding: 60px 24px 100px;
  }

  .dhist-header {
    text-align: center;
    margin-bottom: 50px;
    opacity: 0;
    transform: translateY(28px);
    animation: fadeUp 0.9s cubic-bezier(.22,1,.36,1) 0.1s forwards;
  }

  .dhist-eyebrow {
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

  .dhist-title {
    font-family: 'Fraunces', Georgia, serif;
    font-size: clamp(2.2rem, 5vw, 3.4rem);
    font-weight: 300;
    color: var(--ink);
    line-height: 1.15;
    margin: 0 0 15px;
    letter-spacing: -0.02em;
  }

  .dhist-title em {
    font-style: italic;
    color: var(--sage);
  }

  .dhist-content {
    opacity: 0;
    animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) 0.35s forwards;
  }

  .dhist-list {
    display: grid;
    grid-template-columns: 1fr;
    gap: 25px;
    margin-bottom: 50px;
    list-style: none;
    padding: 0;
  }

  .dhist-card {
    background: var(--white);
    border-radius: var(--radius);
    padding: 40px;
    box-shadow: var(--shadow-soft);
    border: 1px solid rgba(122,158,126,0.1);
    transition: transform 0.22s, box-shadow 0.22s;
  }
  .dhist-card:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-mid);
  }

  .dhist-date {
    font-family: 'Fraunces', serif;
    font-size: 1.4rem;
    color: var(--ink-mid);
    border-bottom: 1px solid var(--cream-warm);
    padding-bottom: 15px;
    margin-bottom: 25px;
  }

  .dhist-scores-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
  }

  .dhist-score-detail {
    display: flex;
    flex-direction: column;
    background: var(--sage-pale);
    padding: 20px;
    border-radius: var(--radius-sm);
    text-align: center;
  }

  .dhist-score-label {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    color: var(--ink-soft);
    font-weight: 600;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .dhist-score-value {
    font-family: 'Fraunces', serif;
    font-size: 1.4rem;
    font-weight: 400;
  }

  .dhist-overall {
    font-family: 'DM Sans', sans-serif;
    font-size: 1.1rem;
    color: var(--ink-mid);
    background: var(--cream);
    padding: 15px 20px;
    border-radius: var(--radius-sm);
    display: inline-block;
  }
  .dhist-overall strong {
    font-weight: 600;
  }

  .dhist-btn-export {
    display: inline-block;
    text-align: center;
    font-family: 'DM Sans', sans-serif;
    font-size: 1rem;
    font-weight: 500;
    color: var(--white);
    background: linear-gradient(135deg, var(--sage) 0%, #5a8a5f 100%);
    border: none;
    padding: 14px 28px;
    border-radius: 100px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(.22,1,.36,1);
    box-shadow: 0 4px 15px rgba(122,158,126,0.3);
    margin-bottom: 30px;
  }
  .dhist-btn-export:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(122,158,126,0.4);
    color: var(--white);
  }

  .dhist-btn-sec {
    display: inline-block;
    text-align: center;
    font-family: 'DM Sans', sans-serif;
    font-size: 1rem;
    font-weight: 500;
    color: var(--ink-mid);
    background: transparent;
    border: 1.5px solid var(--sage);
    padding: 14px 28px;
    border-radius: 100px;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.3s;
  }
  .dhist-btn-sec:hover {
    background: var(--sage-pale);
    color: var(--ink);
    transform: translateY(-2px);
  }

  .dhist-empty {
    text-align: center;
    background: var(--white);
    padding: 50px;
    border-radius: var(--radius);
    box-shadow: var(--shadow-soft);
    color: var(--ink-soft);
    font-style: italic;
    margin-bottom: 50px;
  }

  @keyframes fadeUp {
    to { opacity: 1; transform: translateY(0); }
  }
`;

function DassHistoryPage() {
  const { studentId } = useParams();
  const [history, setHistory] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const styleRef = useRef(null);

  useEffect(() => {
    const el = document.createElement('style');
    el.textContent = CSS;
    document.head.appendChild(el);
    styleRef.current = el;
    return () => el.remove();
  }, []);

  useEffect(() => {
    const fetchDassHistory = async () => {
      try {
        const token = localStorage.getItem('token');

        const [historyRes, studentRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/dass21/history/${studentId}`, {
            headers: { 'x-auth-token': token }
          }),
          axios.get(`${API_BASE_URL}/api/students/${studentId}`, {
            headers: { 'x-auth-token': token }
          })
        ]);

        setHistory(historyRes.data);
        setStudent(studentRes.data);

      } catch (err) {
        console.error("Failed to fetch DASS history", err);
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchDassHistory();
    }
  }, [studentId]);

  const getSeverityTextColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'normal': return 'var(--sage)';
      case 'mild': return 'var(--ink-mid)';
      case 'moderate': return '#e68a00';
      case 'severe': return 'var(--clay)';
      case 'extremely severe': return '#a85e42';
      default: return 'var(--ink-soft)';
    }
  };

  const getOverallZoneColor = (zone) => {
      switch(zone?.toLowerCase()) {
          case 'green': return 'var(--sage)';
          case 'yellow': return '#e68a00';
          case 'red': return 'var(--clay)';
          default: return 'var(--ink-mid)';
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

  const exportToExcel = () => {
    if (!history.length) return;

    const formattedData = history.map(record => ({
      Date: new Date(record.testDate).toLocaleDateString(),
      Depression_Score: record.depression,
      Depression_Severity: getDassSeverityText(record.depression, 'depression'),
      Anxiety_Score: record.anxiety,
      Anxiety_Severity: getDassSeverityText(record.anxiety, 'anxiety'),
      Stress_Score: record.stress,
      Stress_Severity: getDassSeverityText(record.stress, 'stress'),
      Overall_Recommendation: record.recommendation
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DASS History");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });

    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });

    saveAs(data, `DASS_History_${student?.username || "Student"}.xlsx`);
  };

  if (loading) {
    return (
      <div className="dhist-root" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{fontFamily: "'Fraunces', serif", fontSize: '1.2rem', color: 'var(--ink-mid)', fontStyle: 'italic'}}>
          Gathering records...
        </div>
      </div>
    );
  }

  return (
    <div className="dhist-root">
      <div className="dhist-wrap">
        <header className="dhist-header">
          <span className="dhist-eyebrow">Assessment Tracking</span>
          <h1 className="dhist-title">History for <em>{student?.username || 'Student'}</em></h1>
        </header>

        <div className="dhist-content">
          {history.length > 0 && (
            <div style={{textAlign: 'center'}}>
              <button onClick={exportToExcel} className="dhist-btn-export">
                Export Data to Excel
              </button>
            </div>
          )}

          {history.length > 0 ? (
            <ul className="dhist-list">
              {history.map(record => (
                <li key={record._id} className="dhist-card">
                  <div className="dhist-date">
                    {new Date(record.testDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>

                  <div className="dhist-scores-grid">
                    <div className="dhist-score-detail">
                      <span className="dhist-score-label">Depression</span>
                      <span className="dhist-score-value" style={{color: getSeverityTextColor(getDassSeverityText(record.depression, 'depression'))}}>
                        {record.depression} <span style={{fontSize: '1rem'}}>({getDassSeverityText(record.depression, 'depression')})</span>
                      </span>
                    </div>

                    <div className="dhist-score-detail">
                      <span className="dhist-score-label">Anxiety</span>
                      <span className="dhist-score-value" style={{color: getSeverityTextColor(getDassSeverityText(record.anxiety, 'anxiety'))}}>
                        {record.anxiety} <span style={{fontSize: '1rem'}}>({getDassSeverityText(record.anxiety, 'anxiety')})</span>
                      </span>
                    </div>

                    <div className="dhist-score-detail">
                      <span className="dhist-score-label">Stress</span>
                      <span className="dhist-score-value" style={{color: getSeverityTextColor(getDassSeverityText(record.stress, 'stress'))}}>
                        {record.stress} <span style={{fontSize: '1rem'}}>({getDassSeverityText(record.stress, 'stress')})</span>
                      </span>
                    </div>
                  </div>

                  <div style={{textAlign: 'center'}}>
                    <div className="dhist-overall">
                      Computed Overall Recommendation: 
                      <strong style={{ color: getOverallZoneColor(record.recommendation), marginLeft: '8px' }}>
                        {record.recommendation} Alert Zone
                      </strong>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="dhist-empty">
              No DASS-21 assessment history available for this student yet.
            </div>
          )}

          <div style={{textAlign: 'center'}}>
            <Link
              to={`/counsellor/student-profile/${studentId}`}
              className="dhist-btn-sec"
              style={{borderStyle: 'dashed'}}
            >
              Back to Student Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DassHistoryPage;