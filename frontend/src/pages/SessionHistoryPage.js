import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../apiBaseUrl';
import { useAuth } from '../context/AuthContext';

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

  .hist-root {
    min-height: 100vh;
    background: var(--cream);
    font-family: 'DM Sans', sans-serif;
    position: relative;
    overflow-x: hidden;
  }

  .hist-root::before,
  .hist-root::after {
    content: '';
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
  }
  .hist-root::before {
    width: 700px; height: 700px;
    background: radial-gradient(circle, rgba(122,158,126,0.13) 0%, transparent 70%);
    top: -200px; right: -200px;
    animation: blobFloat1 18s ease-in-out infinite;
  }
  .hist-root::after {
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

  .hist-wrap {
    position: relative;
    z-index: 1;
    max-width: 1000px;
    margin: 0 auto;
    padding: 60px 24px 100px;
  }

  .hist-header {
    text-align: center;
    margin-bottom: 64px;
    opacity: 0;
    transform: translateY(28px);
    animation: fadeUp 0.9s cubic-bezier(.22,1,.36,1) 0.1s forwards;
  }

  .hist-eyebrow {
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

  .hist-title {
    font-family: 'Fraunces', Georgia, serif;
    font-size: clamp(2.2rem, 5vw, 3.4rem);
    font-weight: 300;
    color: var(--ink);
    line-height: 1.15;
    margin: 0 0 20px;
    letter-spacing: -0.02em;
  }

  .hist-title em {
    font-style: italic;
    color: var(--sage);
  }

  .hist-content {
    opacity: 0;
    animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) 0.35s forwards;
  }

  .hist-search-wrap {
    margin-bottom: 30px;
    display: flex;
    justify-content: center;
  }
  .hist-search-input {
    width: 100%;
    max-width: 500px;
    background: var(--white);
    border: 1.5px solid var(--cream-warm);
    border-radius: 100px;
    padding: 14px 24px;
    font-family: 'DM Sans', sans-serif;
    font-size: 1rem;
    color: var(--ink);
    box-shadow: var(--shadow-soft);
    transition: all 0.3s;
  }
  .hist-search-input:focus {
    outline: none;
    border-color: var(--sage);
    box-shadow: 0 0 0 4px rgba(122,158,126,0.1);
  }

  /* Table styling for Counsellor */
  .hist-table-container {
    background: var(--white);
    border-radius: var(--radius);
    padding: 30px;
    box-shadow: var(--shadow-soft);
    border: 1px solid rgba(122,158,126,0.1);
    overflow-x: auto;
    margin-bottom: 30px;
  }

  .hist-table {
    width: 100%;
    border-collapse: collapse;
    font-family: 'DM Sans', sans-serif;
  }

  .hist-th {
    background-color: var(--sage-pale);
    color: var(--ink-mid);
    padding: 16px;
    text-align: left;
    font-weight: 600;
    border-bottom: 2px solid var(--sage-light);
  }

  .hist-td {
    padding: 16px;
    border-bottom: 1px solid var(--cream-warm);
    vertical-align: top;
    color: var(--ink);
  }

  /* List styling for student */
  .hist-list {
    list-style: none;
    padding: 0;
    margin: 0 auto;
    max-width: 800px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .hist-card {
    background: var(--white);
    border-radius: var(--radius);
    padding: 32px 36px;
    box-shadow: var(--shadow-soft);
    border: 1px solid rgba(122,158,126,0.1);
    transition: transform 0.22s, box-shadow 0.22s;
  }
  .hist-card:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-mid);
  }

  .hist-card-date {
    font-family: 'Fraunces', serif;
    font-size: 1.4rem;
    color: var(--ink-mid);
    margin-bottom: 12px;
  }

  .hist-card-detail {
    font-size: 1.05rem;
    color: var(--ink-soft);
    margin-bottom: 10px;
  }
  .hist-card-detail strong {
    color: var(--ink);
    font-weight: 600;
  }

  .hist-status {
    display: inline-block;
    padding: 6px 14px;
    border-radius: 100px;
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
  .hist-status-completed {
    background: var(--sage);
    color: var(--white);
  }
  .hist-status-pending {
    background: var(--clay-light);
    color: var(--ink);
  }

  .hist-remarks {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid var(--cream-warm);
    font-style: italic;
    color: var(--ink-soft);
    font-size: 0.95rem;
    line-height: 1.6;
  }

  .hist-textarea {
    width: 100%;
    background: var(--cream);
    border: 1.5px solid var(--cream-warm);
    border-radius: var(--radius-sm);
    padding: 12px;
    font-family: 'DM Sans', sans-serif;
    color: var(--ink);
    margin-bottom: 10px;
    resize: vertical;
  }
  .hist-textarea:focus {
    outline: none;
    border-color: var(--sage);
  }

  .hist-btn {
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
  .hist-btn:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 8px 32px rgba(122,158,126,0.45);
    color: var(--white);
  }

  .hist-btn-small {
    padding: 8px 16px;
    font-size: 0.85rem;
    border-radius: 100px;
    margin-right: 8px;
  }

  .hist-btn-sec {
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
  .hist-btn-sec:hover {
    background: var(--sage-pale);
    color: var(--ink);
    transform: translateY(-2px);
  }
  .hist-btn-sec-small {
    padding: 8px 16px;
    font-size: 0.85rem;
    border-radius: 100px;
  }

  .hist-no-data {
    text-align: center;
    padding: 40px;
    background: var(--white);
    border-radius: var(--radius);
    box-shadow: var(--shadow-soft);
    color: var(--ink-soft);
    font-style: italic;
    margin-bottom: 40px;
  }

  @keyframes fadeUp {
    to { opacity: 1; transform: translateY(0); }
  }
`;

// This sub-component is only used for the counsellor's view
const RemarksInput = ({ appointment, onSave }) => {
    const [remarks, setRemarks] = useState(appointment.remarks || '');
    const [showToStudent, setShowToStudent] = useState(appointment.showRemarksToStudent || false);
    const [isEditing, setIsEditing] = useState(false);

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_BASE_URL}/api/appointments/${appointment._id}/remarks`, 
                { remarks, showRemarksToStudent: showToStudent },
                { headers: { 'x-auth-token': token } }
            );
            setIsEditing(false);
            onSave(appointment._id, remarks, showToStudent);
            alert('Remarks saved!');
        } catch (err) {
            console.error('Failed to save remarks', err);
            alert('Could not save remarks.');
        }
    };

    return (
        <div style={{minWidth: '250px'}}>
            {isEditing ? (
                <>
                    <textarea 
                        value={remarks} 
                        onChange={(e) => setRemarks(e.target.value)}
                        className="hist-textarea"
                        rows={3}
                    />
                    <div style={{marginBottom: '10px'}}>
                        <label style={{fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem', color: 'var(--ink-mid)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'}}>
                            <input 
                                type="checkbox" 
                                checked={showToStudent} 
                                onChange={(e) => setShowToStudent(e.target.checked)} 
                                style={{accentColor: 'var(--sage)'}}
                            />
                            Visible to Student
                        </label>
                    </div>
                    <button onClick={handleSave} className="hist-btn hist-btn-small">Save</button>
                    <button onClick={() => setIsEditing(false)} className="hist-btn-sec hist-btn-sec-small">Cancel</button>
                </>
            ) : (
                <>
                    <p style={{margin: '0 0 10px 0', fontStyle: 'italic', color: 'var(--ink-soft)'}}>{remarks || 'No remarks yet.'}</p>
                    {remarks && (
                        <div style={{marginBottom: '10px'}}>
                            {showToStudent ? (
                                <span style={{fontSize: '0.8rem', backgroundColor: 'var(--sage-pale)', color: 'var(--sage)', padding: '4px 8px', borderRadius: '100px', fontWeight: 'bold'}}>Visible to Student</span>
                            ) : (
                                <span style={{fontSize: '0.8rem', backgroundColor: 'var(--cream-warm)', color: 'var(--ink-soft)', padding: '4px 8px', borderRadius: '100px', fontWeight: 'bold'}}>Hidden from Student</span>
                            )}
                        </div>
                    )}
                    <button onClick={() => setIsEditing(true)} className="hist-btn-sec hist-btn-sec-small">
                        {remarks ? 'Edit' : 'Add'} Remarks
                    </button>
                </>
            )}
        </div>
    );
};

function SessionHistoryPage() {
    const { user } = useAuth();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const styleRef = useRef(null);

    useEffect(() => {
        const el = document.createElement('style');
        el.textContent = CSS;
        document.head.appendChild(el);
        styleRef.current = el;
        return () => el.remove();
    }, []);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!user) { setLoading(false); return; }
            try {
                const token = localStorage.getItem('token');
                let endpoint = '';
                
                if (user.role === 'student') {
                    endpoint = `${API_BASE_URL}/api/appointments/history`;
                } else if (user.role === 'counsellor') {
                    endpoint = `${API_BASE_URL}/api/appointments/completed`;
                }
                
                if (endpoint) {
                    const res = await axios.get(endpoint, { headers: { 'x-auth-token': token } });
                    setRecords(res.data.appointments || res.data);
                }
            } catch (err) {
                console.error("Failed to fetch history/records:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [user]);

    const handleUpdateRemarks = (appointmentId, newRemarks, newShowToStudent) => {
        setRecords(prevRecords => 
            prevRecords.map(rec => 
                rec._id === appointmentId ? { ...rec, remarks: newRemarks, showRemarksToStudent: newShowToStudent } : rec
            )
        );
    };
    
    const getRecommendationStyle = (recommendation) => {
        if (!recommendation) return {};
        if (recommendation === 'Red') return { color: 'var(--clay)', fontWeight: 'bold' };
        if (recommendation === 'Yellow') return { color: '#e5a55d', fontWeight: 'bold' };
        if (recommendation === 'Green') return { color: 'var(--sage)', fontWeight: 'bold' };
        return {};
    };

    if (loading) {
        return (
          <div className="hist-root" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{fontFamily: "'Fraunces', serif", fontSize: '1.2rem', color: 'var(--ink-mid)', fontStyle: 'italic'}}>
              Loading records...
            </div>
          </div>
        );
    }

    // Prepare counsellor view records (calculate session numbers, apply search filter)
    const getCounsellorProcessedRecords = () => {
        // Track session counts per user. Oldest goes first to count sequentially correctly if needed.
        // Actually, let's sort oldest first to count properly.
        const sortedForCount = [...records].sort((a, b) => new Date(a.date) - new Date(b.date));
        const counts = {};
        const recordsWithSessions = sortedForCount.map(rec => {
            const stuId = rec.studentId?._id || 'unknown';
            counts[stuId] = (counts[stuId] || 0) + 1;
            return { ...rec, sessionNumber: counts[stuId] };
        });

        // Sort back to newest first
        recordsWithSessions.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Filter based on search term
        return recordsWithSessions.filter(rec => {
            if (!searchTerm) return true;
            const term = searchTerm.toLowerCase();
            const name = (rec.studentId?.username || '').toLowerCase();
            const email = (rec.studentId?.email || '').toLowerCase();
            return name.includes(term) || email.includes(term);
        });
    };

    // --- Counsellor's View ---
    if (user && user.role === 'counsellor') {
        const displayedRecords = getCounsellorProcessedRecords();

        return (
            <div className="hist-root">
                <div className="hist-wrap">
                    <header className="hist-header">
                        <span className="hist-eyebrow">Professional Portal</span>
                        <h1 className="hist-title">Completed <em>Sessions</em></h1>
                    </header>
                    <div className="hist-content">
                        
                        <div className="hist-search-wrap">
                            <input 
                                type="text"
                                placeholder="Search by student name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="hist-search-input"
                            />
                        </div>

                        <div className="hist-table-container">
                            <table className="hist-table">
                                <thead>
                                    <tr>
                                        <th className="hist-th">Session #</th>
                                        <th className="hist-th">Student Name</th>
                                        <th className="hist-th">Email</th>
                                        <th className="hist-th">Session Date</th>
                                        <th className="hist-th">Latest DASS</th>
                                        <th className="hist-th">Remarks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayedRecords.length > 0 ? displayedRecords.map(rec => (
                                        <tr key={rec._id}>
                                            <td className="hist-td" style={{fontWeight: 'bold', color: 'var(--sage)'}}>#{rec.sessionNumber}</td>
                                            <td className="hist-td"><strong>{rec.studentId?.username || 'N/A'}</strong></td>
                                            <td className="hist-td">{rec.studentId?.email || 'N/A'}</td>
                                            <td className="hist-td">{new Date(rec.date).toLocaleDateString()}</td>
                                            <td className="hist-td">
                                                {rec.latestDass ? (
                                                    <span style={getRecommendationStyle(rec.latestDass.recommendation)}>
                                                        {rec.latestDass.recommendation} Zone
                                                    </span>
                                                ) : (
                                                    <span style={{color: 'var(--ink-soft)'}}>No DASS record</span>
                                                )}
                                            </td>
                                            <td className="hist-td">
                                                <RemarksInput appointment={rec} onSave={handleUpdateRemarks} />
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="6" style={{textAlign: 'center', padding: '30px', color: 'var(--ink-soft)'}}>
                                                {searchTerm ? 'No sessions found matching your search.' : 'No completed session records found.'}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div style={{textAlign: 'center'}}>
                            <Link to="/counsellor/dashboard" className="hist-btn-sec" style={{borderStyle: 'dashed'}}>Back to Dashboard</Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    // --- Student's View ---
    if (user && user.role === 'student') {
        return (
            <div className="hist-root">
                <div className="hist-wrap">
                    <header className="hist-header">
                        <span className="hist-eyebrow">Personal Portal</span>
                        <h1 className="hist-title">Your Session <em>History</em></h1>
                    </header>
                    <div className="hist-content">
                        {records.length > 0 ? (
                            <ul className="hist-list">
                                {records.map(session => (
                                    <li key={session._id} className="hist-card">
                                        <p className="hist-card-date">
                                            {new Date(session.date).toLocaleDateString()}
                                        </p>
                                        <p className="hist-card-detail">
                                            Counsellor: <strong>{session.counselorName}</strong>
                                        </p>
                                        <p className="hist-card-detail">
                                            Status: <span className={`hist-status ${session.status === 'completed' ? 'hist-status-completed' : 'hist-status-pending'}`}>{session.status}</span>
                                        </p>
                                        {session.remarks && session.showRemarksToStudent && (
                                            <p className="hist-remarks">
                                                <strong>Counsellor's Remarks:</strong> {session.remarks}
                                            </p>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="hist-no-data">
                                <p style={{marginBottom: '20px'}}>You have no past sessions recorded.</p>
                                <Link to="/find-professional" className="hist-btn">Book Your First Session</Link>
                            </div>
                        )}
                        <div style={{marginTop: '40px', textAlign: 'center'}}>
                            <Link to="/student/dashboard" className="hist-btn-sec" style={{borderStyle: 'dashed'}}>Back to Dashboard</Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
      <div className="hist-root" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{fontFamily: "'Fraunces', serif", fontSize: '1.2rem', color: 'var(--ink-mid)'}}>
          Please log in to view this page.
        </div>
      </div>
    );
}

export default SessionHistoryPage;