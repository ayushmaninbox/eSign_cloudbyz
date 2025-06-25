import React, { useState } from 'react';
import { X, Shield, Lock, Eye, EyeOff } from 'lucide-react';

const SignatureAuthModal = ({ isOpen, onClose, onAuthenticate, userEmail }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState('');

  const handleAuthenticate = async (e) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setError('');

    try {
      // Simulate authentication
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, accept any password
      if (password.trim()) {
        onAuthenticate();
        onClose();
      } else {
        setError('Please enter a password');
      }
    } catch (error) {
      setError('Authentication failed. Please try again.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    setShowPassword(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-green-100 to-green-50 px-6 py-4 border-b border-green-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-green-800">Signature Authentication</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-red-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-red-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Secure Signature Verification</h3>
            <p className="text-sm text-gray-600">
              Please verify your identity before applying your signature to ensure document security.
            </p>
            {userEmail && (
              <p className="text-sm text-green-600 font-medium mt-2">{userEmail}</p>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleAuthenticate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isAuthenticating || !password.trim()}
              className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                isAuthenticating || !password.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isAuthenticating ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying...</span>
                </div>
              ) : (
                'Verify & Continue'
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Your signature will be legally binding once authenticated.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignatureAuthModal;