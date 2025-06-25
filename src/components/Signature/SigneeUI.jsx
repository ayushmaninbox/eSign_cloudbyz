import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
  faSignature,
} from "@fortawesome/free-solid-svg-icons";
import {
  User,
  Settings,
  LogOut,
  UserCircle,
  X,
  Check,
  ChevronDown,
  Type,
  PenTool,
  Upload,
  Trash2,
  RotateCcw,
  Eye,
  EyeOff,
  Lock,
  FileText,
  Bold,
  Italic,
  Underline,
  Palette,
  CheckCircle2,
  Play,
  ArrowRight,
} from "lucide-react";
import Loader from "../ui/Loader";
import Error404 from "../ui/404error";
import TermsAndConditions from "../ui/T&C";
import Navbar from "../Navbar/Navbar";

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm ${
        type === "success"
          ? "bg-emerald-50/90 text-emerald-800"
          : "bg-red-50/90 text-red-800"
      }`}
      style={{
        top: '5vh',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '0.875rem'
      }}
    >
      <span className="font-medium">{message}</span>
    </div>
  );
};

const InitialAuthModal = ({ isOpen, onClose, onAuthenticate }) => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "error",
  });

  const loadingStates = isSignUp
    ? [
        { text: "Creating your account..." },
        { text: "Setting up profile..." },
        { text: "Configuring dashboard..." },
        { text: "Almost ready..." },
      ]
    : [
        { text: "Verifying credentials..." },
        { text: "Checking server connection..." },
        { text: "Authenticating user..." },
        { text: "Loading dashboard..." },
      ];

  const showToast = (message, type = "error") => {
    setToast({ show: true, message, type });
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    const emailInput = document.getElementById("auth-email").value;
    const passwordInput = document.getElementById("auth-password").value;

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
        localStorage.setItem("username", "John Doe");
        localStorage.setItem("useremail", "john.doe@cloudbyz.com");
        localStorage.setItem("firstTimeUser", "true");
        setIsLoading(false);
        onAuthenticate();
      } else {
        setError("Invalid email or password");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Server error:", error);
      setError("Server connection failed");
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

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

      const userData = {
        name: document.getElementById("auth-username").value,
        email: document.getElementById("auth-email").value,
        password: password,
      };

      // Set current user
      localStorage.setItem("username", userData.name);
      localStorage.setItem("useremail", userData.email);
      localStorage.setItem("firstTimeUser", "true");

      setIsLoading(false);
      onAuthenticate();
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
      localStorage.setItem("username", "John Doe");
      localStorage.setItem("useremail", "john.doe@cloudbyz.com");
      localStorage.setItem("firstTimeUser", "true");
      setIsLoading(false);
      onAuthenticate();
    }, 2000);
  };

  const handleTermsClick = (e) => {
    e.preventDefault();
    setShowTermsModal(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <Loader loading={isLoading}>{loadingStates}</Loader>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

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
        <div className="w-1/2 bg-gradient-to-br from-white to-slate-50 flex flex-col justify-center overflow-y-auto p-8">
          <div className="w-full max-w-md mx-auto">
            <img
              src="/images/cloudbyz.png"
              alt="Cloudbyz Logo"
              className="mx-auto drop-shadow-sm w-20 mb-6"
            />

            <h2 className="text-2xl font-bold text-slate-800 text-center bg-gradient-to-r from-slate-800 to-CloudbyzBlue bg-clip-text text-transparent mb-6">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h2>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 font-medium animate-pulse p-3 mb-4 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form
              onSubmit={isSignUp ? handleSignUp : handleSignIn}
              className="flex flex-col gap-4"
            >
              {isSignUp && (
                <div className="relative group">
                  <div className="absolute top-1/2 transform -translate-y-1/2 z-10 left-3">
                    <FontAwesomeIcon
                      icon={faUser}
                      className="text-slate-400 group-focus-within:text-CloudbyzBlue transition-colors duration-200 text-sm"
                    />
                  </div>
                  <input
                    type="text"
                    id="auth-username"
                    placeholder="Enter your username"
                    required
                    className="w-full border-2 border-slate-200 bg-white/80 backdrop-blur-sm focus:border-CloudbyzBlue focus:ring-4 focus:ring-CloudbyzBlue/10 outline-none transition-all duration-200 text-slate-700 placeholder-slate-400 pl-10 pr-4 py-3 rounded-lg text-sm"
                  />
                </div>
              )}

              <div className="relative group">
                <div className="absolute top-1/2 transform -translate-y-1/2 z-10 left-3">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="text-slate-400 group-focus-within:text-CloudbyzBlue transition-colors duration-200 text-sm"
                  />
                </div>
                <input
                  type="email"
                  id="auth-email"
                  placeholder="Enter your email"
                  required
                  className="w-full border-2 border-slate-200 bg-white/80 backdrop-blur-sm focus:border-CloudbyzBlue focus:ring-4 focus:ring-CloudbyzBlue/10 outline-none transition-all duration-200 text-slate-700 placeholder-slate-400 pl-10 pr-4 py-3 rounded-lg text-sm"
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
                  id="auth-password"
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

              {isSignUp && (
                <div className="relative group">
                  <div className="absolute top-1/2 transform -translate-y-1/2 z-10 left-3">
                    <FontAwesomeIcon
                      icon={faLock}
                      className="text-slate-400 group-focus-within:text-CloudbyzBlue transition-colors duration-200 text-sm"
                    />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="auth-confirm-password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
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
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-CloudbyzBlue to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden group py-3 rounded-lg text-sm"
              >
                <span className="relative z-10">
                  {isSignUp ? "Sign Up" : "Sign In"}
                </span>
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
                <span>
                  {isSignUp ? "Sign up with Google" : "Login Using Google"}
                </span>
              </button>
            </form>

            <p className="text-center text-slate-600 mt-6 text-sm">
              {isSignUp ? "Already have an account?" : "New user?"}{" "}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-CloudbyzBlue font-semibold hover:text-blue-600 transition-colors duration-200 relative group"
              >
                {isSignUp ? "Sign In" : "Sign up"}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-CloudbyzBlue group-hover:w-full transition-all duration-200"></span>
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Terms and Conditions Modal */}
      <TermsAndConditions
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />
    </div>
  );
};

const SigningAuthModal = ({
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
    </div>
  );
};

const TermsAcceptanceBar = ({ onAccept }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const handleAccept = () => {
    if (isChecked) {
      setIsAccepted(true);
      setTimeout(() => {
        onAccept();
      }, 500);
    }
  };

  const handleTermsClick = (e) => {
    e.preventDefault();
    setShowTermsModal(true);
  };

  if (isAccepted) {
    return null;
  }

  return (
    <>
      <div className="fixed top-16 left-0 right-0 bg-gradient-to-r from-blue-50 via-white to-blue-50 border-b border-gray-200 shadow-sm px-6 py-3 flex items-center justify-between z-20 h-16">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="terms-checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="w-4 h-4 text-CloudbyzBlue bg-gray-100 border-gray-300 rounded focus:ring-CloudbyzBlue focus:ring-2"
            />
            <label
              htmlFor="terms-checkbox"
              className="text-sm text-gray-700 cursor-pointer"
            >
              I have read and agree to the{" "}
              <button
                onClick={handleTermsClick}
                className="text-CloudbyzBlue hover:text-CloudbyzBlue/80 underline font-medium"
              >
                Terms and Conditions
              </button>
            </label>
          </div>
        </div>

        <button
          onClick={handleAccept}
          disabled={!isChecked}
          className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 ${
            isChecked
              ? "bg-gradient-to-r from-CloudbyzBlue to-CloudbyzBlue/80 hover:from-CloudbyzBlue/90 hover:to-CloudbyzBlue/70 text-white shadow-lg hover:shadow-xl hover:scale-105"
              : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60"
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Confirm</span>
        </button>
      </div>

      <TermsAndConditions
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />
    </>
  );
};

const SignatureModal = ({ isOpen, onClose, onSave }) => {
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);

  const [activeTab, setActiveTab] = useState("draw");
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [typedSignature, setTypedSignature] = useState("John Doe");
  const [selectedFont, setSelectedFont] = useState("cursive");

  // Reason selection states
  const [selectedReason, setSelectedReason] = useState("");
  const [showReasonDropdown, setShowReasonDropdown] = useState(false);
  const [signatureReasons, setSignatureReasons] = useState([]);
  const [localOtherReasons, setLocalOtherReasons] = useState([]);
  const [customReason, setCustomReason] = useState("");
  const [isCustomReason, setIsCustomReason] = useState(false);
  const [tempInputValue, setTempInputValue] = useState("");

  const colors = ["#000000", "#FF0000", "#00FF00", "#0000FF"];
  const fonts = [
    { value: "cursive", label: "Cursive", style: "font-family: cursive" },
    { value: "serif", label: "Serif", style: "font-family: serif" },
    {
      value: "sans-serif",
      label: "Sans Serif",
      style: "font-family: sans-serif",
    },
    { value: "monospace", label: "Monospace", style: "font-family: monospace" },
  ];

  // Save drawn signature to sessionStorage
  const saveDrawnSignatureToSession = () => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL();
      sessionStorage.setItem("drawnSignature", dataUrl);
    }
  };

  // Handle tab change with signature persistence
  const handleTabChange = (tab) => {
    if (activeTab === "draw") {
      saveDrawnSignatureToSession();
    }
    setActiveTab(tab);
  };

  // Load saved signature from sessionStorage when modal opens or switching to draw tab
  useEffect(() => {
    if (isOpen && activeTab === "draw") {
      const savedSig = sessionStorage.getItem("drawnSignature");
      if (savedSig && canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
        };
        img.src = savedSig;
      }
    }
  }, [isOpen, activeTab]);

  useEffect(() => {
    if (isOpen) {
      // Load local other reasons from localStorage
      const localReasons = localStorage.getItem("localOtherReasons");
      if (localReasons) {
        setLocalOtherReasons(JSON.parse(localReasons));
      }

      // Load signature reasons from backend
      fetch("http://localhost:5000/api/data")
        .then((response) => response.json())
        .then((data) => {
          setSignatureReasons(data.signatureReasons || []);
          // Set the first reason as default
          if (data.signatureReasons && data.signatureReasons.length > 0) {
            setSelectedReason(data.signatureReasons[0]);
          }
        })
        .catch((error) => console.error("Error fetching reasons:", error));
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowReasonDropdown(false);
      }
    };

    if (showReasonDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showReasonDropdown]);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    saveDrawnSignatureToSession();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Clear from sessionStorage as well
    sessionStorage.removeItem("drawnSignature");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateTypedSignature = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 150;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = selectedColor;
    ctx.font = `48px ${selectedFont}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(typedSignature, canvas.width / 2, canvas.height / 2);

    return canvas.toDataURL();
  };

  const handleReasonSelect = (reason) => {
    if (reason === "Other") {
      setIsCustomReason(true);
      setSelectedReason("");
      setCustomReason("");
      setTempInputValue("");
    } else {
      setIsCustomReason(false);
      setSelectedReason(reason);
    }
    setShowReasonDropdown(false);
  };

  const handleCustomReasonSave = () => {
    if (tempInputValue.trim()) {
      const newReason = tempInputValue.trim();
      setSelectedReason(newReason);
      setCustomReason(newReason);
      setIsCustomReason(false);

      // Add to local other reasons
      const updatedLocalReasons = [...localOtherReasons, newReason];
      setLocalOtherReasons(updatedLocalReasons);
      localStorage.setItem(
        "localOtherReasons",
        JSON.stringify(updatedLocalReasons)
      );

      console.log("Reason:", newReason);
    }
  };

  const handleSave = () => {
    let signatureData;

    if (activeTab === "draw") {
      signatureData = sessionStorage.getItem("drawnSignature") || canvasRef.current.toDataURL();
    } else if (activeTab === "upload") {
      if (!uploadedImage) {
        alert("Please upload an image");
        return;
      }
      signatureData = uploadedImage;
    } else if (activeTab === "text") {
      if (!typedSignature.trim()) {
        alert("Please enter text for signature");
        return;
      }
      signatureData = generateTypedSignature();
    }

    // Check if reason is selected
    if (!selectedReason && !tempInputValue.trim()) {
      alert("Please select a reason to sign");
      return;
    }

    const finalReason = isCustomReason ? tempInputValue.trim() : selectedReason;

    // If it's a custom reason, handle it
    if (isCustomReason && tempInputValue.trim()) {
      const newReason = tempInputValue.trim();
      const updatedLocalReasons = [...localOtherReasons, newReason];
      setLocalOtherReasons(updatedLocalReasons);
      localStorage.setItem(
        "localOtherReasons",
        JSON.stringify(updatedLocalReasons)
      );

      console.log("Reason:", newReason);
    } else {
      console.log("Reason:", finalReason);
    }

    // Save signature to session storage (persists until browser tab is closed)
    sessionStorage.setItem("sessionSignature", signatureData);

    onSave(signatureData, finalReason);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-CloudbyzBlue/10 to-CloudbyzBlue/5 border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">
              Create Your Signature
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors group"
            >
              <X className="w-4 h-4 text-red-600 group-hover:text-red-700" />
            </button>
          </div>
        </div>

        <div className="max-h-[calc(90vh-120px)] overflow-y-auto p-6">
          {/* Reason Selection */}
          <div ref={dropdownRef} className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Reason to Sign *
            </label>
            <div className="relative">
              {isCustomReason ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tempInputValue}
                    onChange={(e) => setTempInputValue(e.target.value)}
                    placeholder="Enter custom reason"
                    className="flex-1 border border-gray-300 rounded-lg focus:border-CloudbyzBlue focus:ring-2 focus:ring-CloudbyzBlue/20 transition-all p-3 text-sm"
                    maxLength={50}
                  />
                  <button
                    onClick={handleCustomReasonSave}
                    className="bg-CloudbyzBlue text-white rounded-lg hover:bg-CloudbyzBlue/90 transition-colors px-4 py-3 text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsCustomReason(false);
                      setTempInputValue("");
                    }}
                    className="bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors px-4 py-3 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowReasonDropdown(!showReasonDropdown)}
                  className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:border-CloudbyzBlue focus:ring-2 focus:ring-CloudbyzBlue/20 transition-all p-3 text-sm"
                >
                  <span
                    className={
                      selectedReason ? "text-gray-800" : "text-gray-500"
                    }
                  >
                    {selectedReason || "Select a reason to sign"}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform ${
                      showReasonDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>
              )}

              {showReasonDropdown && !isCustomReason && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-[70] max-h-48 overflow-y-auto">
                  {signatureReasons.map((reason, index) => (
                    <button
                      key={index}
                      onClick={() => handleReasonSelect(reason)}
                      className="w-full text-left hover:bg-gray-50 transition-colors p-3 text-sm"
                    >
                      {reason}
                    </button>
                  ))}
                  {localOtherReasons.map((reason, index) => (
                    <button
                      key={`local-${index}`}
                      onClick={() => handleReasonSelect(reason)}
                      className="w-full text-left hover:bg-gray-50 transition-colors p-3 text-sm"
                    >
                      {reason}
                    </button>
                  ))}
                  <div className="border-t border-gray-200">
                    <button
                      onClick={() => handleReasonSelect("Other")}
                      className="w-full text-left hover:bg-gray-50 transition-colors text-CloudbyzBlue font-medium p-3 text-sm"
                    >
                      Other reason...
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => handleTabChange("draw")}
                className={`font-medium transition-colors px-6 py-3 text-sm ${
                  activeTab === "draw"
                    ? "text-CloudbyzBlue border-b-2 border-CloudbyzBlue"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <PenTool className="w-4 h-4" />
                  <span>Draw</span>
                </div>
              </button>
              <button
                onClick={() => handleTabChange("upload")}
                className={`font-medium transition-colors px-6 py-3 text-sm ${
                  activeTab === "upload"
                    ? "text-CloudbyzBlue border-b-2 border-CloudbyzBlue"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  <span>Upload</span>
                </div>
              </button>
              <button
                onClick={() => handleTabChange("text")}
                className={`font-medium transition-colors px-6 py-3 text-sm ${
                  activeTab === "text"
                    ? "text-CloudbyzBlue border-b-2 border-CloudbyzBlue"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  <span>Text</span>
                </div>
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "draw" && (
            <div>
              {/* Color Selection */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Signature Color
                </label>
                <div className="flex gap-3">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColor === color
                          ? "border-gray-800 scale-110"
                          : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Drawing Canvas */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Draw Your Signature
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 p-4">
                  <canvas
                    ref={canvasRef}
                    width={600}
                    height={200}
                    className="w-full bg-white border border-gray-200 rounded cursor-crosshair h-48"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <button
                    onClick={clearCanvas}
                    className="text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors px-4 py-2 text-sm"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "upload" && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Upload Signature Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg text-center bg-gray-50 p-8">
                {uploadedImage ? (
                  <div>
                    <img
                      src={uploadedImage}
                      alt="Uploaded signature"
                      className="mx-auto mb-4 max-h-32"
                    />
                    <button
                      onClick={() => setUploadedImage(null)}
                      className="text-red-600 hover:text-red-800 transition-colors text-sm"
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4 text-sm">
                      Click to upload or drag and drop
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-CloudbyzBlue text-white rounded-lg hover:bg-CloudbyzBlue/90 transition-colors px-6 py-3 text-sm"
                    >
                      Choose File
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "text" && (
            <div className="mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Signature Text
                  </label>
                  <input
                    type="text"
                    value={typedSignature}
                    onChange={(e) => setTypedSignature(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg focus:border-CloudbyzBlue focus:ring-2 focus:ring-CloudbyzBlue/20 transition-all p-3 text-sm"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Font Style
                  </label>
                  <select
                    value={selectedFont}
                    onChange={(e) => setSelectedFont(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg focus:border-CloudbyzBlue focus:ring-2 focus:ring-CloudbyzBlue/20 transition-all p-3 text-sm"
                  >
                    {fonts.map((font) => (
                      <option key={font.value} value={font.value}>
                        {font.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Color Selection */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Text Color
                </label>
                <div className="flex gap-3">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColor === color
                          ? "border-gray-800 scale-110"
                          : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Preview
                </label>
                <div className="border border-gray-200 rounded-lg bg-gray-50 text-center flex items-center justify-center p-6 min-h-[100px]">
                  <span
                    style={{
                      fontFamily: selectedFont,
                      color: selectedColor,
                      fontSize: '1.875rem',
                    }}
                  >
                    {typedSignature || "Your signature will appear here"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={handleSave}
              className="bg-CloudbyzBlue text-white rounded-lg hover:bg-CloudbyzBlue/90 transition-colors px-6 py-3 text-sm"
            >
              Save Signature
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const InitialsModal = ({ isOpen, onClose, onSave }) => {
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [selectedStyle, setSelectedStyle] = useState("normal");
  const [initialsText, setInitialsText] = useState("JD");

  const colors = ["#000000", "#FF0000", "#00FF00", "#0000FF"];
  const styles = [
    { value: "normal", label: "Normal", style: "font-normal" },
    { value: "bold", label: "Bold", style: "font-bold" },
    { value: "italic", label: "Italic", style: "italic" },
    { value: "bold-italic", label: "Bold Italic", style: "font-bold italic" },
  ];

  // Load saved initials from session storage when modal opens
  useEffect(() => {
    if (isOpen) {
      const savedInitials = sessionStorage.getItem("sessionInitials");
      if (savedInitials) {
        const initialsData = JSON.parse(savedInitials);
        setInitialsText(initialsData.text || "JD");
        setSelectedColor(initialsData.color || "#000000");
        setSelectedStyle(initialsData.style || "normal");
      }
    }
  }, [isOpen]);

  const handleSave = () => {
    const initialsData = {
      text: initialsText,
      color: selectedColor,
      style: selectedStyle,
    };

    // Save initials to session storage (persists until browser tab is closed)
    sessionStorage.setItem("sessionInitials", JSON.stringify(initialsData));

    onSave(initialsData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-CloudbyzBlue/10 to-CloudbyzBlue/5 border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">
              Create Your Initials
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors group"
            >
              <X className="w-4 h-4 text-red-600 group-hover:text-red-700" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Initials Text */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Initials Text
            </label>
            <input
              type="text"
              value={initialsText}
              onChange={(e) =>
                setInitialsText(e.target.value.toUpperCase().slice(0, 3))
              }
              className="w-full border border-gray-300 rounded-lg focus:border-CloudbyzBlue focus:ring-2 focus:ring-CloudbyzBlue/20 transition-all p-3 text-sm"
              placeholder="Enter initials"
              maxLength={3}
            />
          </div>

          {/* Style Selection */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Text Style
            </label>
            <div className="grid grid-cols-2 gap-2">
              {styles.map((style) => (
                <button
                  key={style.value}
                  onClick={() => setSelectedStyle(style.value)}
                  className={`border rounded-lg transition-all p-3 text-sm ${
                    selectedStyle === style.value
                      ? "border-CloudbyzBlue bg-CloudbyzBlue/10 text-CloudbyzBlue"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <span className={style.style}>{style.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Text Color
            </label>
            <div className="flex gap-3">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    selectedColor === color
                      ? "border-gray-800 scale-110"
                      : "border-gray-300"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Preview
            </label>
            <div className="border border-gray-200 rounded-lg bg-gray-50 text-center p-4">
              <span
                className={`${
                  styles.find((s) => s.value === selectedStyle)?.style
                } text-2xl`}
                style={{ color: selectedColor }}
              >
                {initialsText}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={handleSave}
              className="bg-CloudbyzBlue text-white rounded-lg hover:bg-CloudbyzBlue/90 transition-colors px-6 py-3 text-sm"
            >
              Save Initials
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TextModal = ({ isOpen, onClose, onSave }) => {
  const [text, setText] = useState("");
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  const colors = ["#000000", "#FF0000", "#00FF00", "#0000FF"];

  const handleSave = () => {
    if (!text.trim()) {
      alert("Please enter some text");
      return;
    }

    onSave({
      text: text.trim(),
      color: selectedColor,
      bold: isBold,
      italic: isItalic,
      underline: isUnderline,
    });
  };

  const getPreviewStyle = () => {
    let style = { color: selectedColor };
    let className = "";

    if (isBold) className += "font-bold ";
    if (isItalic) className += "italic ";
    if (isUnderline) style.textDecoration = "underline";

    return { style, className };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-CloudbyzBlue/10 to-CloudbyzBlue/5 border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Add Text</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors group"
            >
              <X className="w-4 h-4 text-red-600 group-hover:text-red-700" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Text Input */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Text Content (Max 100 characters)
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 100))}
              className="w-full border border-gray-300 rounded-lg focus:border-CloudbyzBlue focus:ring-2 focus:ring-CloudbyzBlue/20 transition-all resize-none p-3 text-sm"
              placeholder="Enter your text here..."
              rows={3}
              maxLength={100}
            />
            <div className="text-right text-gray-500 mt-1 text-xs">
              {text.length}/100 characters
            </div>
          </div>

          {/* Text Formatting */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Text Formatting
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setIsBold(!isBold)}
                className={`border rounded-lg transition-all p-2 ${
                  isBold
                    ? "border-CloudbyzBlue bg-CloudbyzBlue/10 text-CloudbyzBlue"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                title="Bold"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsItalic(!isItalic)}
                className={`border rounded-lg transition-all p-2 ${
                  isItalic
                    ? "border-CloudbyzBlue bg-CloudbyzBlue/10 text-CloudbyzBlue"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                title="Italic"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsUnderline(!isUnderline)}
                className={`border rounded-lg transition-all p-2 ${
                  isUnderline
                    ? "border-CloudbyzBlue bg-CloudbyzBlue/10 text-CloudbyzBlue"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                title="Underline"
              >
                <Underline className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Color Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Text Color
            </label>
            <div className="flex gap-3">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    selectedColor === color
                      ? "border-gray-800 scale-110"
                      : "border-gray-300"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          {text && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Preview
              </label>
              <div className="border border-gray-200 rounded-lg bg-gray-50 flex items-center p-4 min-h-[60px]">
                <span
                  className={getPreviewStyle().className}
                  style={getPreviewStyle().style}
                >
                  {text}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={handleSave}
              className="bg-CloudbyzBlue text-white rounded-lg hover:bg-CloudbyzBlue/90 transition-colors px-6 py-3 text-sm"
            >
              Add Text
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SigneeUI = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [pageUrls, setPageUrls] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState("1");
  const [canvasDimensions, setCanvasDimensions] = useState({});
  const [signatureElements, setSignatureElements] = useState([]);
  const [savedSignature, setSavedSignature] = useState(null);
  const [savedInitials, setSavedInitials] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentElementIndex, setCurrentElementIndex] = useState(-1);
  const [signingStarted, setSigningStarted] = useState(false);
  const [showInitialAuthModal, setShowInitialAuthModal] = useState(false);
  const [hasShownInitialAuth, setHasShownInitialAuth] = useState(false);
  const [showTermsBar, setShowTermsBar] = useState(false);

  // Modal states
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [showInitialsModal, setShowInitialsModal] = useState(false);
  const [showTextModal, setShowTextModal] = useState(false);
  const [showSigningAuthModal, setShowSigningAuthModal] = useState(false);
  const [currentElementId, setCurrentElementId] = useState(null);
  const [currentElementType, setCurrentElementType] = useState(null);
  const [pendingSignatureData, setPendingSignatureData] = useState(null);
  const [pendingReason, setPendingReason] = useState("");

  const numPages = pageUrls.length;

  const loadingStates = [
    { text: "Loading document for signing..." },
    { text: "Preparing signature fields..." },
    { text: "Setting up authentication..." },
    { text: "Ready to sign..." },
  ];

  const navigatingStates = [
    { text: "Saving signatures..." },
    { text: "Finalizing document..." },
    { text: "Processing completion..." },
    { text: "Redirecting..." },
  ];

  const drawImageOnCanvas = useCallback((canvas, imageUrl, pageIndex) => {
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const container = canvas.parentElement;
      const containerWidth = container.clientWidth;

      // Make canvas fill the entire container width (75% of screen)
      canvas.width = containerWidth;
      const aspectRatio = img.height / img.width;
      canvas.height = containerWidth * aspectRatio;

      // Set canvas display size to match container
      canvas.style.width = "100%";
      canvas.style.height = "auto";

      setCanvasDimensions((prev) => ({
        ...prev,
        [pageIndex]: {
          width: canvas.width,
          height: canvas.height,
        },
      }));

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    img.src = imageUrl;
  }, []);

  useEffect(() => {
    // Clear session storage on page load (simulates page reload behavior)
    sessionStorage.clear();

    // Check authentication status
    const username = localStorage.getItem("username");
    const useremail = localStorage.getItem("useremail");
    const firstTimeUser = localStorage.getItem("firstTimeUser");

    if (username && useremail) {
      setIsAuthenticated(true);
      // Show terms bar only for first time users
      if (firstTimeUser === "true") {
        setShowTermsBar(true);
      } else {
        setTermsAccepted(true);
      }
    } else {
      setIsAuthenticated(false);
      // Show initial auth modal only once when user directly accesses the page
      if (!hasShownInitialAuth) {
        setShowInitialAuthModal(true);
        setHasShownInitialAuth(true);
      }
    }

    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/images");
        if (!response.ok) {
          throw new Error("Server connection failed");
        }

        const data = await response.json();
        setPageUrls(data.images);

        // Initialize signature elements
        const elements = [
          {
            id: "sig-page3-1",
            type: "signature",
            page: 2,
            x: 150,
            y: 400,
            width: 200,
            height: 80,
            signed: false,
          },
          {
            id: "sig-page5-1",
            type: "signature",
            page: 4,
            x: 150,
            y: 300,
            width: 200,
            height: 80,
            signed: false,
          },
          {
            id: "sig-page6-1",
            type: "signature",
            page: 5,
            x: 150,
            y: 200,
            width: 200,
            height: 80,
            signed: false,
          },
          {
            id: "init-page7-1",
            type: "initials",
            page: 6,
            x: 150,
            y: 300,
            width: 80,
            height: 40,
            signed: false,
          },
          {
            id: "text-page8-1",
            type: "text",
            page: 7,
            x: 150,
            y: 250,
            width: 250,
            height: 60,
            signed: false,
          },
        ];

        setSignatureElements(elements);
      } catch (error) {
        console.error("Error fetching data:", error);
        setServerError(true);
      } finally {
        setTimeout(() => setIsLoading(false), 3000);
      }
    };

    fetchData();
  }, [hasShownInitialAuth]);

  // Load saved signatures/initials from session storage
  useEffect(() => {
    const savedSig = sessionStorage.getItem("sessionSignature");
    const savedInit = sessionStorage.getItem("sessionInitials");

    if (savedSig) {
      setSavedSignature(savedSig);
    }

    if (savedInit) {
      setSavedInitials(JSON.parse(savedInit));
    }
  }, []);

  useEffect(() => {
    const initializeCanvases = () => {
      pageUrls.forEach((url, index) => {
        const pageCanvas = document.getElementById(`page-${index}`);
        if (pageCanvas) drawImageOnCanvas(pageCanvas, url, index);
      });
    };

    if (pageUrls.length > 0) {
      setTimeout(initializeCanvases, 100);
    }

    const handleResize = () => {
      clearTimeout(window.resizeTimeout);
      window.resizeTimeout = setTimeout(initializeCanvases, 150);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(window.resizeTimeout);
    };
  }, [drawImageOnCanvas, pageUrls]);

  // Update current page based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const mainContainer = document.getElementById("main-container");
      if (!mainContainer) return;

      const containerRect = mainContainer.getBoundingClientRect();
      const containerTop = containerRect.top;
      const containerHeight = containerRect.height;
      const centerY = containerTop + containerHeight / 2;

      // Find which page is closest to the center of the viewport
      let closestPage = 1;
      let closestDistance = Infinity;

      for (let i = 1; i <= numPages; i++) {
        const pageElement = document.getElementById(`page-container-${i}`);
        if (pageElement) {
          const pageRect = pageElement.getBoundingClientRect();
          const pageCenter = pageRect.top + pageRect.height / 2;
          const distance = Math.abs(pageCenter - centerY);

          if (distance < closestDistance) {
            closestDistance = distance;
            closestPage = i;
          }
        }
      }

      if (closestPage !== currentPage) {
        setCurrentPage(closestPage);
      }
    };

    const mainContainer = document.getElementById("main-container");
    if (mainContainer) {
      mainContainer.addEventListener("scroll", handleScroll);
      return () => mainContainer.removeEventListener("scroll", handleScroll);
    }
  }, [currentPage, numPages]);

  const handleTermsAccept = () => {
    setTermsAccepted(true);
    setShowTermsBar(false);
    // Mark user as no longer first time
    localStorage.setItem("firstTimeUser", "false");
  };

  const handleInitialAuthSuccess = () => {
    setIsAuthenticated(true);
    setShowInitialAuthModal(false);
    // Check if this is a first time user
    const firstTimeUser = localStorage.getItem("firstTimeUser");
    if (firstTimeUser === "true") {
      setShowTermsBar(true);
    } else {
      setTermsAccepted(true);
    }
  };

  const handleSigningAuthSuccess = () => {
    // If we were in the middle of signing, continue with the process
    if (currentElementType === "signature") {
      if (!savedSignature && pendingSignatureData) {
        setSavedSignature(pendingSignatureData);
        sessionStorage.setItem("sessionSignature", pendingSignatureData);
      }

      setSignatureElements((prev) =>
        prev.map((el) =>
          el.id === currentElementId
            ? {
                ...el,
                signed: true,
                signedAt: new Date().toISOString(),
                reason: pendingReason,
                signatureData: savedSignature || pendingSignatureData,
              }
            : el
        )
      );
    } else if (currentElementType === "initials") {
      if (!savedInitials && pendingSignatureData) {
        setSavedInitials(pendingSignatureData);
        sessionStorage.setItem(
          "sessionInitials",
          JSON.stringify(pendingSignatureData)
        );
      }

      setSignatureElements((prev) =>
        prev.map((el) =>
          el.id === currentElementId
            ? {
                ...el,
                signed: true,
                signedAt: new Date().toISOString(),
                initialsData: savedInitials || pendingSignatureData,
              }
            : el
        )
      );
    }

    setCurrentElementId(null);
    setCurrentElementType(null);
    setPendingSignatureData(null);
    setPendingReason("");
    setShowSigningAuthModal(false);
  };

  const handleElementClick = (elementId, elementType) => {
    const element = signatureElements.find((el) => el.id === elementId);
    if (!element || element.signed) return;

    setCurrentElementId(elementId);
    setCurrentElementType(elementType);

    // Check if this is the first signature/initials element being signed
    const isFirstSignature = elementType === "signature" && !savedSignature;
    const isFirstInitials = elementType === "initials" && !savedInitials;

    // Show appropriate modal based on element type and whether it's the first time
    if (elementType === "signature") {
      // Always show signature modal for signatures (includes reason selection)
      setShowSignatureModal(true);
    } else if (elementType === "initials") {
      if (isFirstInitials) {
        // First initials - show initials modal
        setShowInitialsModal(true);
      } else {
        // Subsequent initials - show auth modal directly (no reason required for initials)
        setShowSigningAuthModal(true);
      }
    } else if (elementType === "text") {
      // Text elements always show text modal (no auth or reason required)
      setShowTextModal(true);
    }
  };

  const handleSignatureSave = (signatureData, reason = null) => {
    setSavedSignature(signatureData);
    setPendingSignatureData(signatureData);
    if (reason) {
      setPendingReason(reason);
    }
    setShowSignatureModal(false);

    // Show auth modal
    setShowSigningAuthModal(true);
  };

  const handleInitialsSave = (initialsData) => {
    setSavedInitials(initialsData);
    setPendingSignatureData(initialsData);
    setShowInitialsModal(false);

    // Show auth modal
    setShowSigningAuthModal(true);
  };

  const handleTextSave = (textData) => {
    // Complete the text element immediately (no auth required)
    setSignatureElements((prev) =>
      prev.map((el) =>
        el.id === currentElementId
          ? {
              ...el,
              signed: true,
              signedAt: new Date().toISOString(),
              textData: textData,
            }
          : el
      )
    );

    setShowTextModal(false);
    setCurrentElementId(null);
    setCurrentElementType(null);
  };

  const handleSigningAuthAuthenticate = () => {
    // For subsequent signatures, use saved signature data
    if (currentElementType === "signature") {
      setSignatureElements((prev) =>
        prev.map((el) =>
          el.id === currentElementId
            ? {
                ...el,
                signed: true,
                signedAt: new Date().toISOString(),
                reason: pendingReason,
                signatureData: savedSignature,
              }
            : el
        )
      );
    } else if (currentElementType === "initials") {
      setSignatureElements((prev) =>
        prev.map((el) =>
          el.id === currentElementId
            ? {
                ...el,
                signed: true,
                signedAt: new Date().toISOString(),
                initialsData: savedInitials,
              }
            : el
        )
      );
    }

    setCurrentElementId(null);
    setCurrentElementType(null);
    setPendingReason("");
    setShowSigningAuthModal(false);
  };

  const scrollToPage = useCallback(
    (pageNum) => {
      const newPageNum = Math.max(1, Math.min(pageNum, numPages));
      const pageElement = document.getElementById(
        `page-container-${newPageNum}`
      );
      if (pageElement) {
        pageElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        setCurrentPage(newPageNum);
      }
    },
    [numPages]
  );

  useEffect(() => {
    setPageInput(String(currentPage));
  }, [currentPage]);

  const handlePageInputChange = (e) => {
    setPageInput(e.target.value);
  };

  const handlePageInputSubmit = (e) => {
    if (e.type === "blur" || (e.type === "keydown" && e.key === "Enter")) {
      const newPage = parseInt(pageInput, 10);
      if (!isNaN(newPage) && newPage >= 1 && newPage <= numPages) {
        scrollToPage(newPage);
        if (e.key === "Enter" && document.activeElement) {
          document.activeElement.blur();
        }
      } else {
        setPageInput(String(currentPage));
      }
    }
  };

  const navigatePage = (direction) => {
    let newPage = currentPage + direction;
    newPage = Math.max(1, Math.min(newPage, numPages));
    scrollToPage(newPage);
  };

  const handleBack = () => {
    if (location.state?.from === "/manage") {
      navigate("/manage");
    } else if (location.state?.from === "/signsetupui") {
      navigate("/signsetupui");
    } else {
      navigate("/home");
    }
  };

  const handleFinish = async () => {
    setIsNavigating(true);

    try {
      const response = await fetch("http://localhost:5000/api/stats");
      if (!response.ok) {
        throw new Error("Server connection failed");
      }

      await new Promise((resolve) => setTimeout(resolve, 3000));

      navigate("/signpreview", { state: { from: "/signeeui" } });
    } catch (error) {
      console.error("Server error:", error);
      setServerError(true);
    } finally {
      setIsNavigating(false);
    }
  };

  // Navigation logic for Start/Next buttons
  const handleStartSigning = () => {
    setSigningStarted(true);
    setCurrentElementIndex(0);

    // Navigate to the first signature element
    const firstElement = signatureElements[0];
    if (firstElement) {
      scrollToPage(firstElement.page + 1);
    }
  };

  const handleNextElement = () => {
    const nextIndex = currentElementIndex + 1;
    if (nextIndex < signatureElements.length) {
      setCurrentElementIndex(nextIndex);
      const nextElement = signatureElements[nextIndex];
      if (nextElement) {
        scrollToPage(nextElement.page + 1);
      }
    }
  };

  const renderSignatureElement = (element) => {
    if (!canvasDimensions[element.page]) return null;

    const canvasWidth = canvasDimensions[element.page].width;
    const canvasHeight = canvasDimensions[element.page].height;

    const actualX = (element.x / 600) * canvasWidth;
    const actualY = (element.y / 800) * canvasHeight;
    const actualWidth = (element.width / 600) * canvasWidth;
    const actualHeight = (element.height / 800) * canvasHeight;

    const elementIndex = signatureElements.findIndex(
      (el) => el.id === element.id
    );
    const isCurrentElement = elementIndex === currentElementIndex;
    const isNextElement = elementIndex === currentElementIndex + 1;

    const getElementContent = () => {
      if (element.signed) {
        if (element.type === "signature" && element.signatureData) {
          return (
            <img
              src={element.signatureData}
              alt="Signature"
              className="w-full h-full object-contain"
            />
          );
        } else if (element.type === "initials" && element.initialsData) {
          const { text, color, style } = element.initialsData;
          const styleClasses = {
            normal: "font-normal",
            bold: "font-bold",
            italic: "italic",
            "bold-italic": "font-bold italic",
          };

          return (
            <span
              className={`text-lg ${styleClasses[style] || "font-normal"}`}
              style={{ color }}
            >
              {text}
            </span>
          );
        } else if (element.type === "text" && element.textData) {
          const { text, color, bold, italic, underline } = element.textData;
          let className = "text-sm ";
          if (bold) className += "font-bold ";
          if (italic) className += "italic ";

          const style = {
            color,
            textDecoration: underline ? "underline" : "none",
            wordWrap: "break-word",
            overflowWrap: "break-word",
            hyphens: "auto",
          };

          return (
            <div className={className} style={style}>
              {text}
            </div>
          );
        }
      }

      const icons = {
        signature: <PenTool className="w-4 h-4" />,
        initials: <Type className="w-4 h-4" />,
        text: <FileText className="w-4 h-4" />,
      };

      const labels = {
        signature: "Click to Sign",
        initials: "Click for Initials",
        text: "Click to Fill",
      };

      return (
        <div className="flex items-center justify-center space-x-2 text-gray-600">
          {icons[element.type]}
          <span className="text-xs">{labels[element.type]}</span>
        </div>
      );
    };

    // Make all empty fields clickable if authenticated and terms accepted
    const isClickable = !element.signed && termsAccepted && isAuthenticated;

    let borderColor = "border-yellow-400";
    let bgColor = "bg-yellow-50";

    if (element.signed) {
      borderColor = "border-green-400";
      bgColor = "bg-green-50";
    } else if (isCurrentElement && signingStarted) {
      borderColor = "border-blue-500";
      bgColor = "bg-blue-100";
    } else if (isNextElement && signingStarted) {
      borderColor = "border-yellow-400";
      bgColor = "bg-yellow-50";
    }

    return (
      <div
        key={element.id}
        className={`absolute border-2 rounded-lg transition-all duration-200 ${borderColor} ${bgColor} ${
          isClickable ? "cursor-pointer hover:bg-blue-200" : ""
        }`}
        style={{
          left: actualX,
          top: actualY,
          width: actualWidth,
          height: actualHeight,
          zIndex: 10,
        }}
        onClick={() =>
          isClickable && handleElementClick(element.id, element.type)
        }
      >
        <div className="w-full h-full flex items-center justify-center p-2">
          {getElementContent()}
        </div>
      </div>
    );
  };

  // Button logic
  const allElementsSigned = signatureElements.every((el) => el.signed);
  const currentElementSigned =
    currentElementIndex >= 0 && currentElementIndex < signatureElements.length
      ? signatureElements[currentElementIndex].signed
      : false;
  const isLastElement = currentElementIndex === signatureElements.length - 1;

  if (serverError) {
    return <Error404 />;
  }

  if (numPages === 0) {
    return (
      <div className="flex flex-col h-screen bg-slate-100 text-slate-800 font-sans items-center justify-center">
        <Loader loading={isLoading}>{loadingStates}</Loader>

        <Navbar showTabs={false} onBack={handleBack} />
        <p className="text-2xl font-semibold text-slate-600">
          Loading document...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-100 text-slate-800 font-sans min-w-[768px] relative">
      <Loader loading={isLoading}>{loadingStates}</Loader>
      <Loader loading={isNavigating}>{navigatingStates}</Loader>
      <Navbar showTabs={false} onBack={handleBack} />

      {/* Initial Authentication Modal - only show when user directly accesses page */}
      <InitialAuthModal
        isOpen={showInitialAuthModal}
        onClose={() => setShowInitialAuthModal(false)}
        onAuthenticate={handleInitialAuthSuccess}
      />

      {/* Terms Acceptance Bar - only show if authenticated and first time user */}
      {isAuthenticated && showTermsBar && (
        <TermsAcceptanceBar onAccept={handleTermsAccept} />
      )}

      {/* Header - only show if authenticated and apply blur if terms not accepted */}
      {isAuthenticated && (
        <header
          className={`bg-white shadow-sm px-6 py-3 flex items-center fixed left-0 right-0 z-20 border-b border-gray-200 ${
            termsAccepted ? "top-16" : "top-32"
          } ${!termsAccepted ? "blur-sm pointer-events-none" : ""}`}
        >
          <div className="flex items-center w-1/3">
            {/* Back button is now handled by Navbar */}
          </div>

          <div className="flex items-center gap-4 justify-center w-1/3">
            <button
              onClick={() => navigatePage(-1)}
              disabled={currentPage <= 1}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-slate-200 transition-all duration-200"
              title="Previous Page"
            >
              <span className="text-xl text-slate-600 transform -translate-y-[1px]">
                ‹
              </span>
            </button>
            <input
              type="text"
              value={pageInput}
              onChange={handlePageInputChange}
              onBlur={handlePageInputSubmit}
              onKeyDown={handlePageInputSubmit}
              className="w-12 text-center text-sm bg-white text-slate-700 border border-slate-300 rounded-md py-1.5 focus:outline-none focus:ring-2 focus:ring-CloudbyzBlue focus:border-CloudbyzBlue transition-shadow"
            />
            <span className="px-1 text-sm text-slate-500">of {numPages}</span>
            <button
              onClick={() => navigatePage(1)}
              disabled={currentPage >= numPages}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-slate-200 transition-all duration-200"
              title="Next Page"
            >
              <span className="text-xl text-slate-600 transform -translate-y-[1px]">
                ›
              </span>
            </button>
          </div>

          <div className="w-1/3 flex justify-end">
            {/* Always show Finish button, but make it clickable only when all elements are signed */}
            <button
              onClick={allElementsSigned ? handleFinish : undefined}
              disabled={!allElementsSigned}
              className={`px-6 py-2 rounded-lg font-semibold shadow-lg transition-all duration-300 flex items-center space-x-2 ${
                allElementsSigned
                  ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white hover:shadow-xl hover:scale-105 cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <span>Finish</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            </button>
          </div>
        </header>
      )}

      <div
        className={`flex flex-row flex-grow relative ${
          !isAuthenticated
            ? "blur-sm pointer-events-none"
            : !termsAccepted
            ? "blur-sm pointer-events-none"
            : ""
        }`}
      >
        {/* Left Sidebar - 12.5% with greyish color */}
        <aside
          className={`w-[12.5%] border-r border-gray-200 shadow-sm flex items-center justify-center ${
            isAuthenticated ? (termsAccepted ? "mt-32" : "mt-48") : "mt-16"
          }`}
        >
          {isAuthenticated && termsAccepted && (
            <div className="p-4">
              {!signingStarted ? (
                <button
                  onClick={handleStartSigning}
                  className="bg-gradient-to-r from-CloudbyzBlue to-CloudbyzBlue/80 hover:from-CloudbyzBlue/90 hover:to-CloudbyzBlue/70 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 hover:scale-105"
                >
                  <Play className="w-4 h-4" />
                  <span>Start</span>
                </button>
              ) : (
                // Always show Next button, but disable it when current element is not signed
                <button
                  onClick={handleNextElement}
                  disabled={!currentElementSigned || isLastElement}
                  className={`px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 flex items-center space-x-2 ${
                    currentElementSigned && !isLastElement
                      ? "bg-gradient-to-r from-CloudbyzBlue to-CloudbyzBlue/80 hover:from-CloudbyzBlue/90 hover:to-CloudbyzBlue/70 text-white hover:shadow-xl hover:scale-105"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </aside>

        {/* Main Content - 75% */}
        <main
          id="main-container"
          className={`w-[75%] h-full bg-slate-200 transition-all duration-300 ease-in-out relative ${
            isAuthenticated ? (termsAccepted ? "mt-32" : "mt-48") : "mt-16"
          }`}
          style={{
            maxHeight: isAuthenticated
              ? termsAccepted
                ? "calc(100vh - 128px)"
                : "calc(100vh - 192px)"
              : "calc(100vh - 64px)",
            overflowY: "scroll",
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE and Edge
          }}
        >
          {/* Hide default scrollbar for webkit browsers */}
          <style>{`
            #main-container::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          <div style={{ width: "100%", height: "100%", padding: "24px 0" }}>
            {pageUrls.map((url, index) => (
              <div
                id={`page-container-${index + 1}`}
                key={`page-container-${index + 1}`}
                className="mb-6 relative"
                style={{
                  width: "100%",
                  maxWidth: "100%",
                  margin: "0 auto 3rem auto",
                  transition: "all 0.3s ease-in-out",
                }}
              >
                <div className="w-full h-full relative">
                  <canvas
                    id={`page-${index}`}
                    data-page-number={index + 1}
                    className="shadow-xl cursor-default"
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                    }}
                  />

                  {isAuthenticated &&
                    signatureElements
                      .filter((element) => element.page === index)
                      .map((element) => renderSignatureElement(element))}
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Right Sidebar - 12.5% with greyish color*/}
        <aside
          className={`w-[12.5%] border-l border-gray-200 shadow-sm relative ${
            isAuthenticated ? (termsAccepted ? "mt-32" : "mt-48") : "mt-16"
          }`}
        ></aside>
      </div>

      {/* Modals */}
      <SignatureModal
        isOpen={showSignatureModal}
        onClose={() => setShowSignatureModal(false)}
        onSave={handleSignatureSave}
      />

      <InitialsModal
        isOpen={showInitialsModal}
        onClose={() => setShowInitialsModal(false)}
        onSave={handleInitialsSave}
      />

      <TextModal
        isOpen={showTextModal}
        onClose={() => setShowTextModal(false)}
        onSave={handleTextSave}
      />

      <SigningAuthModal
        isOpen={showSigningAuthModal}
        onClose={() => setShowSigningAuthModal(false)}
        onAuthenticate={handleSigningAuthSuccess}
        fieldType={currentElementType}
        onBackToSignature={() => {
          setShowSigningAuthModal(false);
          setShowSignatureModal(true);
        }}
      />
    </div>
  );
};

export default SigneeUI;