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
    <div className={`fixed left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-lg shadow-lg backdrop-blur-sm ${
      type === "success"
        ? "bg-emerald-50/90 text-emerald-800"
        : "bg-red-50/90 text-red-800"
    }`} style={{ 
      top: 'clamp(1rem, 5vh, 3rem)',
      padding: 'clamp(0.5rem, 1.5vw, 1rem)',
      fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)'
    }}>
      <span className="font-medium">{message}</span>
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
        <div className="h-screen w-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center overflow-hidden" style={{ padding: '1vw' }}>
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
            
            <div className="flex w-full h-full bg-white shadow-2xl overflow-hidden" style={{ 
                borderRadius: '1.5vw',
                maxWidth: '90vw',
                maxHeight: '85vh',
                minWidth: '600px',
                minHeight: '450px'
            }}>
                {/* Left Side */}
                <div className="w-1/2 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-CloudbyzBlue/5 to-transparent"></div>
                    <FontAwesomeIcon 
                        icon={faSignature} 
                        className="text-CloudbyzBlue drop-shadow-lg relative z-10" 
                        style={{ fontSize: 'clamp(2rem, 6vw, 5rem)' }}
                    />
                </div>

                {/* Right Side */}
                <div className="w-1/2 bg-gradient-to-br from-white to-slate-50 flex flex-col justify-center overflow-y-auto" style={{ padding: 'clamp(1rem, 3vw, 3rem)' }}>
                    <div className="w-full max-w-md mx-auto">
                        <img 
                            src="/images/cloudbyz.png" 
                            alt="Cloudbyz Logo" 
                            className="mx-auto drop-shadow-sm" 
                            style={{ 
                                width: 'clamp(3.5rem, 10vw, 7rem)',
                                marginBottom: 'clamp(0.5rem, 1.5vw, 1.5rem)'
                            }}
                        />
                        
                        <h2 
                            className="font-bold text-slate-800 text-center bg-gradient-to-r from-slate-800 to-CloudbyzBlue bg-clip-text text-transparent"
                            style={{ 
                                fontSize: 'clamp(1rem, 2.5vw, 1.75rem)',
                                marginBottom: 'clamp(0.5rem, 1.5vw, 1.25rem)'
                            }}
                        >
                            Create Account
                        </h2>

                        {error && (
                            <div 
                                className="bg-red-50 border border-red-200 text-red-700 font-medium animate-pulse"
                                style={{ 
                                    padding: 'clamp(0.5rem, 1.5vw, 1rem)',
                                    marginBottom: 'clamp(0.5rem, 1.5vw, 1rem)',
                                    borderRadius: 'clamp(0.5rem, 1vw, 0.75rem)',
                                    fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)'
                                }}
                            >
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.4rem, 1.2vw, 0.8rem)' }}>
                            <div className="relative group">
                                <div className="absolute top-1/2 transform -translate-y-1/2 z-10" style={{ left: 'clamp(0.5rem, 1.5vw, 1rem)' }}>
                                    <FontAwesomeIcon 
                                        icon={faUser} 
                                        className="text-slate-400 group-focus-within:text-CloudbyzBlue transition-colors duration-200" 
                                        style={{ fontSize: 'clamp(0.75rem, 1.5vw, 1rem)' }}
                                    />
                                </div>
                                <input
                                    type="text"
                                    id="username"
                                    placeholder="Enter your username"
                                    required
                                    className="w-full border-2 border-slate-200 bg-white/80 backdrop-blur-sm focus:border-CloudbyzBlue focus:ring-4 focus:ring-CloudbyzBlue/10 outline-none transition-all duration-200 text-slate-700 placeholder-slate-400"
                                    style={{
                                        paddingLeft: 'clamp(2rem, 4vw, 3rem)',
                                        paddingRight: 'clamp(0.5rem, 1.5vw, 1rem)',
                                        paddingTop: 'clamp(0.4rem, 1.2vw, 0.6rem)',
                                        paddingBottom: 'clamp(0.4rem, 1.2vw, 0.6rem)',
                                        borderRadius: 'clamp(0.5rem, 1vw, 0.75rem)',
                                        fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)'
                                    }}
                                />
                            </div>

                            <div className="relative group">
                                <div className="absolute top-1/2 transform -translate-y-1/2 z-10" style={{ left: 'clamp(0.5rem, 1.5vw, 1rem)' }}>
                                    <FontAwesomeIcon 
                                        icon={faEnvelope} 
                                        className="text-slate-400 group-focus-within:text-CloudbyzBlue transition-colors duration-200" 
                                        style={{ fontSize: 'clamp(0.75rem, 1.5vw, 1rem)' }}
                                    />
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Enter your email"
                                    required
                                    className="w-full border-2 border-slate-200 bg-white/80 backdrop-blur-sm focus:border-CloudbyzBlue focus:ring-4 focus:ring-CloudbyzBlue/10 outline-none transition-all duration-200 text-slate-700 placeholder-slate-400"
                                    style={{
                                        paddingLeft: 'clamp(2rem, 4vw, 3rem)',
                                        paddingRight: 'clamp(0.5rem, 1.5vw, 1rem)',
                                        paddingTop: 'clamp(0.4rem, 1.2vw, 0.6rem)',
                                        paddingBottom: 'clamp(0.4rem, 1.2vw, 0.6rem)',
                                        borderRadius: 'clamp(0.5rem, 1vw, 0.75rem)',
                                        fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)'
                                    }}
                                />
                            </div>

                            <div className="relative group">
                                <div className="absolute top-1/2 transform -translate-y-1/2 z-10" style={{ left: 'clamp(0.5rem, 1.5vw, 1rem)' }}>
                                    <FontAwesomeIcon 
                                        icon={faLock} 
                                        className="text-slate-400 group-focus-within:text-CloudbyzBlue transition-colors duration-200" 
                                        style={{ fontSize: 'clamp(0.75rem, 1.5vw, 1rem)' }}
                                    />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full border-2 border-slate-200 bg-white/80 backdrop-blur-sm focus:border-CloudbyzBlue focus:ring-4 focus:ring-CloudbyzBlue/10 outline-none transition-all duration-200 text-slate-700 placeholder-slate-400"
                                    style={{
                                        paddingLeft: 'clamp(2rem, 4vw, 3rem)',
                                        paddingRight: 'clamp(2rem, 4vw, 3rem)',
                                        paddingTop: 'clamp(0.4rem, 1.2vw, 0.6rem)',
                                        paddingBottom: 'clamp(0.4rem, 1.2vw, 0.6rem)',
                                        borderRadius: 'clamp(0.5rem, 1vw, 0.75rem)',
                                        fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)'
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-CloudbyzBlue transition-colors duration-200 rounded-lg hover:bg-CloudbyzBlue/10"
                                    style={{ 
                                        right: 'clamp(0.5rem, 1.5vw, 1rem)',
                                        padding: 'clamp(0.25rem, 0.5vw, 0.5rem)'
                                    }}
                                >
                                    <FontAwesomeIcon 
                                        icon={showPassword ? faEyeSlash : faEye} 
                                        style={{ fontSize: 'clamp(0.75rem, 1.5vw, 1rem)' }}
                                    />
                                </button>
                            </div>

                            <div className="relative group">
                                <div className="absolute top-1/2 transform -translate-y-1/2 z-10" style={{ left: 'clamp(0.5rem, 1.5vw, 1rem)' }}>
                                    <FontAwesomeIcon 
                                        icon={faLock} 
                                        className="text-slate-400 group-focus-within:text-CloudbyzBlue transition-colors duration-200" 
                                        style={{ fontSize: 'clamp(0.75rem, 1.5vw, 1rem)' }}
                                    />
                                </div>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirm-password"
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="w-full border-2 border-slate-200 bg-white/80 backdrop-blur-sm focus:border-CloudbyzBlue focus:ring-4 focus:ring-CloudbyzBlue/10 outline-none transition-all duration-200 text-slate-700 placeholder-slate-400"
                                    style={{
                                        paddingLeft: 'clamp(2rem, 4vw, 3rem)',
                                        paddingRight: 'clamp(2rem, 4vw, 3rem)',
                                        paddingTop: 'clamp(0.4rem, 1.2vw, 0.6rem)',
                                        paddingBottom: 'clamp(0.4rem, 1.2vw, 0.6rem)',
                                        borderRadius: 'clamp(0.5rem, 1vw, 0.75rem)',
                                        fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)'
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-CloudbyzBlue transition-colors duration-200 rounded-lg hover:bg-CloudbyzBlue/10"
                                    style={{ 
                                        right: 'clamp(0.5rem, 1.5vw, 1rem)',
                                        padding: 'clamp(0.25rem, 0.5vw, 0.5rem)'
                                    }}
                                >
                                    <FontAwesomeIcon 
                                        icon={showConfirmPassword ? faEyeSlash : faEye} 
                                        style={{ fontSize: 'clamp(0.75rem, 1.5vw, 1rem)' }}
                                    />
                                </button>
                            </div>

                            {/* Terms and Conditions Checkbox */}
                            <div className="flex items-start" style={{ gap: 'clamp(0.25rem, 1vw, 0.5rem)' }}>
                                <input
                                    type="checkbox"
                                    id="acceptTerms"
                                    checked={acceptTerms}
                                    onChange={(e) => setAcceptTerms(e.target.checked)}
                                    className="text-CloudbyzBlue bg-gray-100 border-gray-300 rounded focus:ring-CloudbyzBlue focus:ring-2"
                                    style={{ 
                                        width: 'clamp(0.75rem, 1.5vw, 1rem)',
                                        height: 'clamp(0.75rem, 1.5vw, 1rem)',
                                        marginTop: 'clamp(0.125rem, 0.5vw, 0.25rem)'
                                    }}
                                />
                                <label 
                                    htmlFor="acceptTerms" 
                                    className="text-gray-600 leading-relaxed"
                                    style={{ fontSize: 'clamp(0.7rem, 1.2vw, 0.75rem)' }}
                                >
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
                                className={`w-full font-semibold shadow-lg transition-all duration-200 relative overflow-hidden group ${
                                    acceptTerms
                                        ? 'bg-gradient-to-r from-CloudbyzBlue to-blue-600 text-white hover:shadow-xl transform hover:-translate-y-0.5'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                                style={{
                                    paddingTop: 'clamp(0.4rem, 1.2vw, 0.6rem)',
                                    paddingBottom: 'clamp(0.4rem, 1.2vw, 0.6rem)',
                                    borderRadius: 'clamp(0.5rem, 1vw, 0.75rem)',
                                    fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)'
                                }}
                            >
                                <span className="relative z-10">Sign Up</span>
                                {acceptTerms && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-CloudbyzBlue opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                                )}
                            </button>

                            <div className="relative" style={{ margin: 'clamp(0.4rem, 1.2vw, 0.8rem) 0' }}>
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center" style={{ fontSize: 'clamp(0.7rem, 1.2vw, 0.75rem)' }}>
                                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleGoogleSignUp}
                                className={`w-full font-semibold shadow-sm transition-all duration-200 flex items-center justify-center ${
                                    acceptTerms
                                        ? 'bg-white border-2 border-gray-300 text-gray-700 hover:shadow-md hover:bg-gray-50'
                                        : 'bg-gray-100 border-2 border-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                                style={{
                                    paddingTop: 'clamp(0.4rem, 1.2vw, 0.6rem)',
                                    paddingBottom: 'clamp(0.4rem, 1.2vw, 0.6rem)',
                                    borderRadius: 'clamp(0.5rem, 1vw, 0.75rem)',
                                    fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                                    gap: 'clamp(0.25rem, 1vw, 0.5rem)'
                                }}
                            >
                                <svg style={{ width: 'clamp(0.75rem, 1.5vw, 1rem)', height: 'clamp(0.75rem, 1.5vw, 1rem)' }} viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                <span>Sign up with Google</span>
                            </button>
                        </form>

                        <p 
                            className="text-center text-slate-600"
                            style={{ 
                                marginTop: 'clamp(0.5rem, 1.5vw, 1rem)',
                                fontSize: 'clamp(0.7rem, 1.2vw, 0.875rem)'
                            }}
                        >
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