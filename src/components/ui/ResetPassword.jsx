import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faSignature, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { X } from 'lucide-react';
import Loader from './Loader';

const ResetPassword = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const loadingStates = [
    { text: 'Verifying email address...' },
    { text: 'Sending reset instructions...' },
    { text: 'Finalizing request...' },
    { text: 'Almost done...' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Test server connection first
      const testResponse = await fetch('http://localhost:5000/api/stats');
      if (!testResponse.ok) {
        throw new Error('Server connection failed');
      }

      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Simulate successful password reset request
      setIsSuccess(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Server error:', error);
      setError('Server connection failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setError('');
    setIsSuccess(false);
    setIsLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
      <Loader loading={isLoading}>{loadingStates}</Loader>

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-CloudbyzBlue/10 to-CloudbyzBlue/5 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-CloudbyzBlue/10 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faSignature} className="text-CloudbyzBlue text-lg" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Reset Password</h2>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors group"
            >
              <X className="w-4 h-4 text-red-600 group-hover:text-red-700" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {!isSuccess ? (
            <>
              <div className="text-center mb-6">
                <p className="text-gray-600 leading-relaxed">
                  Enter your email address and we'll send you instructions to reset your password.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 font-medium animate-pulse p-3 mb-4 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative group">
                  <div className="absolute top-1/2 transform -translate-y-1/2 z-10 left-3">
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="text-slate-400 group-focus-within:text-CloudbyzBlue transition-colors duration-200 text-sm"
                    />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="w-full border-2 border-slate-200 bg-white/80 backdrop-blur-sm focus:border-CloudbyzBlue focus:ring-4 focus:ring-CloudbyzBlue/10 outline-none transition-all duration-200 text-slate-700 placeholder-slate-400 pl-10 pr-4 py-3 rounded-lg text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-CloudbyzBlue to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden group py-3 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10">Send Reset Instructions</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-CloudbyzBlue opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={handleClose}
                  className="text-sm text-gray-600 hover:text-CloudbyzBlue transition-colors duration-200"
                >
                  Back to Sign In
                </button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Reset Instructions Sent!
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We've sent password reset instructions to <strong>{email}</strong>. 
                Please check your email and follow the link to reset your password.
              </p>
              <div className="space-y-3">
                <button
                  onClick={handleClose}
                  className="w-full bg-gradient-to-r from-CloudbyzBlue to-blue-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all duration-200"
                >
                  Back to Sign In
                </button>
                <p className="text-xs text-gray-500">
                  Didn't receive the email? Check your spam folder or try again.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;