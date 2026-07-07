import React, { useEffect } from 'react';

const MessageBox = ({ message, type = 'info', onClose, autoHide = true, duration = 4000 }) => {
  // Auto hide after X seconds
  useEffect(() => {
    if (message && autoHide) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, autoHide, duration, onClose]);

  if (!message) return null;

  const styles = {
    base: {
      marginBottom: '20px',
      padding: '14px 20px',
      borderRadius: '12px',
      fontFamily: "'DM Sans', sans-serif",
      fontWeight: '500',
      textAlign: 'center',
      border: '1.5px solid',
      boxShadow: '0 4px 15px rgba(26,31,27,0.05)',
      animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    },
    success: {
      backgroundColor: '#e8f0e9',
      color: '#3d4a3f',
      borderColor: '#a8c5ac',
    },
    error: {
      backgroundColor: '#f6ebe7',
      color: '#c4775a',
      borderColor: '#e8a98c',
    },
    info: {
      backgroundColor: '#f7f4ef',
      color: '#6b7c6d',
      borderColor: '#ede9e0',
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes popIn {
            0% { opacity: 0; transform: scale(0.95) translateY(-10px); }
            100% { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}
      </style>
      <div style={{ ...styles.base, ...styles[type] }}>
        {message}
      </div>
    </>
  );
};

export default MessageBox;
