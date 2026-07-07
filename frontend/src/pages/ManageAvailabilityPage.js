import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../apiBaseUrl';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const formatDateToDDMMYYYY = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
};

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

  .avail-root {
    min-height: 100vh;
    background: var(--cream);
    font-family: 'DM Sans', sans-serif;
    position: relative;
    overflow-x: hidden;
  }

  .avail-root::before,
  .avail-root::after {
    content: '';
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
  }
  .avail-root::before {
    width: 700px; height: 700px;
    background: radial-gradient(circle, rgba(122,158,126,0.13) 0%, transparent 70%);
    top: -200px; right: -200px;
    animation: blobFloat1 18s ease-in-out infinite;
  }
  .avail-root::after {
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

  .avail-wrap {
    position: relative;
    z-index: 1;
    max-width: 900px;
    margin: 0 auto;
    padding: 60px 24px 100px;
  }

  .avail-header {
    text-align: center;
    margin-bottom: 50px;
    opacity: 0;
    transform: translateY(28px);
    animation: fadeUp 0.9s cubic-bezier(.22,1,.36,1) 0.1s forwards;
  }

  .avail-eyebrow {
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

  .avail-title {
    font-family: 'Fraunces', Georgia, serif;
    font-size: clamp(2.2rem, 5vw, 3.4rem);
    font-weight: 300;
    color: var(--ink);
    line-height: 1.15;
    margin: 0 0 15px;
    letter-spacing: -0.02em;
  }

  .avail-title em {
    font-style: italic;
    color: var(--sage);
  }

  .avail-content {
    opacity: 0;
    animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) 0.35s forwards;
  }

  .avail-card {
    background: var(--white);
    border-radius: var(--radius);
    padding: 40px;
    box-shadow: var(--shadow-soft);
    border: 1px solid rgba(122,158,126,0.1);
    margin-bottom: 40px;
  }

  .avail-card-heading {
    font-family: 'Fraunces', serif;
    font-size: 1.8rem;
    color: var(--ink-mid);
    margin-bottom: 30px;
    font-weight: 400;
    text-align: center;
  }
  .avail-sub-heading {
    font-family: 'Fraunces', serif;
    font-size: 1.4rem;
    color: var(--ink-mid);
    margin: 40px 0 20px;
    font-weight: 400;
    text-align: center;
    border-top: 1px solid var(--cream-warm);
    padding-top: 30px;
  }

  .avail-list {
    list-style: none;
    padding: 0;
    margin: 0 0 30px 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .avail-item {
    background: var(--cream);
    border: 1.5px solid var(--cream-warm);
    border-radius: var(--radius-sm);
    padding: 16px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: 'DM Sans', sans-serif;
  }
  .avail-item strong {
    color: var(--ink);
    font-weight: 600;
  }

  .avail-input {
    background: var(--white);
    border: 1.5px solid var(--cream-warm);
    border-radius: var(--radius-sm);
    padding: 12px 16px;
    font-family: 'DM Sans', sans-serif;
    color: var(--ink-mid);
    font-size: 0.95rem;
    transition: all 0.2s ease;
    width: 100%;
    box-sizing: border-box;
  }
  .avail-input:focus {
    outline: none;
    border-color: var(--sage);
    box-shadow: 0 0 0 4px rgba(122,158,126,0.1);
  }

  .avail-row {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 12px 0;
    border-bottom: 1px solid var(--cream-warm);
  }

  .avail-btn {
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
  }
  .avail-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(122,158,126,0.4);
    color: var(--white);
  }

  .avail-btn-sec {
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
    transition: all 0.3s;
  }
  .avail-btn-sec:hover {
    background: var(--sage-pale);
    color: var(--ink);
    transform: translateY(-2px);
  }
  
  .avail-btn-danger {
    background: transparent;
    border: none;
    color: var(--clay);
    cursor: pointer;
    font-weight: bold;
    font-size: 1.1rem;
    padding: 4px 8px;
    transition: transform 0.2s;
  }
  .avail-btn-danger:hover {
    transform: scale(1.1);
  }

  .avail-form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 15px;
    margin-bottom: 20px;
  }

  .react-datepicker-wrapper {
    width: 100%;
  }

  @keyframes fadeUp {
    to { opacity: 1; transform: translateY(0); }
  }
`;

function ManageAvailabilityPage() {
    const [regularHours, setRegularHours] = useState({});
    const [blockedSlots, setBlockedSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const styleRef = useRef(null);

    const [isEditingHours, setIsEditingHours] = useState(false);
    const [tempHours, setTempHours] = useState({});
    
    const [blockDate, setBlockDate] = useState(null);
    const [blockStartTime, setBlockStartTime] = useState('');
    const [blockEndTime, setBlockEndTime] = useState('');
    const [blockReason, setBlockReason] = useState('');

    useEffect(() => {
        const el = document.createElement('style');
        el.textContent = CSS;
        document.head.appendChild(el);
        styleRef.current = el;
        return () => el.remove();
    }, []);

    useEffect(() => {
        fetchAvailability();
    }, []);

    const fetchAvailability = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE_URL}/api/counsellors/availability/me`, {
                headers: { 'x-auth-token': token }
            });
            setRegularHours(res.data.regularHours || {});
            setBlockedSlots(res.data.blockedSlots || []);
            setTempHours(res.data.regularHours || {}); 
        } catch (err) {
            console.error("Failed to fetch availability", err);
            alert('Could not load your availability.');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveAvailability = async (newHours, newSlots) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_BASE_URL}/api/counsellors/availability`, 
                { regularHours: newHours, blockedSlots: newSlots },
                { headers: { 'x-auth-token': token } }
            );
            return true;
        } catch (err) {
            console.error("Failed to save availability", err);
            alert('Could not save availability.');
            return false;
        }
    };

    const handleHoursChange = (dayIndex, field, value) => {
        setTempHours(prev => {
            const dayHours = prev[dayIndex] ? [...prev[dayIndex]] : [{ start: '', end: '' }];
            dayHours[0] = { ...dayHours[0], [field]: value };
            return { ...prev, [dayIndex]: dayHours };
        });
    };

    const handleToggleWorkingDay = (dayIndex, isWorking) => {
        setTempHours(prev => {
            if (isWorking) {
                return { ...prev, [dayIndex]: prev[dayIndex] || [{ start: '09:00', end: '17:00' }] };
            } else {
                const newHours = { ...prev };
                delete newHours[dayIndex];
                return newHours;
            }
        });
    };

    const onSaveRegularHours = async () => {
        const success = await handleSaveAvailability(tempHours, blockedSlots);
        if (success) {
            setRegularHours(tempHours);
            setIsEditingHours(false);
            alert('Regular hours saved!');
        }
    };

    const onAddBlockedSlot = async (e) => {
        e.preventDefault();
        if (!blockDate || !blockStartTime || !blockEndTime) {
            return alert('Please fill out all fields for the blocked slot.');
        }
        const newSlot = {
            date: new Date(blockDate).toISOString().split('T')[0],
            timeStart: blockStartTime,
            timeEnd: blockEndTime,
            reason: blockReason || 'Unavailable'
        };
        const newBlockedSlots = [...blockedSlots, newSlot];
        const success = await handleSaveAvailability(regularHours, newBlockedSlots);
        if (success) {
            setBlockedSlots(newBlockedSlots);
            setBlockDate(null);
            setBlockStartTime('');
            setBlockEndTime('');
            setBlockReason('');
            alert('Slot blocked successfully!');
        }
    };

    const onDeleteBlockedSlot = async (slotToDelete) => {
        const newBlockedSlots = blockedSlots.filter(slot => !(
            slot.date === slotToDelete.date && 
            slot.timeStart === slotToDelete.timeStart &&
            slot.timeEnd === slotToDelete.timeEnd
        ));
        const success = await handleSaveAvailability(regularHours, newBlockedSlots);
        if (success) {
            setBlockedSlots(newBlockedSlots);
        }
    };

    const getDayName = (dayIndex) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[parseInt(dayIndex, 10)];
    };

    if (loading) {
        return (
          <div className="avail-root" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{fontFamily: "'Fraunces', serif", fontSize: '1.2rem', color: 'var(--ink-mid)', fontStyle: 'italic'}}>
              Loading your availability...
            </div>
          </div>
        );
    }

    return (
        <div className="avail-root">
            <div className="avail-wrap">
                <header className="avail-header">
                    <span className="avail-eyebrow">Professional Portal</span>
                    <h1 className="avail-title">Manage Your <em>Availability</em></h1>
                </header>
                
                <div className="avail-content">
                    <div className="avail-card">
                        <h3 className="avail-card-heading">Regular Working Hours</h3>
                        {!isEditingHours ? (
                            <>
                                <ul className="avail-list">
                                    {Object.entries(regularHours).length > 0 ? (
                                        Object.entries(regularHours).map(([day, times]) => (
                                            <li key={day} className="avail-item">
                                                <strong>{getDayName(day)}</strong>
                                                <span style={{color: 'var(--ink-soft)'}}>{times.map(t => `${t.start} - ${t.end}`).join(', ')}</span>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="avail-item" style={{justifyContent: 'center', fontStyle: 'italic', color: 'var(--ink-soft)'}}>
                                            No regular hours set.
                                        </li>
                                    )}
                                </ul>
                                <div style={{textAlign: 'center'}}>
                                    <button onClick={() => setIsEditingHours(true)} className="avail-btn">Edit Hours</button>
                                </div>
                            </>
                        ) : (
                            <div>
                                {['1', '2', '3', '4', '5', '6', '0'].map(dayIndex => (
                                    <div key={dayIndex} className="avail-row">
                                        <label style={{fontWeight: '600', minWidth: '130px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--ink-mid)'}}>
                                            <input type="checkbox" checked={!!tempHours[dayIndex]} onChange={e => handleToggleWorkingDay(dayIndex, e.target.checked)} />
                                            {getDayName(dayIndex)}
                                        </label>
                                        {tempHours[dayIndex] && (
                                            <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                                <input type="text" placeholder="HH:MM" value={tempHours[dayIndex][0]?.start || ''} onChange={e => handleHoursChange(dayIndex, 'start', e.target.value)} className="avail-input" style={{maxWidth: '100px'}} />
                                                <span style={{color: 'var(--ink-soft)'}}>to</span>
                                                <input type="text" placeholder="HH:MM" value={tempHours[dayIndex][0]?.end || ''} onChange={e => handleHoursChange(dayIndex, 'end', e.target.value)} className="avail-input" style={{maxWidth: '100px'}} />
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <div style={{display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px'}}>
                                    <button onClick={onSaveRegularHours} className="avail-btn">Save Hours</button>
                                    <button onClick={() => { setIsEditingHours(false); setTempHours(regularHours); }} className="avail-btn-sec">Cancel</button>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className="avail-card">
                        <h3 className="avail-card-heading">Block Specific Times</h3>
                        <form onSubmit={onAddBlockedSlot}>
                            <div className="avail-form-grid">
                                <div className="react-datepicker-wrapper">
                                    <DatePicker 
                                        selected={blockDate} 
                                        onChange={date => setBlockDate(date)} 
                                        placeholderText="Select Date" 
                                        className="avail-input" 
                                        required 
                                        minDate={new Date()} 
                                    />
                                </div>
                                <input type="text" placeholder="Start (HH:MM)" value={blockStartTime} onChange={e => setBlockStartTime(e.target.value)} className="avail-input" required />
                                <input type="text" placeholder="End (HH:MM)" value={blockEndTime} onChange={e => setBlockEndTime(e.target.value)} className="avail-input" required />
                                <input type="text" placeholder="Reason (Optional)" value={blockReason} onChange={e => setBlockReason(e.target.value)} className="avail-input" />
                            </div>
                            <div style={{textAlign: 'center', marginTop: '10px'}}>
                                <button type="submit" className="avail-btn-sec">Add Blocked Time</button>
                            </div>
                        </form>
                        
                        <h4 className="avail-sub-heading">Currently Blocked Slots</h4>
                        <ul className="avail-list" style={{marginBottom: 0}}>
                            {blockedSlots.length > 0 ? (
                                blockedSlots.map((slot, index) => (
                                    <li key={index} className="avail-item">
                                        <div>
                                            <strong style={{color: 'var(--clay)'}}>{formatDateToDDMMYYYY(slot.date)}</strong>
                                            <span style={{margin: '0 10px', color: 'var(--ink)'}}>| {slot.timeStart} - {slot.timeEnd}</span>
                                            {slot.reason && <span style={{fontStyle: 'italic', color: 'var(--ink-soft)'}}>({slot.reason})</span>}
                                        </div>
                                        <button onClick={() => onDeleteBlockedSlot(slot)} className="avail-btn-danger" title="Remove Block">✕</button>
                                    </li>
                                ))
                            ) : (
                                <li className="avail-item" style={{justifyContent: 'center', fontStyle: 'italic', color: 'var(--ink-soft)'}}>
                                    No slots are currently blocked.
                                </li>
                            )}
                        </ul>
                    </div>
                    
                    <div style={{textAlign: 'center', marginTop: '40px'}}>
                        <Link to="/counsellor/dashboard" className="avail-btn-sec" style={{borderStyle: 'dashed'}}>Back to Dashboard</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManageAvailabilityPage;