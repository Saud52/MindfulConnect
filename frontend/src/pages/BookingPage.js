import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../apiBaseUrl';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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

  .book-root {
    min-height: 100vh;
    background: var(--cream);
    font-family: 'DM Sans', sans-serif;
    position: relative;
    overflow-x: hidden;
  }

  .book-root::before,
  .book-root::after {
    content: '';
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
  }
  .book-root::before {
    width: 700px; height: 700px;
    background: radial-gradient(circle, rgba(122,158,126,0.13) 0%, transparent 70%);
    top: -200px; right: -200px;
    animation: blobFloat1 18s ease-in-out infinite;
  }
  .book-root::after {
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

  .book-wrap {
    position: relative;
    z-index: 1;
    max-width: 900px;
    margin: 0 auto;
    padding: 60px 24px 100px;
  }

  .book-header {
    text-align: center;
    margin-bottom: 50px;
    opacity: 0;
    transform: translateY(28px);
    animation: fadeUp 0.9s cubic-bezier(.22,1,.36,1) 0.1s forwards;
  }

  .book-eyebrow {
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

  .book-title {
    font-family: 'Fraunces', Georgia, serif;
    font-size: clamp(2.2rem, 5vw, 3.4rem);
    font-weight: 300;
    color: var(--ink);
    line-height: 1.15;
    margin: 0 0 15px;
    letter-spacing: -0.02em;
  }

  .book-title em {
    font-style: italic;
    color: var(--sage);
  }

  .book-subtitle {
    font-size: 0.97rem;
    color: var(--ink-soft);
    line-height: 1.75;
    max-width: 520px;
    margin: 0 auto;
    font-weight: 500;
  }

  .book-card {
    background: var(--white);
    border-radius: var(--radius);
    padding: 40px;
    box-shadow: var(--shadow-soft);
    border: 1px solid rgba(122,158,126,0.1);
    opacity: 0;
    animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) 0.3s forwards;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .book-section-title {
    font-family: 'Fraunces', serif;
    font-size: 1.8rem;
    color: var(--ink-mid);
    margin-bottom: 30px;
    font-weight: 400;
  }

  /* DatePicker overrides to match Sage theme */
  .react-datepicker {
    font-family: 'DM Sans', sans-serif;
    border: 1.5px solid var(--cream-warm);
    border-radius: var(--radius-sm);
    box-shadow: var(--shadow-soft);
  }
  .react-datepicker__header {
    background-color: var(--sage-pale);
    border-bottom: 1px solid var(--sage-light);
    border-top-left-radius: var(--radius-sm);
    border-top-right-radius: var(--radius-sm);
  }
  .react-datepicker__current-month, .react-datepicker-time__header, .react-datepicker-year-header {
    color: var(--ink-mid);
    font-weight: 600;
  }
  .react-datepicker__day-name {
    color: var(--ink-soft);
  }
  .react-datepicker__day--selected, .react-datepicker__day--in-selecting-range, .react-datepicker__day--in-range, .react-datepicker__month-text--selected, .react-datepicker__month-text--in-selecting-range, .react-datepicker__month-text--in-range, .react-datepicker__quarter-text--selected, .react-datepicker__quarter-text--in-selecting-range, .react-datepicker__quarter-text--in-range, .react-datepicker__year-text--selected, .react-datepicker__year-text--in-selecting-range, .react-datepicker__year-text--in-range {
    background-color: var(--sage);
    color: var(--white);
  }
  .react-datepicker__day--keyboard-selected {
    background-color: var(--sage-light);
  }

  .book-slots-wrap {
    margin-top: 40px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .book-slots-label {
    font-size: 1.1rem;
    color: var(--ink-mid);
    font-weight: 600;
    margin-bottom: 20px;
  }

  .book-slots-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
    gap: 15px;
    width: 100%;
    max-width: 600px;
    justify-content: center;
  }

  .book-slot-btn {
    padding: 12px 16px;
    font-size: 0.95rem;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    background: var(--cream);
    border: 1.5px solid var(--sage-light);
    color: var(--ink-mid);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all 0.2s cubic-bezier(.22,1,.36,1);
  }
  .book-slot-btn:hover:not(:disabled) {
    background: var(--sage-pale);
    border-color: var(--sage);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(122,158,126,0.15);
  }
  .book-slot-btn.selected {
    background: var(--sage);
    color: var(--white);
    border-color: var(--sage);
    box-shadow: 0 4px 12px rgba(122,158,126,0.25);
  }
  .book-slot-btn:disabled {
    background: var(--cream-warm);
    border-color: var(--cream-warm);
    color: var(--ink-soft);
    text-decoration: line-through;
    opacity: 0.6;
    cursor: not-allowed;
  }

  .book-submit-btn {
    display: inline-block;
    text-align: center;
    font-family: 'DM Sans', sans-serif;
    font-size: 1.05rem;
    font-weight: 500;
    color: var(--white);
    background: linear-gradient(135deg, var(--sage) 0%, #5a8a5f 100%);
    border: none;
    padding: 18px 48px;
    border-radius: 100px;
    cursor: pointer;
    letter-spacing: 0.02em;
    text-decoration: none;
    transition: all 0.3s cubic-bezier(.22,1,.36,1);
    box-shadow: 0 4px 20px rgba(122,158,126,0.35);
    margin-top: 50px;
  }
  .book-submit-btn:hover:not(:disabled) {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 8px 32px rgba(122,158,126,0.45);
  }
  .book-submit-btn:disabled {
    background: var(--cream-warm);
    color: var(--ink-soft);
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }

  @keyframes fadeUp {
    to { opacity: 1; transform: translateY(0); }
  }
`;

function BookingPage() {
    const { id: counselorId } = useParams();
    const navigate = useNavigate();

    // State declarations
    const [counselor, setCounselor] = useState(null);
    const [availability, setAvailability] = useState({ workingHours: [], bookedSlots: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const styleRef = useRef(null);

    useEffect(() => {
        const el = document.createElement('style');
        el.textContent = CSS;
        document.head.appendChild(el);
        styleRef.current = el;
        return () => el.remove();
    }, []);

    // Fetch counsellor data on component mount
    useEffect(() => {
        const fetchCounselorData = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${API_BASE_URL}/api/counsellors/${counselorId}`, {
                    headers: { 'x-auth-token': token }
                });

                if (res.data && res.data.counsellor) {
                    setCounselor(res.data.counsellor);
                    setAvailability(res.data.availability);
                } else {
                    setError('Counsellor data could not be found.');
                }
            } catch (err) {
                setError(err.response?.data?.msg || 'Could not fetch counsellor details.');
                console.error("Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCounselorData();
    }, [counselorId]);

    // Generate time slots when a date is selected
    useEffect(() => {
        if (selectedDate && counselor) {
            const dayOfWeek = selectedDate.getDay();
            const formattedDate = formatDate(selectedDate);
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

                const slotString = formatTimeSlot(slotStart, slotEnd);
                const isBooked = availability.bookedSlots.some(booked => booked.date === formattedDate && booked.time === slotString);
                const isPast = isSlotInPast(slotEnd);

                slots.push({ time: slotString, isBooked, isPast });
            }
            setAvailableTimeSlots(slots);
            setSelectedTimeSlot(null);
        }
    }, [selectedDate, counselor, availability]);

    // Handle the booking submission
    const handleBooking = async () => {
        if (!selectedDate || !selectedTimeSlot) {
            alert('Please select both a date and a time slot.');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const bookingData = {
                counselorId,
                date: formatDate(selectedDate),
                time: selectedTimeSlot,
            };
            const res = await axios.post(`${API_BASE_URL}/api/appointments/student-book`, bookingData, {
                headers: { 'x-auth-token': token }
            });
            alert(res.data.msg);
            navigate('/student/dashboard');
        } catch (err) {
            alert(err.response?.data?.msg || 'Booking failed. Please try again.');
            console.error("Booking Error:", err);
        }
    };

    // Helper Functions
    const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    
    const formatTimeSlot = (start, end) => `${String(start.getHours()).padStart(2, '0')}:${String(start.getMinutes()).padStart(2, '0')}-${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}`;
    const isSlotInPast = (slotEnd) => new Date() > slotEnd;
    const filterAvailableDays = (date) => {
        const dayOfWeek = date.getDay();
        const hasWorkingHours = availability.workingHours.some(wh => wh.day === dayOfWeek);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return hasWorkingHours && date >= today;
    };

    // Conditional Rendering
    if (loading) {
        return (
            <div className="book-root" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div style={{fontFamily: "'Fraunces', serif", fontSize: '1.2rem', color: 'var(--ink-mid)', fontStyle: 'italic'}}>
                    Accessing booking system...
                </div>
            </div>
        );
    }

    if (error || !counselor) {
        return (
            <div className="book-root" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px'}}>
                <h2 style={{fontFamily: "'Fraunces', serif", color: 'var(--clay)'}}>{error || 'Counsellor not found.'}</h2>
                <Link to="/find-professional" className="book-submit-btn" style={{marginTop: '0'}}>Go Back</Link>
            </div>
        );
    }

    // Main Component Render
    return (
        <div className="book-root">
            <div className="book-wrap">
                <header className="book-header">
                    <span className="book-eyebrow">Booking Application</span>
                    <h1 className="book-title">Schedule with <em>{counselor.username}</em></h1>
                    <p className="book-subtitle">Specialization: {counselor.profile.specialization.join(' & ')}</p>
                </header>

                <div className="book-card">
                    <h3 className="book-section-title">Select Date and Time</h3>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <DatePicker
                            selected={selectedDate}
                            onChange={date => setSelectedDate(date)}
                            filterDate={filterAvailableDays}
                            inline
                            minDate={new Date()}
                        />
                    </div>

                    {selectedDate && (
                        <div className="book-slots-wrap">
                            <label className="book-slots-label">Available Slots for {formatDate(selectedDate)}:</label>
                            {availableTimeSlots.length > 0 ? (
                                <div className="book-slots-grid">
                                    {availableTimeSlots.map(slot => (
                                        <button
                                            key={slot.time}
                                            onClick={() => setSelectedTimeSlot(slot.time)}
                                            disabled={slot.isBooked || slot.isPast}
                                            className={`book-slot-btn ${(selectedTimeSlot === slot.time) ? 'selected' : ''} ${(slot.isBooked || slot.isPast) ? 'disabled' : ''}`}
                                        >
                                            {slot.time}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p style={{color: 'var(--ink-soft)', fontStyle: 'italic', marginTop: '10px'}}>No available slots for this date.</p>
                            )}
                        </div>
                    )}

                    <button
                        className="book-submit-btn"
                        onClick={handleBooking}
                        disabled={!selectedTimeSlot}
                    >
                        Confirm Booking
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BookingPage;