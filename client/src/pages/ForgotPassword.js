import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { resetPassword } from '../firebase/auth';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setMessage('');
      setLoading(true);
      await resetPassword(email);
      setMessage('Check your email for password reset instructions');
    } catch (error) {
      setError('Failed to reset password: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-preferred-green py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <div>
          <img
            className="mx-auto h-24 w-auto"
            src="/images/preferred_logo.png"
            alt="Preferred Pro"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset Password
          </h2>
        </div>
        
        {message && (
          <div className="rounded-md bg-green-50 p-4">
            <div className="text-sm text-green-700">{message}</div>
          </div>
        )}
        
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                type="email"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-preferred-green focus:border-preferred-green focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-preferred-green hover:bg-preferred-green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-preferred-green"
            >
              {loading ? 'Sending...' : 'Reset Password'}
            </button>
          </div>

          <div className="text-sm text-center">
            <Link 
              to="/login" 
              className="text-preferred-green hover:text-preferred-green/90"
            >
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword; 