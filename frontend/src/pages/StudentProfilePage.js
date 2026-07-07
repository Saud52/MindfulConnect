import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../apiBaseUrl';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
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

  .sprofile-root {
    min-height: 100vh;
    background: var(--cream);
    font-family: 'DM Sans', sans-serif;
    position: relative;
    overflow-x: hidden;
  }

  .sprofile-root::before,
  .sprofile-root::after {
    content: '';
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
  }
  .sprofile-root::before {
    width: 700px; height: 700px;
    background: radial-gradient(circle, rgba(122,158,126,0.13) 0%, transparent 70%);
    top: -200px; right: -200px;
    animation: blobFloat1 18s ease-in-out infinite;
  }
  .sprofile-root::after {
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

  .sprofile-wrap {
    position: relative;
    z-index: 1;
    max-width: 900px;
    margin: 0 auto;
    padding: 60px 24px 100px;
  }

  .sprofile-header {
    text-align: center;
    margin-bottom: 50px;
    opacity: 0;
    transform: translateY(28px);
    animation: fadeUp 0.9s cubic-bezier(.22,1,.36,1) 0.1s forwards;
  }

  .sprofile-eyebrow {
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

  .sprofile-title {
    font-family: 'Fraunces', Georgia, serif;
    font-size: clamp(2.2rem, 5vw, 3.4rem);
    font-weight: 300;
    color: var(--ink);
    line-height: 1.15;
    margin: 0 0 15px;
    letter-spacing: -0.02em;
  }

  .sprofile-title em {
    font-style: italic;
    color: var(--sage);
  }

  .sprofile-content {
    opacity: 0;
    animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) 0.35s forwards;
  }

  .sprofile-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 25px;
    margin-bottom: 40px;
  }

  .sprofile-card {
    background: var(--white);
    border-radius: var(--radius);
    padding: 30px;
    box-shadow: var(--shadow-soft);
    border: 1px solid rgba(122,158,126,0.1);
    transition: transform 0.22s, box-shadow 0.22s;
  }
  .sprofile-card:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-mid);
  }

  .sprofile-label {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    color: var(--ink-soft);
    font-weight: 600;
    margin-bottom: 10px;
  }

  .sprofile-val {
    font-family: 'DM Sans', sans-serif;
    font-size: 1.15rem;
    color: var(--ink-mid);
    font-weight: 500;
  }

  /* DatePicker Overrides for Booking */
  .book-date-wrapper {
    display: flex;
    justify-content: center;
    margin-bottom: 30px;
  }
  .react-datepicker {
    font-family: 'DM Sans', sans-serif !important;
    border: none !important;
    border-radius: var(--radius-sm) !important;
    box-shadow: var(--shadow-soft) !important;
  }
  .react-datepicker__header {
    background-color: var(--sage-pale) !important;
    border-bottom: 1px solid var(--cream-warm) !important;
    border-top-left-radius: var(--radius-sm) !important;
    border-top-right-radius: var(--radius-sm) !important;
  }
  .react-datepicker__day--selected, .react-datepicker__day--keyboard-selected {
    background-color: var(--sage) !important;
    color: var(--white) !important;
  }

  .book-times-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
    gap: 15px;
    margin-bottom: 30px;
  }

  .book-time-btn {
    background: var(--white);
    border: 1.5px solid var(--cream-warm);
    border-radius: var(--radius-sm);
    padding: 14px 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    font-weight: 500;
    color: var(--ink-mid);
    cursor: pointer;
    transition: all 0.2s cubic-bezier(.22,1,.36,1);
  }
  .book-time-btn:hover:not(:disabled) {
    border-color: var(--sage-light);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(122,158,126,0.1);
  }
  .book-time-btn.selected {
    background: var(--sage);
    border-color: var(--sage);
    color: var(--white);
    box-shadow: 0 4px 16px rgba(122,158,126,0.25);
  }
  .book-time-btn:disabled {
    background: var(--cream);
    color: var(--ink-soft);
    opacity: 0.6;
    cursor: not-allowed;
    text-decoration: line-through;
  }

  .sprofile-btn {
    display: inline-block;
    text-align: center;
    font-family: 'DM Sans', sans-serif;
    font-size: 1.05rem;
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
  .sprofile-btn:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 8px 32px rgba(122,158,126,0.45);
    color: var(--white);
  }

  .sprofile-btn-sec {
    display: inline-block;
    text-align: center;
    font-family: 'DM Sans', sans-serif;
    font-size: 1.05rem;
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
  .sprofile-btn-sec:hover {
    background: var(--sage-pale);
    color: var(--ink);
    transform: translateY(-2px);
  }

  .sprofile-actions {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-bottom: 40px;
    flex-wrap: wrap;
  }

  .sprofile-divider {
    height: 1px;
    background: var(--cream-warm);
    margin: 40px 0;
  }

  .booking-section-card {
    background: var(--white);
    border-radius: var(--radius);
    padding: 40px;
    box-shadow: var(--shadow-soft);
    border: 1px solid rgba(122,158,126,0.1);
    margin-top: 20px;
    text-align: center;
  }

  .booking-section-heading {
    font-family: 'Fraunces', serif;
    font-size: 1.8rem;
    color: var(--ink-mid);
    margin-bottom: 30px;
    font-weight: 400;
  }

  @keyframes fadeUp {
    to { opacity: 1; transform: translateY(0); }
  }
`;

function StudentProfilePage() {
    const { id: studentId } = useParams();
    const { user: counsellorUser } = useAuth(); // The logged-in counsellor
    
    useEffect(() => {
        console.log('Current counsellor user data:', counsellorUser);
    }, [counsellorUser]);
    
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const styleRef = useRef(null);
    
    const [showBookingSection, setShowBookingSection] = useState(false);
    const [availability, setAvailability] = useState({ workingHours: [], bookedSlots: [] });
    const [selectedDate, setSelectedDate] = useState(null);
    const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

    useEffect(() => {
        const el = document.createElement('style');
        el.textContent = CSS;
        document.head.appendChild(el);
        styleRef.current = el;
        return () => el.remove();
    }, []);

    const normalizeDate = (date) => {
        if (!date) return null;
        const normalized = new Date(date);
        normalized.setHours(12, 0, 0, 0);
        return normalized;
    };

    useEffect(() => {
        const fetchStudentProfile = async () => {
            if (!studentId || studentId === 'undefined') {
                setLoading(false);
                return;
            }
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${API_BASE_URL}/api/students/${studentId}`, {
                    headers: { 'x-auth-token': token }
                });
                setStudent(res.data);
            } catch (error) {
                console.error("Failed to fetch student profile", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStudentProfile();
    }, [studentId]);

    useEffect(() => {
        const fetchCounsellorAvailability = async () => {
            if (showBookingSection && counsellorUser && counsellorUser.userId) {
                try {
                    const token = localStorage.getItem('token');
                    const res = await axios.get(`${API_BASE_URL}/api/counsellors/${counsellorUser.userId}`, {
                        headers: { 'x-auth-token': token }
                    });
                    if (!res.data.availability) {
                        console.error('No availability data in response');
                        return;
                    }
                    setAvailability(res.data.availability);
                } catch (err) {
                    console.error("Failed to fetch counsellor availability", err, err.response?.data);
                }
            }
        };
        fetchCounsellorAvailability();
    }, [showBookingSection, counsellorUser]);
    
    useEffect(() => {
        if (selectedDate && availability.workingHours) {
            const dayOfWeek = selectedDate.getDay();
            const formattedDate = new Date(selectedDate).toISOString().split('T')[0];
            const dailyWorkingHours = availability.workingHours.find(wh => wh.day === dayOfWeek);

            if (!dailyWorkingHours) {
                setAvailableTimeSlots([]);
                return;
            }

            const slots = [];
            const startHour = parseInt(dailyWorkingHours.start.split(':')[0]);
            let currentTime = new Date(selectedDate);
            currentTime.setHours(startHour, 0, 0, 0);

            const endHour = parseInt(dailyWorkingHours.end.split(':')[0]);
            const endTime = new Date(selectedDate);
            endTime.setHours(endHour, 0, 0, 0);

            while (currentTime.getTime() < endTime.getTime()) {
                const slotStart = new Date(currentTime);
                currentTime.setMinutes(currentTime.getMinutes() + 30);
                const slotEnd = new Date(currentTime);
                const slotString = `${String(slotStart.getHours()).padStart(2, '0')}:${String(slotStart.getMinutes()).padStart(2, '0')}-${String(slotEnd.getHours()).padStart(2, '0')}:${String(slotEnd.getMinutes()).padStart(2, '0')}`;
                const isBooked = availability.bookedSlots.some(booked => booked.date === formattedDate && booked.time === slotString);
                const isPast = new Date() > slotEnd;
                slots.push({ time: slotString, isBooked, isPast });
            }
            setAvailableTimeSlots(slots);
            setSelectedTimeSlot(null);
        }
    }, [selectedDate, availability]);

    const handleBooking = async () => {
        if (!selectedDate || !selectedTimeSlot || !student) {
            return alert('Please select a date and time.');
        }

        const bookingDate = normalizeDate(selectedDate);
        
        if (!counsellorUser || !counsellorUser.username) {
            return alert('Counsellor information is incomplete. Please try logging in again.');
        }

        try {
            const token = localStorage.getItem('token');
            const counsellorName = counsellorUser?.username || counsellorUser?.name || localStorage.getItem('username');
            const counsellorId = counsellorUser?.userId || counsellorUser?.id || localStorage.getItem('userId');

            if (!counsellorId || !counsellorName) {
                throw new Error('Counsellor information is incomplete. Please try logging in again.');
            }

            const bookingData = {
                studentId: student._id,
                studentName: student.username,
                counselorId: counsellorId,
                counselorName: counsellorName,
                date: new Date(selectedDate),
                time: selectedTimeSlot,
                status: 'scheduled'
            };
            
            const res = await axios.post(`${API_BASE_URL}/api/appointments/book`, bookingData, {
                headers: { 'x-auth-token': token }
            });
            
            alert(res.data.msg);
            setShowBookingSection(false);
            setSelectedDate(null);
            setSelectedTimeSlot(null);
        } catch (err) {
            const errorMessage = err.response?.data?.msg || "Booking failed. Please try again.";
            alert(errorMessage);
        }
    };

    const filterAvailableDays = (date) => {
        const normalizedDate = normalizeDate(date);
        
        if (!availability.workingHours || !Array.isArray(availability.workingHours)) {
            return false;
        }

        const dayOfWeek = normalizedDate.getDay();
        const hasWorkingHours = availability.workingHours.some(wh => wh.day === dayOfWeek);
        const today = normalizeDate(new Date());
        return hasWorkingHours && normalizedDate >= today;
    };

    if (loading) {
        return (
          <div className="sprofile-root" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{fontFamily: "'Fraunces', serif", fontSize: '1.2rem', color: 'var(--ink-mid)', fontStyle: 'italic'}}>
              Loading student profile...
            </div>
          </div>
        );
    }

    if (!student) {
        return (
            <div className="sprofile-root" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px'}}>
                <h2 style={{fontFamily: "'Fraunces', serif", color: 'var(--clay)'}}>Student Not Found</h2>
                <Link to="/counsellor/students" className="sprofile-btn-sec">Back to Student List</Link>
            </div>
        );
    }

    return (
        <div className="sprofile-root">
            <div className="sprofile-wrap">
                <header className="sprofile-header">
                    <span className="sprofile-eyebrow">Student Intel</span>
                    <h1 className="sprofile-title">Profile: <em>{student.username}</em></h1>
                </header>
                
                <div className="sprofile-content">
                    <div className="sprofile-grid">
                        <div className="sprofile-card">
                            <p className="sprofile-label">Email</p>
                            <p className="sprofile-val">{student.email}</p>
                        </div>
                        <div className="sprofile-card">
                            <p className="sprofile-label">Grade/Year</p>
                            <p className="sprofile-val">{student.profile.grade || 'N/A'}</p>
                        </div>
                        <div className="sprofile-card">
                            <p className="sprofile-label">School</p>
                            <p className="sprofile-val">{student.profile.school || 'N/A'}</p>
                        </div>
                    </div>

                    <div className="sprofile-actions">
                        <Link to={`/counsellor/student-dass-history/${student._id}`} className="sprofile-btn flex-1">View Full DASS History</Link>
                        <button onClick={() => setShowBookingSection(prev => !prev)} className="sprofile-btn-sec flex-1">
                            {showBookingSection ? 'Cancel Scheduling' : 'Schedule New Session'}
                        </button>
                        <Link to="/counsellor/students" className="sprofile-btn-sec flex-1" style={{borderStyle: 'dashed'}}>Back to Students</Link>
                    </div>

                    {showBookingSection && (
                        <div className="booking-section-card">
                            <h3 className="booking-section-heading">Schedule Session for {student.username}</h3>
                            <div className="book-date-wrapper">
                                <DatePicker 
                                    selected={selectedDate} 
                                    onChange={date => setSelectedDate(normalizeDate(date))}
                                    filterDate={filterAvailableDays} 
                                    inline 
                                    minDate={new Date()}
                                    dateFormat="MMMM d, yyyy"
                                    utcOffset={0}
                                />
                            </div>
                            {selectedDate && (
                                <div>
                                    <h4 style={{fontFamily: "'DM Sans', sans-serif", fontSize: '1.05rem', color: 'var(--ink-mid)', marginBottom: '15px'}}>
                                        Available Slots for {new Date(selectedDate).toISOString().split('T')[0]}:
                                    </h4>
                                    <div className="book-times-grid">
                                        {availableTimeSlots.map(slot => (
                                            <button 
                                                key={slot.time} 
                                                onClick={() => setSelectedTimeSlot(slot.time)} 
                                                disabled={slot.isBooked || slot.isPast}
                                                className={`book-time-btn ${selectedTimeSlot === slot.time ? 'selected' : ''}`}
                                            >
                                                {slot.time}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <button onClick={handleBooking} disabled={!selectedTimeSlot} className="sprofile-btn" style={{marginTop: '20px'}}>
                                Confirm Booking
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default StudentProfilePage;