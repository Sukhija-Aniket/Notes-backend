import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/isAuthenticated', { withCredentials: true })
      .then(response => {
        if (response.data.authenticated) {
          setIsAuthenticated(response.data.authenticated);
          setUser(response.data.user);
          Cookies.remove('connect.sid');
        }
      })
      .catch(error => console.error('Authentication check failed', error));
  }, []);

  const logout = async () => {
    try {
      const response = await fetch('http://localhost:8000/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        setIsAuthenticated(false);
        setUser(false);
        console.info("Successfully Logged Out!");
      } else {
        console.error('Failed to clear session Cookie!');
      }
    } catch (err) {
      console.error('Error Clearing session Cookie: ',  err);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, setIsAuthenticated, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
