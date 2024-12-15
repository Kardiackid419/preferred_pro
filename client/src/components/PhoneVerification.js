import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { sendPhoneVerification, verifyPhoneCode } from '../firebase/auth';

function PhoneVerification({ phoneNumber, onVerificationComplete }) {
  const [step, setStep] = useState('send'); // 'send' or 'verify'
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialize reCAPTCHA when component mounts
    initializeRecaptcha();
  }, []);

  const handleSendCode = async () => {
    try {
      setError('');
      setLoading(true);
      await sendPhoneVerification(phoneNumber);
      setStep('verify');
    } catch (error) {
      setError('Failed to send verification code: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await verifyPhoneCode(verificationCode);
      onVerificationComplete();
    } catch (error) {
      setError('Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Verify Your Phone Number</h2>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded">
          {error}
        </div>
      )}

      {step === 'send' ? (
        <div>
          <p className="text-gray-600 mb-4">
            Click below to receive a verification code at {phoneNumber}
          </p>
          <div id="recaptcha-container" className="mb-4"></div>
          <button
            onClick={handleSendCode}
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? 'Sending...' : 'Send Verification Code'}
          </button>
        </div>
      ) : (
        <form onSubmit={handleVerifyCode} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Verification Code
            </label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter 6-digit code"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? 'Verifying...' : 'Verify Code'}
          </button>
        </form>
      )}
    </div>
  );
}

export default PhoneVerification; 