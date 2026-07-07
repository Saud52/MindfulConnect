import React from 'react';
import { Link } from 'react-router-dom';

function ProfessionalCard({ professional }) {
  const { id, name, specialization, bio, rating, experience } = professional;
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className="prof-card">
      <style>{`
        .prof-card {
          background: var(--white);
          border-radius: var(--radius);
          padding: 40px;
          box-shadow: var(--shadow-soft);
          border: 1px solid rgba(122,158,126,0.1);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          transition: box-shadow 0.3s ease, transform 0.3s ease, border-color 0.3s ease;
          max-width: 450px;
          width: 100%;
        }
        .prof-card:hover {
          box-shadow: var(--shadow-mid);
          transform: translateY(-4px);
          border-color: rgba(122,158,126,0.22);
        }
        .prof-avatar {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          background: var(--sage-pale);
          color: var(--sage);
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: 'Fraunces', serif;
          font-size: 2.2rem;
          font-weight: 300;
          margin-bottom: 20px;
          border: 2px solid rgba(122,158,126,0.2);
        }
        .prof-name {
          font-family: 'Fraunces', serif;
          font-size: 1.8rem;
          color: var(--ink-mid);
          margin-bottom: 6px;
          font-weight: 400;
        }
        .prof-spec {
          font-size: 0.85rem;
          font-weight: 500;
          letter-spacing: 0.05em;
          color: var(--sage);
          text-transform: uppercase;
          margin-bottom: 20px;
        }
        .prof-bio {
          font-size: 0.95rem;
          color: var(--ink-soft);
          line-height: 1.6;
          margin-bottom: 30px;
        }
        .prof-stats {
          display: flex;
          gap: 20px;
          margin-bottom: 30px;
          width: 100%;
          justify-content: center;
        }
        .prof-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        .prof-stat-val {
          font-family: 'Fraunces', serif;
          font-size: 1.2rem;
          color: var(--ink-mid);
        }
        .prof-stat-label {
          font-size: 0.75rem;
          color: var(--ink-soft);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .prof-btn {
          display: inline-block;
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
          width: 100%;
        }
        .prof-btn:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 8px 32px rgba(122,158,126,0.45);
          color: var(--white);
        }
      `}</style>
      
      <div className="prof-avatar">
        {initials}
      </div>
      <h3 className="prof-name">{name}</h3>
      <p className="prof-spec">{specialization.join(' & ')}</p>
      <p className="prof-bio">{bio}</p>
      
      <div className="prof-stats">
        <div className="prof-stat">
          <span className="prof-stat-val">⭐ {rating}</span>
          <span className="prof-stat-label">Rating</span>
        </div>
        <div className="prof-stat">
          <span className="prof-stat-val">{experience.split(' ')[0]}</span>
          <span className="prof-stat-label">Experience</span>
        </div>
      </div>
      
      <Link to={`/book-appointment/${id}`} className="prof-btn">Book Appointment</Link>
    </div>
  );
}

export default ProfessionalCard;