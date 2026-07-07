import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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

  .vall-root {
    min-height: 100vh;
    background: var(--cream);
    font-family: 'DM Sans', sans-serif;
    position: relative;
    overflow-x: hidden;
  }

  .vall-root::before,
  .vall-root::after {
    content: '';
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
  }

  .vall-root::before {
    width: 700px; height: 700px;
    background: radial-gradient(circle, rgba(122,158,126,0.13) 0%, transparent 70%);
    top: -200px; right: -200px;
    animation: blobFloat1 18s ease-in-out infinite;
  }

  .vall-root::after {
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

  .vall-wrap {
    position: relative;
    z-index: 1;
    max-width: 1000px;
    margin: 0 auto;
    padding: 60px 24px 100px;
  }

  .vall-header {
    text-align: center;
    margin-bottom: 50px;
    opacity: 0;
    transform: translateY(28px);
    animation: fadeUp 0.9s cubic-bezier(.22,1,.36,1) 0.1s forwards;
  }

  .vall-eyebrow {
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

  .vall-title {
    font-family: 'Fraunces', Georgia, serif;
    font-size: clamp(2.2rem, 5vw, 3.4rem);
    font-weight: 300;
    color: var(--ink);
    line-height: 1.15;
    margin: 0 0 15px;
    letter-spacing: -0.02em;
  }

  .vall-title em {
    font-style: italic;
    color: var(--sage);
  }

  .vall-content {
    opacity: 0;
    animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) 0.35s forwards;
  }

  .vall-list {
    display: grid;
    grid-template-columns: 1fr;
    gap: 25px;
    margin-bottom: 50px;
    list-style: none;
    padding: 0;
  }

  .vall-card {
    background: var(--white);
    border-radius: var(--radius);
    padding: 30px;
    box-shadow: var(--shadow-soft);
    border: 1px solid rgba(122,158,126,0.1);
    transition: transform 0.22s, box-shadow 0.22s;
    display: flex;
    flex-direction: column;
  }
  .vall-card:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-mid);
  }

  .vall-card-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--cream-warm);
    padding-bottom: 15px;
    margin-bottom: 25px;
    flex-wrap: wrap;
    gap: 10px;
  }

  .vall-name {
    font-family: 'Fraunces', serif;
    font-size: 1.6rem;
    color: var(--ink-mid);
    margin: 0;
  }

  .vall-date {
    font-family: 'DM Sans', sans-serif;
    color: var(--ink-soft);
    font-size: 0.95rem;
  }

  .vall-scores-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 15px;
    margin-bottom: 25px;
  }

  .vall-score-detail {
    display: flex;
    flex-direction: column;
    background: var(--sage-pale);
    padding: 15px;
    border-radius: var(--radius-sm);
  }

  .vall-score-label {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    color: var(--ink-soft);
    font-weight: 600;
    margin-bottom: 5px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .vall-score-value {
    font-family: 'Fraunces', serif;
    font-size: 1.25rem;
    font-weight: 400;
  }

  .vall-overall {
    font-family: 'DM Sans', sans-serif;
    font-size: 1.05rem;
    color: var(--ink-mid);
    margin-bottom: 25px;
  }

  .vall-actions {
    display: flex;
    justify-content: flex-end;
    gap: 15px;
    flex-wrap: wrap;
    border-top: 1px solid var(--cream-warm);
    padding-top: 20px;
    margin-top: auto;
  }

  .vall-btn-export {
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

  .vall-btn-export:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(122,158,126,0.4);
    color: var(--white);
  }

  .vall-btn {
    display: inline-block;
    text-align: center;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    font-weight: 500;
    color: var(--white);
    background: linear-gradient(135deg, var(--sage) 0%, #5a8a5f 100%);
    border: none;
    padding: 10px 20px;
    border-radius: 100px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(.22,1,.36,1);
    text-decoration: none;
  }
  .vall-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(122,158,126,0.3);
    color: var(--white);
  }

  .vall-btn-sec {
    display: inline-block;
    text-align: center;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    font-weight: 500;
    color: var(--ink-mid);
    background: transparent;
    border: 1.5px solid var(--sage);
    padding: 10px 20px;
    border-radius: 100px;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.3s;
  }
  .vall-btn-sec:hover {
    background: var(--sage-pale);
    color: var(--ink);
    transform: translateY(-2px);
  }

  .vall-empty {
    text-align: center;
    background: var(--white);
    padding: 50px;
    border-radius: var(--radius);
    box-shadow: var(--shadow-soft);
    color: var(--ink-soft);
    font-style: italic;
    margin-bottom: 50px;
    font-family: 'DM Sans', sans-serif;
  }

  @keyframes fadeUp {
    to { opacity: 1; transform: translateY(0); }
  }
`;

function ViewAllDassReportsPage() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
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
    const fetchAllConsentedDassReports = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication token missing. Please log in again.');
          setLoading(false);
          return;
        }
        if (!user || user.role !== 'counsellor') {
          setError('Access denied. Only counsellors can view this page.');
          setLoading(false);
          return;
        }

        const res = await axios.get(`${API_BASE_URL}/api/dass21/reports/all-consented`, {
          headers: { 'x-auth-token': token }
        });

        setReports(res.data.reports);
      } catch (err) {
        console.error('Failed to fetch all DASS reports:', err);
        setError(err.response?.data?.msg || 'Failed to load DASS reports. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllConsentedDassReports();
  }, [user]);

  const handleContactStudent = async (student) => {
    if (!student || !student._id) {
        alert('Student details are missing.');
        return;
    }
    try {
        const token = localStorage.getItem('token');
        const res = await axios.post(`${API_BASE_URL}/api/counsellors/contact-student`, 
            { studentId: student._id }, 
            { headers: { 'x-auth-token': token } }
        );
        alert(res.data.msg || `Email sent successfully to ${student.username}!`);
    } catch (err) {
        console.error('Failed to send email:', err);
        alert(err.response?.data?.msg || 'Could not send email.');
    }
  };

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

  const exportAllReportsToExcel = () => {
    if (!reports.length) return;

    const formattedData = reports.map(report => ({
      Student_Name: report.userId?.username || report.userId?.email || 'N/A',
      Grade_Year: report.userId?.profile?.grade || 'N/A',
      Date: new Date(report.testDate).toLocaleDateString(),
      Depression_Score: report.depression,
      Anxiety_Score: report.anxiety,
      Stress_Score: report.stress,
      Overall_Zone: report.recommendation
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "All DASS Reports");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });

    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });

    saveAs(data, "All_DASS_Reports.xlsx");
  };

  if (loading) {
    return (
      <div className="vall-root" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{fontFamily: "'Fraunces', serif", fontSize: '1.2rem', color: 'var(--ink-mid)', fontStyle: 'italic'}}>
          Loading all DASS reports...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="vall-root">
        <div className="vall-wrap">
          <div className="vall-empty" style={{color: 'var(--clay)'}}>
            <h2 style={{fontFamily: "'Fraunces', serif"}}>Error Loading Reports</h2>
            <p>{error}</p>
            <div style={{marginTop: '20px'}}>
              <Link to="/counsellor/dashboard" className="vall-btn-sec">Back to Dashboard</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="vall-root">
      <div className="vall-wrap">
        <header className="vall-header">
          <span className="vall-eyebrow">Professional Database</span>
          <h1 className="vall-title">Patient <em>Assessment Data</em></h1>
        </header>

        <div className="vall-content">
          {reports.length === 0 ? (
            <div className="vall-empty">
              <p>No students have submitted assessments and consented to share their reports with counsellors at this time.</p>
              <div style={{marginTop: '20px'}}>
                <Link to="/counsellor/dashboard" className="vall-btn-sec">Back to Dashboard</Link>
              </div>
            </div>
          ) : (
            <>
              <div style={{textAlign: 'center'}}>
                <button onClick={exportAllReportsToExcel} className="vall-btn-export">
                  Export All Reports to Excel
                </button>
              </div>

              <ul className="vall-list">
                {reports.map((report) => (
                  <li key={report._id} className="vall-card">
                    <div className="vall-card-head">
                      <h4 className="vall-name">{report.userId?.username || report.userId?.email || 'Unknown Student'}</h4>
                      <span className="vall-date">{new Date(report.testDate).toLocaleDateString()}</span>
                    </div>

                    <div className="vall-scores-grid">
                      <div className="vall-score-detail">
                        <span className="vall-score-label">Depression</span>
                        <span className="vall-score-value" style={{color: getSeverityTextColor(getDassSeverityText(report.depression, 'depression'))}}>
                          {report.depression} <span style={{fontSize: '0.9rem'}}>({getDassSeverityText(report.depression, 'depression')})</span>
                        </span>
                      </div>
                      
                      <div className="vall-score-detail">
                        <span className="vall-score-label">Anxiety</span>
                        <span className="vall-score-value" style={{color: getSeverityTextColor(getDassSeverityText(report.anxiety, 'anxiety'))}}>
                          {report.anxiety} <span style={{fontSize: '0.9rem'}}>({getDassSeverityText(report.anxiety, 'anxiety')})</span>
                        </span>
                      </div>
                      
                      <div className="vall-score-detail">
                        <span className="vall-score-label">Stress</span>
                        <span className="vall-score-value" style={{color: getSeverityTextColor(getDassSeverityText(report.stress, 'stress'))}}>
                          {report.stress} <span style={{fontSize: '0.9rem'}}>({getDassSeverityText(report.stress, 'stress')})</span>
                        </span>
                      </div>
                    </div>

                    <div className="vall-overall">
                      Overall Alert Zone: <strong style={{color: getOverallZoneColor(report.recommendation)}}>{report.recommendation}</strong>
                    </div>

                    <div className="vall-actions">
                      <Link to={`/counsellor/student-profile/${report.userId?._id}`} className="vall-btn-sec">
                        View Profile
                      </Link>
                      <button onClick={() => handleContactStudent(report.userId)} className="vall-btn">
                        Contact Student
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div style={{textAlign: 'center'}}>
                <Link to="/counsellor/dashboard" className="vall-btn-sec" style={{borderStyle: 'dashed'}}>
                  Back to Dashboard
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewAllDassReportsPage;