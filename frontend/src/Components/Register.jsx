import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from './AuthContext';
import { Button, Form, Alert, Container, Row, Col } from 'react-bootstrap';
import '../App.css'
import 'bootstrap/dist/css/bootstrap.min.css';

const Register = () => {
  const [credentials, setCredentials] = useState({ userName: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) navigate('/')
},[isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prevCredentials => ({ ...prevCredentials, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/register', credentials, {withCredentials: true})
      .then(response => {
        if (response.data.success) {
          setMessage('Registration successful. You can now log in.');
          navigate('/login')
        } else {
          setMessage('Registration failed. Please try again.');
        }
      })
      .catch(error => {
        setMessage('An error occurred. Please try again later.');
        console.error('Registration error:', error);
      });
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <Row>
        <Col md={10} className="mx-auto">
          <h1 className="text-center">Register</h1>
          {message && <Alert variant="danger">{message}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group as={Row} className="mb-3" controlId="userName">
              <Form.Label column sm={4}>
                UserName:
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  type="text"
                  name="userName"
                  required
                  value={credentials.userName}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="password">
              <Form.Label column sm={4}>
                Password:
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  type="password"
                  name="password"
                  required
                  value={credentials.password}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
            <div className="d-grid">
              <Button variant="primary" type="submit">Register</Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;

