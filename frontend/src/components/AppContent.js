import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ReactGA from 'react-ga4';

// Import Pages
import HomePage from '../pages/HomePage';
import RegisterPage from '../pages/RegisterPage';
import LoginPage from '../pages/LoginPage';
import StudentDashboard from '../pages/StudentDashboard';
import CounsellorDashboard from '../pages/CounsellorDashboard';
import AssessmentPage from '../pages/AssessmentPage';
import FindProfessionalPage from '../pages/FindProfessionalPage';
import PrivacyConsentPage from '../pages/PrivacyConsentPage';
import AssessmentReportPage from '../pages/AssessmentReportPage';
import BookingPage from '../pages/BookingPage';
import SessionHistoryPage from '../pages/SessionHistoryPage';
import ManageProfilePage from '../pages/ManageProfilePage';
import ManageAvailabilityPage from '../pages/ManageAvailabilityPage';
import ViewStudentAppointmentRequestsPage from '../pages/ViewStudentAppointmentRequestsPage';
import UploadResourcesPage from '../pages/UploadResourcesPage';
import StudentProfilePage from '../pages/StudentProfilePage';
import DassHistoryPage from '../pages/DassHistoryPage';
import ViewAllDassReportsPage from '../pages/ViewAllDassReportsPage';
import PrivateRoute from './PrivateRoute';
import ConcernPage from '../pages/ConcernPage';

function AppContent() {
  const { isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Track pageviews dynamically
  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: location.pathname + location.search });
  }, [location]);

  // Refined useEffect for Navigation Logic
  useEffect(() => {
    if (!loading) {
      const currentPath = window.location.pathname;
      if (isAuthenticated) {
        const hasConsent = localStorage.getItem('hasConsent') === 'true';
        const hasCompletedAssessment = localStorage.getItem('hasCompletedAssessment') === 'true';
        if (user.role === 'student') {
          if (!hasConsent && currentPath !== '/privacy-consent') {
            navigate('/privacy-consent', { replace: true });
          } else if (hasConsent && !hasCompletedAssessment && currentPath !== '/assessment') {
            navigate('/assessment', { replace: true });
          } else if (hasConsent && hasCompletedAssessment) {
            const publicOrUnauthorizedPaths = ['/', '/login', '/register', '/unauthorized'];
            if (publicOrUnauthorizedPaths.includes(currentPath)) {
              navigate('/student/dashboard', { replace: true });
            }
          }
        } else if (user.role === 'counsellor') {
          const publicOrUnauthorizedPaths = ['/', '/login', '/register', '/unauthorized'];
          if (publicOrUnauthorizedPaths.includes(currentPath)) {
            navigate('/counsellor/dashboard', { replace: true });
          }
        }
      } else { // Not Authenticated
        const publicOrUnauthorizedPaths = ['/', '/login', '/register', '/unauthorized', '/concern/:topic'];
        // Check if the current path is NOT a public path (including dynamic concern pages)
        if (!publicOrUnauthorizedPaths.some(path => new RegExp(`^${path.replace(/:[^\s/]+/g, '([\\w-]+)')}$`).test(currentPath))) {
          navigate('/login', { replace: true });
        }
      }
    }
  }, [isAuthenticated, user, loading, navigate]);

  if (loading) {
    return <div style={{textAlign: 'center', padding: '50px', color: 'var(--color-text-medium)'}}>Loading application...</div>;
  }

  return (
    <main style={{ flexGrow: 1 }}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/concern/:topic" element={<ConcernPage />} />

        {/* Protected Routes - Student Flow */}
        <Route path="/privacy-consent" element={<PrivateRoute allowedRoles={['student']} />}>
          <Route index element={<PrivacyConsentPage />} />
        </Route>
        <Route path="/assessment" element={<PrivateRoute allowedRoles={['student']} />}>
          <Route index element={<AssessmentPage />} />
        </Route>
        <Route path="/assessment-report" element={<PrivateRoute allowedRoles={['student']} />}>
          <Route index element={<AssessmentReportPage />} />
        </Route>
        <Route path="/find-professional" element={<PrivateRoute allowedRoles={['student']} />}>
          <Route index element={<FindProfessionalPage />} />
        </Route>
        <Route path="/book-appointment/:id" element={<PrivateRoute allowedRoles={['student']} />}>
          <Route index element={<BookingPage />} />
        </Route>
        <Route path="/session-history" element={<PrivateRoute allowedRoles={['student', 'counsellor']} />}>
          <Route index element={<SessionHistoryPage />} />
        </Route>
        <Route path="/manage-profile" element={<PrivateRoute allowedRoles={['student', 'counsellor']} />}>
          <Route index element={<ManageProfilePage />} />
        </Route>
        <Route path="/student/dashboard" element={<PrivateRoute allowedRoles={['student']} />}>
          <Route index element={<StudentDashboard />} />
        </Route>

        {/* Protected Routes - Counsellor Flow */}
        <Route path="/counsellor/dashboard" element={<PrivateRoute allowedRoles={['counsellor']} />}>
          <Route index element={<CounsellorDashboard />} />
        </Route>
        <Route path="/counsellor/manage-availability" element={<PrivateRoute allowedRoles={['counsellor']} />}>
          <Route index element={<ManageAvailabilityPage />} />
        </Route>
        <Route path="/counsellor/students" element={<PrivateRoute allowedRoles={['counsellor']} />}> 
          <Route index element={<ViewStudentAppointmentRequestsPage />} />
        </Route>
        <Route path="/counsellor/student-profile/:id" element={<PrivateRoute allowedRoles={['counsellor']} />}>
          <Route index element={<StudentProfilePage />} />
        </Route>
        <Route path="/counsellor/student-dass-history/:studentId" element={<PrivateRoute allowedRoles={['counsellor']} />}>
          <Route index element={<DassHistoryPage />} />
        </Route>
        <Route path="/counsellor/all-dass-reports" element={<PrivateRoute allowedRoles={['counsellor']} />}>
          <Route index element={<ViewAllDassReportsPage />} />
        </Route>
        <Route path="/counsellor/upload-resources" element={<PrivateRoute allowedRoles={['counsellor']} />}>
          <Route index element={<UploadResourcesPage />} />
        </Route>

        {/* Catch-all for unknown routes */}
        <Route path="*" element={<div className="card-panel text-center"><h2>404 - Page Not Found</h2><p>The page you are looking for does not exist.</p><Link to="/">Go Home</Link></div>} />
      </Routes>
    </main>
  );
}

export default AppContent;