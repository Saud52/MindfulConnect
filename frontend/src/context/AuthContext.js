import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the Auth Context
const AuthContext = createContext(null);

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // Stores user details like { id, role, username }
  const [loading, setLoading] = useState(true); // To check initial auth status

  // Effect to check for token in localStorage on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');

    if (token && userRole && userId && username) {
      // In a real app, you'd verify the token with the backend here
      setIsAuthenticated(true);
      // Keep the user object structure consistent with login function
      setUser({
        id: userId,
        userId: userId,  // Include both id and userId for compatibility
        role: userRole,
        username: username,
        name: username   // Include both username and name for compatibility
      });
    }
    setLoading(false);
  }, []);

  // Login function (will be called from LoginPage)
  const login = (token, userRole, userId, username) => {
    // Set localStorage items once
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', userRole);
    localStorage.setItem('userId', userId);
    localStorage.setItem('username', username);
    
    setIsAuthenticated(true);
    // Include all necessary fields in the user object
    setUser({
      id: userId,
      userId: userId,  // Include both id and userId for compatibility
      role: userRole,
      username: username,
      name: username   // Include both username and name for compatibility
    });
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use Auth Context
export const useAuth = () => {
  return useContext(AuthContext);
};