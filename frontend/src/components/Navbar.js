import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth(); // Destructure 'user' to get role

  return (
    <nav style={styles.navbar} className="navbar-container">
      <div style={styles.logo} className="logo-container">
        <Link to="/" style={styles.logoLink}>MindfulConnect</Link>
      </div>
      <ul style={styles.navList} className="nav-list-container">
        {isAuthenticated ? (
          <>
            {/* Conditional Dashboard link based on user role */}
            {user && user.role === 'student' && (
              <li style={styles.navItem}>
                <Link to="/student/dashboard" style={styles.navLink}>Dashboard</Link>
              </li>
            )}
            {user && user.role === 'counsellor' && (
              <li style={styles.navItem}>
                <Link to="/counsellor/dashboard" style={styles.navLink}>Dashboard</Link>
              </li>
            )}
            <li style={styles.navItem}>
              <button onClick={logout} className="button-secondary">Logout</button>
            </li>
          </>
        ) : (
          <>
            <li style={styles.navItem}>
              <Link to="/login" style={styles.navLink}>Login</Link>
            </li>
            <li style={styles.navItem}>
              <Link to="/register" style={styles.navLink}>Register</Link>
            </li>
          </>
        )}
      </ul>
      <style>
        {`
          @media (max-width: 768px) {
            .navbar-container {
              flex-direction: column !important;
              padding: 15px 20px !important;
              gap: 15px !important;
              text-align: center !important;
            }
            .nav-list-container {
              gap: 15px !important;
              flex-wrap: wrap !important;
              justify-content: center !important;
            }
            .logo-container {
              font-size: 1.8em !important;
            }
          }
        `}
      </style>
    </nav>
  );
}

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 5%',
    backgroundColor: 'var(--color-background-white)',
    boxShadow: '0 4px 20px var(--color-shadow-subtle)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  logo: {
    fontSize: '2.2em',
    fontWeight: '800',
  },
  logoLink: {
    color: 'var(--color-primary-dark)',
    textDecoration: 'none',
  },
  navList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    gap: '35px',
  },
  navItem: {
    //
  },
  navLink: {
    color: 'var(--color-text-dark)',
    textDecoration: 'none',
    fontSize: '1.05em',
    fontWeight: '600',
    padding: '5px 10px',
    transition: 'color 0.3s ease, text-decoration 0.3s ease',
  },
};

export default Navbar;

