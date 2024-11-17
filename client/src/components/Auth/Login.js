import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/status', {
          credentials: 'include',
        });
        const data = await response.json();
        if (data.isAuthenticated) {
          onLogin();
          navigate('/home');
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      }
    };

    checkAuthStatus();
  }, [onLogin, navigate]);

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">XENO CRM</h1>
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all font-medium text-lg"
        >
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
