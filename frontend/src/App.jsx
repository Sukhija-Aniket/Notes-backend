import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthContext from './Components/AuthContext';
import LandingPage from './Components/LandingPage';
import Login from './Components/Login';
import Register from './Components/Register';
import NotesIndex from './Components/NotesIndex'; // This is your main page for authenticated users
import NotFound from './Components/NotFound';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Router>
        <Routes>
        {isAuthenticated ? (
          <Route path="/" element={<NotesIndex/>} />
        ) : (
          <>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register/>} />
          </>
        )}
        <Route path="*" element={<NotFound/>} />
        </Routes>
    </Router>
  );
};

export default App;
