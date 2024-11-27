import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import LoadingBar from '../components/LoadingBar';

const logo = "/images/preferred_logo.png";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  const validateForm = () => {
    const newErrors = {
      email: '',
      password: ''
    };
    
    if (!credentials.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!credentials.password) {
      newErrors.password = 'Password is required';
    } else if (credentials.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        await login(credentials.email, credentials.password);
        navigate('/schedule');
      } catch (error) {
        setErrors({
          email: 'Invalid email or password',
          password: 'Invalid email or password'
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-preferred-green">
        <LoadingBar />
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-preferred-green">
      <div className="w-96 p-6 bg-white rounded shadow-lg">
        <div className="mb-4 flex justify-center">
          <img
            className="w-auto h-20 object-contain"
            src={logo}
            alt="Preferred Pro"
          />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              type="email"
              required
              placeholder="Email address"
              value={credentials.email}
              onChange={(e) => setCredentials({...credentials, email: e.target.value})}
              error={errors.email}
            />
          </div>
          <div className="mb-4">
            <Input
              type="password"
              required
              placeholder="Password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              error={errors.password}
            />
          </div>
          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={credentials.rememberMe}
                onChange={(e) => setCredentials({...credentials, rememberMe: e.target.checked})}
              />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
            <a href="/signup" className="text-sm text-preferred-green hover:text-preferred-green/90">
              Sign up
            </a>
          </div>
          <button
            type="submit"
            className="w-full bg-preferred-green text-white p-2 rounded hover:bg-preferred-green/90"
          >
            Sign in
          </button>
        </form>
      </div>
      <div className="mt-4 text-white text-sm opacity-80">
        © {new Date().getFullYear()} Preferred LLC. All rights reserved.
      </div>
    </div>
  );
}

export default Login;