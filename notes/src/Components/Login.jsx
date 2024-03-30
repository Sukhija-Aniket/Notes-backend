import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Alert, Container, Row, Col } from 'react-bootstrap';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ userName: '', password: '' });
  const [message, setMessage] = useState('');
  const { isAuthenticated, setIsAuthenticated, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prevCredentials => ({ ...prevCredentials, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/login', credentials, { withCredentials: true })
      .then(response => {
        if (response.data.success) {
          setIsAuthenticated(true);
          setUser(response.data.user);
          navigate('/');
        } else {
          setMessage('Login failed. Please check your username and password.');
        }
      })
      .catch(error => {
        setMessage('An error occurred. Please try again later.');
        console.error('Login error:', error);
      });
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <Row>
        <Col md={10} className="mx-auto">
          <h1 className="text-center">Login</h1>
          {message && <Alert variant="danger">{message}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={4} htmlFor="userName">UserName:</Form.Label>
              <Col sm={8}>
                <Form.Control
                  type="text"
                  id="userName"
                  name="userName"
                  required
                  value={credentials.userName}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={4} htmlFor="password">Password:</Form.Label>
              <Col sm={8}>
                <Form.Control
                  type="password"
                  id="password"
                  name="password"
                  required
                  value={credentials.password}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
            <div className="d-grid">
              <Button variant="primary" type="submit">Login</Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
