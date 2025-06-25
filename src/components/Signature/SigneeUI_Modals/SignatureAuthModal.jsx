import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
  faSignature,
} from "@fortawesome/free-solid-svg-icons";
import Loader from '../../ui/Loader';
import ResetPassword from '../../ui/ResetPassword';

const SignatureAuthModal = ({
  isOpen,
  onClose,
  onAuthenticate,
  fieldType,
  onBackToSignature,
}) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);

  const loadingStates = [
    { text: "Verifying credentials..." },
    { text: "Checking server connection..." },
    { text: "Authenticating user..." },
    { text: "Applying Signature..." },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailInput = "john.doe@cloudbyz.com"; // Use stored email
    const passwordInput = password;

    setIsLoading(true);
    setError("");

    try {
      // Test server connection first
      const testResponse = await fetch("http://localhost:5000/api/stats");
      if (!testResponse.ok) {
        throw new Error("Server connection failed");
      }

      // Simulate loading delay
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Hardcoded credentials for John Doe
      if (
        emailInput === "john.doe@cloudbyz.com" &&
        passwordInput === "password"
      ) {
        setIsLoading(false);
        onAuthenticate();
        setPassword("");
        setError("");
      } else {
        setError("Invalid password");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Server error:", error);
      setError("Server connection failed");
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setError("");

    // Simulate Google login
    setTimeout(() => {
      setIsLoading(false);
      onAuthenticate();
      setPassword("");
      setError("");
    }, 2000);
  };

  const handleClose = () => {
    setPassword("");
    setError("");
    onClose();
  };

  const handleBackToSignature = () => {
    setPassword("");
    setError("");
    onBackToSignature();
  };

  const handleForgotPassword = () => {
    setShowResetPassword(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <Loader loading={isLoading}>{loadingStates}</Loader>

      <div className="flex w-full h-full bg-white shadow-2xl overflow-hidden rounded-2xl max-w-4xl max-h-[85vh] min-w-[600px] min-h-[400px]">
        {/* Left Side */}
        <div className="w-1/2 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-CloudbyzBlue/5 to-transparent"></div>
          <FontAwesomeIcon
            icon={faSignature}
            className="text-CloudbyzBlue drop-shadow-lg relative z-10 text-6xl"
          />
        </div>

        {/* Right Side */}
        <div className="w-1/2 bg-gradient-to-br from-white to-slate-50 flex flex-col justify-center relative overflow-y-auto p-8">
          {/* Back button in top right */}
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={handleBackToSignature}
              className="flex items-center text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all duration-200 group gap-2 px-3 py-2 text-sm font-medium"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
              Back
            </button>
          </div>

          <div className="w-full max-w-md mx-auto">
            <img
              src="/images/cloudbyz.png"
              alt="Cloudbyz Logo"
              className="mx-auto drop-shadow-sm w-20 mb-6"
            />

            <h2 className="text-2xl font-bold text-slate-800 text-center bg-gradient-to-r from-slate-800 to-CloudbyzBlue bg-clip-text text-transparent mb-6">
              Welcome Back
            </h2>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 font-medium animate-pulse p-3 mb-4 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="relative group">
                <div className="absolute top-1/2 transform -translate-y-1/2 z-10 left-3">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="text-slate-400 group-focus-within:text-CloudbyzBlue transition-colors duration-200 text-sm"
                  />
                </div>
                <input
                  type="email"
                  value="john.doe@cloudbyz.com"
                  readOnly
                  className="w-full border-2 border-slate-200 bg-gray-100 backdrop-blur-sm text-slate-700 cursor-not-allowed pl-10 pr-4 py-3 rounded-lg text-sm"
                />
              </div>

              <div className="relative group">
                <div className="absolute top-1/2 transform -translate-y-1/2 z-10 left-3">
                  <FontAwesomeIcon
                    icon={faLock}
                    className="text-slate-400 group-focus-within:text-CloudbyzBlue transition-colors duration-200 text-sm"
                  />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border-2 border-slate-200 bg-white/80 backdrop-blur-sm focus:border-CloudbyzBlue focus:ring-4 focus:ring-CloudbyzBlue/10 outline-none transition-all duration-200 text-slate-700 placeholder-slate-400 pl-10 pr-10 py-3 rounded-lg text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-CloudbyzBlue transition-colors duration-200 rounded-lg hover:bg-CloudbyzBlue/10 right-3 p-1"
                >
                  <FontAwesomeIcon 
                    icon={showPassword ? faEyeSlash : faEye} 
                    className="text-sm"
                  />
                </button>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-CloudbyzBlue hover:text-blue-600 transition-colors duration-200 text-sm font-medium"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-CloudbyzBlue to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden group py-3 rounded-lg text-sm"
              >
                <span className="relative z-10">Sign In</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-CloudbyzBlue opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full bg-white border-2 border-gray-300 text-gray-700 font-semibold shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-200 flex items-center justify-center py-3 rounded-lg text-sm gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Login Using Google</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Reset Password Modal */}
      <ResetPassword 
        isOpen={showResetPassword} 
        onClose={() => setShowResetPassword(false)} 
      />
    </div>
  );
};

export default SignatureAuthModal;