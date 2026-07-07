import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
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

  .prof-root {
    min-height: 100vh;
    background: var(--cream);
    font-family: 'DM Sans', sans-serif;
    position: relative;
    overflow-x: hidden;
  }

  .prof-root::before,
  .prof-root::after {
    content: '';
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
  }
  .prof-root::before {
    width: 700px; height: 700px;
    background: radial-gradient(circle, rgba(122,158,126,0.13) 0%, transparent 70%);
    top: -200px; right: -200px;
    animation: blobFloat1 18s ease-in-out infinite;
  }
  .prof-root::after {
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

  .prof-wrap {
    position: relative;
    z-index: 1;
    max-width: 800px;
    margin: 0 auto;
    padding: 60px 24px 100px;
  }

  .prof-header {
    text-align: center;
    margin-bottom: 50px;
    opacity: 0;
    transform: translateY(28px);
    animation: fadeUp 0.9s cubic-bezier(.22,1,.36,1) 0.1s forwards;
  }

  .prof-eyebrow {
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

  .prof-title {
    font-family: 'Fraunces', Georgia, serif;
    font-size: clamp(2.2rem, 5vw, 3.4rem);
    font-weight: 300;
    color: var(--ink);
    line-height: 1.15;
    margin: 0 0 15px;
    letter-spacing: -0.02em;
  }

  .prof-title em {
    font-style: italic;
    color: var(--sage);
  }

  .prof-content {
    opacity: 0;
    animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) 0.35s forwards;
  }

  .prof-form {
    display: flex;
    flex-direction: column;
    gap: 30px;
  }

  .prof-section {
    background: var(--white);
    border-radius: var(--radius);
    padding: 40px;
    box-shadow: var(--shadow-soft);
    border: 1px solid rgba(122,158,126,0.1);
  }

  .prof-section-heading {
    font-family: 'Fraunces', serif;
    font-size: 1.8rem;
    color: var(--ink-mid);
    margin-bottom: 30px;
    font-weight: 400;
    text-align: center;
  }

  .prof-group {
    margin-bottom: 25px;
    display: flex;
    flex-direction: column;
  }

  .prof-label {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--ink-soft);
    margin-bottom: 8px;
    font-family: 'DM Sans', sans-serif;
  }

  .prof-input {
    width: 100%;
    background: var(--cream);
    border: 1.5px solid var(--cream-warm);
    border-radius: var(--radius-sm);
    padding: 14px 18px;
    font-family: 'DM Sans', sans-serif;
    color: var(--ink-mid);
    font-size: 1rem;
    transition: all 0.2s ease;
  }

  .prof-input:focus {
    outline: none;
    border-color: var(--sage);
    background: var(--white);
    box-shadow: 0 0 0 4px rgba(122,158,126,0.1);
  }

  .prof-input:disabled {
    background: var(--sage-pale);
    color: var(--ink-soft);
    border-color: var(--sage-pale);
    cursor: not-allowed;
  }
  
  textarea.prof-input {
    resize: vertical;
  }

  .prof-btn {
    display: block;
    width: 100%;
    text-align: center;
    font-family: 'DM Sans', sans-serif;
    font-size: 1.1rem;
    font-weight: 500;
    color: var(--white);
    background: linear-gradient(135deg, var(--sage) 0%, #5a8a5f 100%);
    border: none;
    padding: 18px 32px;
    border-radius: 100px;
    cursor: pointer;
    letter-spacing: 0.02em;
    text-decoration: none;
    transition: all 0.3s cubic-bezier(.22,1,.36,1);
    box-shadow: 0 4px 20px rgba(122,158,126,0.35);
    margin-top: 20px;
  }

  .prof-btn:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 8px 32px rgba(122,158,126,0.45);
    color: var(--white);
  }

  .prof-back-link {
    display: inline-block;
    text-align: center;
    font-family: 'DM Sans', sans-serif;
    font-size: 1rem;
    font-weight: 500;
    color: var(--ink-mid);
    background: transparent;
    border: 1.5px solid var(--sage);
    padding: 14px 32px;
    border-radius: 100px;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.3s;
    margin-top: 30px;
  }

  .prof-back-link:hover {
    background: var(--sage-pale);
    color: var(--ink);
    transform: translateY(-2px);
  }

  @keyframes fadeUp {
    to { opacity: 1; transform: translateY(0); }
  }
`;

function ManageProfilePage() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    fullName: '',
    contact: '',
    roleSpecific: {}
  });
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
    const fetchProfile = async () => {
      if (user) {
        try {
          const token = localStorage.getItem('token');
          const res = await axios.get(`${API_BASE_URL}/api/auth/profile`, {
            headers: { 'x-auth-token': token }
          });
          
          const { username, email, profile } = res.data;
          
          const mainProfile = {
            username,
            email,
            fullName: profile.fullName || '',
            contact: profile.contact || ''
          };

          const roleSpecific = user.role === 'student' ? {
            studentId: profile.studentId || '',
            grade: profile.grade || '',
            school: profile.school || ''
          } : {
            rciId: profile.rciId || '',
            specialization: profile.specialization || '',
            qualifications: profile.qualifications || '',
            yearsOfExperience: profile.yearsOfExperience || 0,
            bio: profile.bio || ''
          };

          setProfileData({ ...mainProfile, roleSpecific });

        } catch (err) {
            console.error("Failed to fetch profile", err);
            alert("Could not load your profile data.");
        } finally {
            setLoading(false);
        }
      }
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('roleSpecific.')) {
      const field = name.split('.')[1];
      setProfileData(prev => ({ ...prev, roleSpecific: { ...prev.roleSpecific, [field]: value }}));
    } else {
      setProfileData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const token = localStorage.getItem('token');
        const dataToSave = {
            fullName: profileData.fullName,
            contact: profileData.contact,
            roleSpecific: profileData.roleSpecific
        };
        await axios.put(`${API_BASE_URL}/api/auth/profile`, dataToSave, {
            headers: { 'x-auth-token': token }
        });
        alert("Profile updated successfully!");
    } catch (err) {
        console.error("Failed to update profile", err);
        alert("Profile update failed.");
    }
  };

  if (loading) {
    return (
      <div className="prof-root" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{fontFamily: "'Fraunces', serif", fontSize: '1.2rem', color: 'var(--ink-mid)', fontStyle: 'italic'}}>
          Loading profile...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="prof-root" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px'}}>
        <h2 style={{fontFamily: "'Fraunces', serif", color: 'var(--clay)'}}>Access Denied</h2>
        <p style={{color: 'var(--ink-soft)'}}>Please log in to view your profile.</p>
        <Link to="/login" className="prof-btn" style={{width: 'auto'}}>Login</Link>
      </div>
    );
  }

  return (
    <div className="prof-root">
      <div className="prof-wrap">
        <header className="prof-header">
          <span className="prof-eyebrow">Settings</span>
          <h1 className="prof-title">Manage Your <em>Profile</em></h1>
        </header>

        <div className="prof-content">
          <form onSubmit={handleSubmit} className="prof-form">
            <div className="prof-section">
              <h3 className="prof-section-heading">Personal Information</h3>
              <div className="prof-group">
                <label className="prof-label" htmlFor="username">Username</label>
                <input className="prof-input" type="text" id="username" name="username" value={profileData.username} disabled />
              </div>
              <div className="prof-group">
                <label className="prof-label" htmlFor="email">Email</label>
                <input className="prof-input" type="email" id="email" name="email" value={profileData.email} disabled />
              </div>
              <div className="prof-group">
                <label className="prof-label" htmlFor="fullName">Full Name</label>
                <input className="prof-input" type="text" id="fullName" name="fullName" value={profileData.fullName} onChange={handleChange} />
              </div>
              <div className="prof-group">
                <label className="prof-label" htmlFor="contact">Contact Number</label>
                <input className="prof-input" type="text" id="contact" name="contact" value={profileData.contact} onChange={handleChange} />
              </div>
            </div>

            {user.role === 'student' && (
              <div className="prof-section">
                <h3 className="prof-section-heading">Student Details</h3>
                <div className="prof-group">
                  <label className="prof-label" htmlFor="studentId">Student ID</label>
                  <input className="prof-input" type="text" id="studentId" name="roleSpecific.studentId" value={profileData.roleSpecific.studentId || ''} onChange={handleChange} />
                </div>
                <div className="prof-group">
                  <label className="prof-label" htmlFor="grade">Grade/Year</label>
                  <input className="prof-input" type="text" id="grade" name="roleSpecific.grade" value={profileData.roleSpecific.grade || ''} onChange={handleChange} />
                </div>
                <div className="prof-group">
                  <label className="prof-label" htmlFor="school">School/University</label>
                  <input className="prof-input" type="text" id="school" name="roleSpecific.school" value={profileData.roleSpecific.school || ''} onChange={handleChange} />
                </div>
              </div>
            )}

            {user.role === 'counsellor' && (
              <div className="prof-section">
                <h3 className="prof-section-heading">Counsellor Details</h3>
                <div className="prof-group">
                  <label className="prof-label" htmlFor="rciId">RCI ID</label>
                  <input className="prof-input" type="text" id="rciId" name="roleSpecific.rciId" value={profileData.roleSpecific.rciId || ''} onChange={handleChange} disabled />
                </div>
                <div className="prof-group">
                  <label className="prof-label" htmlFor="specialization">Specialization (comma-separated)</label>
                  <textarea className="prof-input" id="specialization" name="roleSpecific.specialization" value={profileData.roleSpecific.specialization || ''} onChange={handleChange} rows="2"></textarea>
                </div>
                <div className="prof-group">
                  <label className="prof-label" htmlFor="qualifications">Qualifications (comma-separated)</label>
                  <textarea className="prof-input" id="qualifications" name="roleSpecific.qualifications" value={profileData.roleSpecific.qualifications || ''} onChange={handleChange} rows="3"></textarea>
                </div>
                <div className="prof-group">
                  <label className="prof-label" htmlFor="yearsOfExperience">Years of Experience</label>
                  <input className="prof-input" type="number" id="yearsOfExperience" name="roleSpecific.yearsOfExperience" value={profileData.roleSpecific.yearsOfExperience || ''} onChange={handleChange} />
                </div>
                <div className="prof-group">
                  <label className="prof-label" htmlFor="bio">Bio</label>
                  <textarea className="prof-input" id="bio" name="roleSpecific.bio" value={profileData.roleSpecific.bio || ''} onChange={handleChange} rows="5"></textarea>
                </div>
              </div>
            )}

            <button type="submit" className="prof-btn">Save Changes</button>
          </form>
          <div style={{textAlign: 'center'}}>
            <Link to={`/${user.role}/dashboard`} className="prof-back-link">Back to Dashboard</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageProfilePage;