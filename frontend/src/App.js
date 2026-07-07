import React from 'react';
import { BrowserRouter } from 'react-router-dom'; // Only BrowserRouter here
import './App.css';

// Import Components
import Navbar from './components/Navbar';
import AppContent from './components/AppContent'; // Import the new AppContent component

// You no longer need to import all pages here, AppContent handles it
// import HomePage from './pages/HomePage';
// import RegisterPage from './pages/RegisterPage';
// import LoginPage from './pages/LoginPage';
// import StudentDashboard from './pages/StudentDashboard';
// import CounsellorDashboard from './pages/CounsellorDashboard';
// import AssessmentPage from './pages/AssessmentPage';
// import FindProfessionalPage from './pages/FindProfessionalPage';
// import PrivacyConsentPage from './pages/PrivacyConsentPage';

function App() {
  // The authentication context (useAuth) needs to be available to AppContent
  // but App itself does not use useNavigate directly here anymore.
  // The loading state from useAuth still makes sense to check here if you want
  // a global loading screen before any routing logic kicks in.

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <AppContent /> {/* Render the new AppContent component here */}
        {/* Optional: Add a Footer component here later */}
      </div>
    </BrowserRouter>
  );
}

export default App;