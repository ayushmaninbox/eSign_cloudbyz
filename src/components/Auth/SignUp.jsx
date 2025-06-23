import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faEye, faEyeSlash, faSignature } from '@fortawesome/free-solid-svg-icons';
import Loader from '../ui/Loader';
import Error404 from '../ui/404error';
import TermsAndConditions from '../ui/T&C';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 sm:top-8 md:top-12 lg:top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-lg backdrop-blur-sm ${
      type === "success"
        ? "bg-emerald-50/90 text-emerald-800"
        : "bg-red-50/90 text-red-800"
    }`}>
      <span className="text-xs sm:text-sm font-medium">{message}</span>
    </div>
  );
};

const SignUp = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [toast, setToast] = useState({ show: false, message: "", type: "error" });

    useEffect(() => {
        localStorage.removeItem('username');
        localStorage.removeItem('useremail');
    }, []);

    const loadingStates = [
        { text: 'Creating your account...' },
        { text: 'Setting up profile...' },
        { text: 'Configuring dashboard...' },
        { text: 'Almost ready...' }
    ];

    const showToast = (message, type = "error") => {
        setToast({ show: true, message, type });
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        
        if (!acceptTerms) {
            showToast("Please accept the Terms and Conditions to continue");
            return;
        }
        
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);
        setError('');
        setServerError(false);

        try {
            // Test server connection first
            const testResponse = await fetch('http://localhost:5000/api/stats');
            if (!testResponse.ok) {
                throw new Error('Server connection failed');
            }

            // Simulate loading delay
            await new Promise(resolve => setTimeout(resolve, 3000));

            const userData = {
                name: document.getElementById('username').value,
                email: document.getElementById('email').value,
                password: password
            };

            // Set current user
            localStorage.setItem("username", userData.name);
            localStorage.setItem("useremail", userData.email);
            
            setIsLoading(false);
            navigate('/home');
        } catch (error) {
            console.error('Server error:', error);
            setServerError(true);
            setIsLoading(false);
        }
    };

    const handleGoogleSignUp = () => {
        if (!acceptTerms) {
            showToast("Please accept the Terms and Conditions to continue");
            return;
        }

        setIsLoading(true);
        setError('');
        setServerError(false);

        // Simulate Google signup
        setTimeout(() => {
            localStorage.setItem("username", "John Doe");
            localStorage.setItem("useremail", "john.doe@cloudbyz.com");
            setIsLoading(false);
            navigate("/home");
        }, 2000);
    };

    const handleTermsClick = (e) => {
        e.preventDefault();
        setShowTermsModal(true);
    };

    if (serverError) {
        return <Error404 />;
    }

    return (
        <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-2 sm:p-4 overflow-hidden">
            <Loader loading={isLoading}>
                {loadingStates}
            </Loader>
            
            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ ...toast, show: false })}
                />
            )}
            
            <div className="flex flex-col lg:flex-row w-full max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-4xl xl:max-w-5xl h-[95vh] max-h-[800px] min-h-[650px] bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
                {/* Left Side */}
                <div className="w-full lg:w-1/2 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden min-h-[100px] sm:min-h-[120px] md:min-h-[140px] lg:min-h-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-CloudbyzBlue/5 to-transparent"></div>
                    <FontAwesomeIcon icon={faSignature} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-CloudbyzBlue drop-shadow-lg relative z-10" />
                </div>

                {/* Right Side */}
                <div className="w-full lg:w-1/2 p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10 flex flex-col justify-center bg-gradient-to-br from-white to-slate-50 overflow-y-auto">
                    <div className="max-w-xs sm:max-w-sm md:max-w-md mx-auto w-full">
                        <img src="/images/cloudbyz.png" alt="Cloudbyz Logo" className="w-16 sm:w-20 md:w-24 lg:w-28 xl:w-32 mx-auto mb-2 sm:mb-3 md:mb-4 lg:mb-6 drop-shadow-sm" />
                        
                        <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-slate-800 mb-2 sm:mb-3 md:mb-4 lg:mb-6 text-center bg-gradient-to-r from-slate-800 to-CloudbyzBlue bg-clip-text text-transparent">
                            Create Account
                        </h2>

                        {error && (
                            <div className="mb-2 sm:mb-3 md:mb-4 p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl text-red-700 text-xs sm:text-sm font-medium animate-pulse">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSignUp} className="space-y-2 sm:space-y-3 lg:space-y-4">
                            <div className="relative group">
                                <div className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 z-10">
                                    <FontAwesomeIcon icon={faUser} className="text-slate-400 group-focus-within:text-CloudbyzBlue transition-colors duration-200 text-xs sm:text-sm" />
                                </div>
                                <input
                                    type="text"
                                    id="username"
                                    placeholder="Enter your username"
                                    required
                                    className="w-full pl-7 sm:pl-9 pr-2 sm:pr-3 py-2 sm:py-2.5 lg:py-3 border-2 border-slate-200 rounded-lg sm:rounded-xl bg-white/80 backdrop-blur-sm focus:border-CloudbyzBlue focus:ring-4 focus:ring-CloudbyzBlue/10 outline-none transition-all duration-200 text-slate-700 placeholder-slate-400 text-xs sm:text-sm"
                                />
                            </div>

                            <div className="relative group">
                                <div className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 z-10">
                                    <FontAwesomeIcon icon={faEnvelope} className="text-slate-400 group-focus-within:text-CloudbyzBlue transition-colors duration-200 text-xs sm:text-sm" />
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Enter your email"
                                    required
                                    className="w-full pl-7 sm:pl-9 pr-2 sm:pr-3 py-2 sm:py-2.5 lg:py-3 border-2 border-slate-200 rounded-lg sm:rounded-xl bg-white/80 backdrop-blur-sm focus:border-CloudbyzBlue focus:ring-4 focus:ring-CloudbyzBlue/10 outline-none transition-all duration-200 text-slate-700 placeholder-slate-400 text-xs sm:text-sm"
                                />
                            </div>

                            <div className="relative group">
                                <div className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 z-10">
                                    <FontAwesomeIcon icon={faLock} className="text-slate-400 group-focus-within:text-CloudbyzBlue transition-colors duration-200 text-xs sm:text-sm" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full pl-7 sm:pl-9 pr-7 sm:pr-9 py-2 sm:py-2.5 lg:py-3 border-2 border-slate-200 rounded-lg sm:rounded-xl bg-white/80 backdrop-blur-sm focus:border-CloudbyzBlue focus:ring-4 focus:ring-CloudbyzBlue/10 outline-none transition-all duration-200 text-slate-700 placeholder-slate-400 text-xs sm:text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-CloudbyzBlue transition-colors duration-200 p-1 rounded-lg hover:bg-CloudbyzBlue/10"
                                >
                                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="text-xs sm:text-sm" />
                                </button>
                            </div>

                            <div className="relative group">
                                <div className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 z-10">
                                    <FontAwesomeIcon icon={faLock} className="text-slate-400 group-focus-within:text-CloudbyzBlue transition-colors duration-200 text-xs sm:text-sm" />
                                </div>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirm-password"
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="w-full pl-7 sm:pl-9 pr-7 sm:pr-9 py-2 sm:py-2.5 lg:py-3 border-2 border-slate-200 rounded-lg sm:rounded-xl bg-white/80 backdrop-blur-sm focus:border-CloudbyzBlue focus:ring-4 focus:ring-CloudbyzBlue/10 outline-none transition-all duration-200 text-slate-700 placeholder-slate-400 text-xs sm:text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-CloudbyzBlue transition-colors duration-200 p-1 rounded-lg hover:bg-CloudbyzBlue/10"
                                >
                                    <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} className="text-xs sm:text-sm" />
                                </button>
                            </div>

                            {/* Terms and Conditions Checkbox */}
                            <div className="flex items-start space-x-2">
                                <input
                                    type="checkbox"
                                    id="acceptTerms"
                                    checked={acceptTerms}
                                    onChange={(e) => setAcceptTerms(e.target.checked)}
                                    className="mt-0.5 w-3 h-3 sm:w-4 sm:h-4 text-CloudbyzBlue bg-gray-100 border-gray-300 rounded focus:ring-CloudbyzBlue focus:ring-2"
                                />
                                <label htmlFor="acceptTerms" className="text-xs text-gray-600 leading-relaxed">
                                    I agree to the{' '}
                                    <button
                                        type="button"
                                        onClick={handleTermsClick}
                                        className="text-CloudbyzBlue font-semibold hover:text-blue-600 transition-colors duration-200 underline"
                                    >
                                        Terms and Conditions
                                    </button>
                                    {' '}.
                                </label>
                            </div>

                            <button
                                type="submit"
                                className={`w-full py-2 sm:py-2.5 lg:py-3 font-semibold rounded-lg sm:rounded-xl shadow-lg transition-all duration-200 relative overflow-hidden group text-xs sm:text-sm ${
                                    acceptTerms
                                        ? 'bg-gradient-to-r from-CloudbyzBlue to-blue-600 text-white hover:shadow-xl transform hover:-translate-y-0.5'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                <span className="relative z-10">Sign Up</span>
                                {acceptTerms && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-CloudbyzBlue opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                                )}
                            </button>

                            <div className="relative my-2 sm:my-3 lg:my-4">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-xs">
                                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleGoogleSignUp}
                                className={`w-full py-2 sm:py-2.5 lg:py-3 font-semibold rounded-lg sm:rounded-xl shadow-sm transition-all duration-200 flex items-center justify-center space-x-2 text-xs sm:text-sm ${
                                    acceptTerms
                                        ? 'bg-white border-2 border-gray-300 text-gray-700 hover:shadow-md hover:bg-gray-50'
                                        : 'bg-gray-100 border-2 border-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                            >
                                <svg className="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                <span>Sign up with Google</span>
                            </button>
                        </form>

                        <p className="mt-2 sm:mt-3 md:mt-4 lg:mt-6 text-center text-slate-600 text-xs sm:text-sm">
                            Already have an account?{' '}
                            <a href="/signin" className="text-CloudbyzBlue font-semibold hover:text-blue-600 transition-colors duration-200 relative group">
                                Sign In
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-CloudbyzBlue group-hover:w-full transition-all duration-200"></span>
                            </a>
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

export default SignUp;