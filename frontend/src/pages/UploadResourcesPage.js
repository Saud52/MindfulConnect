import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function UploadResourcesPage() {
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceType, setResourceType] = useState('Article');
  const [resourceLink, setResourceLink] = useState('');
  const [resourceDescription, setResourceDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Resource Upload (Simulated):", {
      resourceTitle,
      resourceType,
      resourceLink,
      resourceDescription,
    });
    alert('Resource uploaded! (Simulated - data logged to console)');
    // In a real app, you'd send this data to your backend
    // After successful upload, clear form or redirect
    setResourceTitle('');
    setResourceType('Article');
    setResourceLink('');
    setResourceDescription('');
  };

  return (
    <div className="card-panel text-center" style={styles.container}>
      <h2 style={styles.heading}>Upload Resources</h2>
      <p style={styles.paragraph}>Share helpful articles, videos, or exercises with students.</p>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="resourceTitle">Resource Title:</label>
          <input type="text" id="resourceTitle" value={resourceTitle} onChange={(e) => setResourceTitle(e.target.value)} required />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="resourceType">Resource Type:</label>
          <select id="resourceType" value={resourceType} onChange={(e) => setResourceType(e.target.value)}>
            <option value="Article">Article</option>
            <option value="Video">Video</option>
            <option value="Exercise">Exercise</option>
            <option value="Infographic">Infographic</option>
          </select>
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="resourceLink">Link (URL):</label>
          <input type="url" id="resourceLink" value={resourceLink} onChange={(e) => setResourceLink(e.target.value)} required />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="resourceDescription">Description:</label>
          <textarea id="resourceDescription" value={resourceDescription} onChange={(e) => setResourceDescription(e.target.value)} rows="4"></textarea>
        </div>
        <button type="submit" className="button button-accent">Upload Resource</button>
      </form>
      <Link to="/counsellor/dashboard" className="button-secondary" style={styles.backButton}>Back to Dashboard</Link>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    padding: '60px',
  },
  heading: {
    color: 'var(--color-primary-dark)',
    marginBottom: '30px',
    fontSize: '2.6em',
  },
  paragraph: {
    color: 'var(--color-text-medium)',
    marginBottom: '40px',
    fontSize: '1.1em',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '25px',
    textAlign: 'left',
  },
  formGroup: {
    marginBottom: '0', // Adjust margin within form groups
  },
  backButton: {
    marginTop: '40px',
  }
};

export default UploadResourcesPage;