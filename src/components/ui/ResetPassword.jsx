import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faSignature, faCheckCircle, faLock, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Loader from './Loader';

const ResetPassword = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: Code & Password
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Refs for code input boxes
  const codeRefs = useRef([]);

  const loadingStates = [
    { text: 'Verifying email address...' },
    { text: 'Sending reset instructions...' },
    { text: 'Finalizing request...' },
    { text: 'Almost done...' }
  ];

  const resetLoadingStates = [
    { text: 'Verifying code...' },
    { text: 'Updating password...' },
    { text: 'Securing account...' },
    { text: 'Redirecting to dashboard...' }
  ];

  useEffect(() => {
    // Focus first code input when step 2 is reached
    if (step === 2 && codeRefs.current[0]) {
      codeRefs.current[0].focus();
    }
  }, [step]);

  const handleEmailSubmit = async (e) => {
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

      // Move to step 2
      setStep(2);
      setIsLoading(false);
    } catch (error) {
      console.error('Server error:', error);
      setError('Server connection failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleCodeChange = (index, value) => {
    // Only allow numeric input
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      codeRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      codeRefs.current[index - 1]?.focus();
    }
    // Handle arrow keys
    else if (e.key === 'ArrowLeft' && index > 0) {
      codeRefs.current[index - 1]?.focus();
    }
    else if (e.key === 'ArrowRight' && index < 5) {
      codeRefs.current[index + 1]?.focus();
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const codeString = code.join('');
    if (codeString.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    if (!newPassword.trim()) {
      setError('Please enter a new password');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
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

      // Simulate successful password reset
      // Determine user based on email
      let userData = null;
      if (email === "john.doe@cloudbyz.com") {
        userData = {
          name: "John Doe",
          email: "john.doe@cloudbyz.com",
          id: "us1122334456"
        };
      } else if (email === "lisa.chen@cloudbyz.com") {
        userData = {
          name: "Lisa Chen",
          email: "lisa.chen@cloudbyz.com",
          id: "us1122334459"
        };
      } else {
        // Default to John Doe for any other email
        userData = {
          name: "John Doe",
          email: "john.doe@cloudbyz.com",
          id: "us1122334456"
        };
      }
      
      // Set user as authenticated
      localStorage.setItem("username", userData.name);
      localStorage.setItem("useremail", userData.email);
      localStorage.setItem("userid", userData.id);
      
      setIsLoading(false);
      handleClose();
      
      // Navigate to home page
      navigate('/home');
    } catch (error) {
      console.error('Server error:', error);
      setError('Server connection failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setEmail('');
    setCode(['', '', '', '', '', '']);
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setIsLoading(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  const handleBackToEmail = () => {
    setStep(1);
    setCode(['', '', '', '', '', '']);
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
      <Loader loading={isLoading}>
        {step === 1 ? loadingStates : resetLoadingStates}
      </Loader>

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-CloudbyzBlue/10 to-CloudbyzBlue/5 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-CloudbyzBlue/10 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faSignature} className="text-CloudbyzBlue text-lg" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                {step === 1 ? 'Reset Password' : 'Verify & Reset'}
              </h2>
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
          {step === 1 ? (
            // Step 1: Email Input
            <>
              <div className="text-center mb-6">
                <p className="text-gray-600 leading-relaxed">
                  Enter your email address and we'll send you a verification code to reset your password.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 font-medium animate-pulse p-3 mb-4 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleEmailSubmit} className="space-y-4">
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
                  <span className="relative z-10">Send Verification Code</span>
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

              {/* Demo credentials info */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-xs font-semibold text-blue-800 mb-1">Demo Emails:</h4>
                <div className="text-xs text-blue-700 space-y-1">
                  <div>john.doe@cloudbyz.com</div>
                  <div>lisa.chen@cloudbyz.com</div>
                </div>
              </div>
            </>
          ) : (
            // Step 2: Code Verification & Password Reset
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-2xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Code Sent Successfully!
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  We've sent a 6-digit verification code to <strong>{email}</strong>. 
                  Enter the code below and set your new password.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 font-medium animate-pulse p-3 mb-4 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handlePasswordReset} className="space-y-6">
                {/* 6-Digit Code Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Verification Code
                  </label>
                  <div className="flex justify-center space-x-2">
                    {code.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (codeRefs.current[index] = el)}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleCodeChange(index, e.target.value)}
                        onKeyDown={(e) => handleCodeKeyDown(index, e)}
                        className="w-12 h-12 text-center text-lg font-bold border-2 border-gray-300 rounded-lg focus:border-CloudbyzBlue focus:ring-2 focus:ring-CloudbyzBlue/20 outline-none transition-all duration-200 bg-white"
                        placeholder="0"
                      />
                    ))}
                  </div>
                </div>

                {/* New Password */}
                <div className="relative group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute top-1/2 transform -translate-y-1/2 z-10 left-3">
                      <FontAwesomeIcon
                        icon={faLock}
                        className="text-slate-400 group-focus-within:text-CloudbyzBlue transition-colors duration-200 text-sm"
                      />
                    </div>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      required
                      minLength="8"
                      className="w-full border-2 border-slate-200 bg-white/80 backdrop-blur-sm focus:border-CloudbyzBlue focus:ring-4 focus:ring-CloudbyzBlue/10 outline-none transition-all duration-200 text-slate-700 placeholder-slate-400 pl-10 pr-10 py-3 rounded-lg text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-CloudbyzBlue transition-colors duration-200 rounded-lg hover:bg-CloudbyzBlue/10 right-3 p-1"
                    >
                      <FontAwesomeIcon 
                        icon={showNewPassword ? faEyeSlash : faEye} 
                        className="text-sm"
                      />
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="relative group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute top-1/2 transform -translate-y-1/2 z-10 left-3">
                      <FontAwesomeIcon
                        icon={faLock}
                        className="text-slate-400 group-focus-within:text-CloudbyzBlue transition-colors duration-200 text-sm"
                      />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      required
                      minLength="8"
                      className="w-full border-2 border-slate-200 bg-white/80 backdrop-blur-sm focus:border-CloudbyzBlue focus:ring-4 focus:ring-CloudbyzBlue/10 outline-none transition-all duration-200 text-slate-700 placeholder-slate-400 pl-10 pr-10 py-3 rounded-lg text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-CloudbyzBlue transition-colors duration-200 rounded-lg hover:bg-CloudbyzBlue/10 right-3 p-1"
                    >
                      <FontAwesomeIcon 
                        icon={showConfirmPassword ? faEyeSlash : faEye} 
                        className="text-sm"
                      />
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-CloudbyzBlue to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden group py-3 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10">Reset Password</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-CloudbyzBlue opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={handleBackToEmail}
                  className="text-sm text-gray-600 hover:text-CloudbyzBlue transition-colors duration-200"
                >
                  Back to Email Entry
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;