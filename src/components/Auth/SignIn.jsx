import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash, faSignature } from '@fortawesome/free-solid-svg-icons';
import Loader from '../ui/Loader';
import Error404 from '../ui/404error';

const SignIn = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState(false);

    useEffect(() => {
        localStorage.removeItem('username');
        localStorage.removeItem('useremail');
    }, []);

    const loadingStates = [
        { text: 'Verifying credentials...' },
        { text: 'Checking server connection...' },
        { text: 'Authenticating user...' },
        { text: 'Loading dashboard...' }
    ];

    const handleSignIn = async (e) => {
        e.preventDefault();
        const emailInput = document.getElementById("email").value;
        const passwordInput = document.getElementById("password").value;

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

            // Hardcoded credentials for John Doe
            if (emailInput === "john.doe@cloudbyz.com" && passwordInput === "password") {
                localStorage.setItem("username", "John Doe");
                localStorage.setItem("useremail", "john.doe@cloudbyz.com");
                setIsLoading(false);
                navigate("/home");
            } else {
                setError('Invalid email or password');
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Server error:', error);
            setServerError(true);
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        setIsLoading(true);
        setError('');
        setServerError(false);

        // Simulate Google login
        setTimeout(() => {
            localStorage.setItem("username", "John Doe");
            localStorage.setItem("useremail", "john.doe@cloudbyz.com");
            setIsLoading(false);
            navigate("/home");
        }, 2000);
    };

    if (serverError) {
        return <Error404 />;
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <Loader loading={isLoading}>
                {loadingStates}
            </Loader>
            
            <div className="flex w-full max-w-6xl h-full max-h-[90vh] min-h-[500px] bg-white shadow-2xl rounded-2xl overflow-hidden">
                {/* Left Side */}
                <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-slate-100 to-slate-200 items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-CloudbyzBlue/5 to-transparent"></div>
                    <FontAwesomeIcon 
                        icon={faSignature} 
                        className="text-CloudbyzBlue drop-shadow-lg relative z-10 text-6xl md:text-7xl lg:text-8xl"
                    />
                </div>

                {/* Right Side */}
                <div className="w-full md:w-1/2 bg-gradient-to-br from-white to-slate-50 flex flex-col justify-center p-6 md:p-8 lg:p-12 overflow-y-auto">
                    <div className="w-full max-w-md mx-auto">
                        <img 
                            src="/images/cloudbyz.png" 
                            alt="Cloudbyz Logo" 
                            className="mx-auto drop-shadow-sm w-16 md:w-20 lg:w-24 mb-6 md:mb-8"
                        />
                        
                        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-800 text-center bg-gradient-to-r from-slate-800 to-CloudbyzBlue bg-clip-text text-transparent mb-6 md:mb-8">
                            Welcome Back
                        </h2>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 text-sm md:text-base font-medium animate-pulse p-3 md:p-4 mb-4 md:mb-6 rounded-lg">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSignIn} className="space-y-4 md:space-y-6">
                            <div className="relative group">
                                <div className="absolute top-1/2 transform -translate-y-1/2 left-3 md:left-4 z-10">
                                    <FontAwesomeIcon 
                                        icon={faEnvelope} 
                                        className="text-slate-400 group-focus-within:text-CloudbyzBlue transition-colors duration-200 text-sm md:text-base"
                                    />
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Enter your email"
                                    required
                                    className="w-full border-2 border-slate-200 bg-white/80 backdrop-blur-sm focus:border-CloudbyzBlue focus:ring-4 focus:ring-CloudbyzBlue/10 outline-none transition-all duration-200 text-slate-700 placeholder-slate-400 pl-10 md:pl-12 pr-3 md:pr-4 py-3 md:py-4 rounded-lg text-sm md:text-base"
                                />
                            </div>

                            <div className="relative group">
                                <div className="absolute top-1/2 transform -translate-y-1/2 left-3 md:left-4 z-10">
                                    <FontAwesomeIcon 
                                        icon={faLock} 
                                        className="text-slate-400 group-focus-within:text-CloudbyzBlue transition-colors duration-200 text-sm md:text-base"
                                    />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    placeholder="Enter your password"
                                    required
                                    className="w-full border-2 border-slate-200 bg-white/80 backdrop-blur-sm focus:border-CloudbyzBlue focus:ring-4 focus:ring-CloudbyzBlue/10 outline-none transition-all duration-200 text-slate-700 placeholder-slate-400 pl-10 md:pl-12 pr-10 md:pr-12 py-3 md:py-4 rounded-lg text-sm md:text-base"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute top-1/2 transform -translate-y-1/2 right-3 md:right-4 text-slate-400 hover:text-CloudbyzBlue transition-colors duration-200 rounded-lg hover:bg-CloudbyzBlue/10 p-1"
                                >
                                    <FontAwesomeIcon 
                                        icon={showPassword ? faEyeSlash : faEye} 
                                        className="text-sm md:text-base"
                                    />
                                </button>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-CloudbyzBlue to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden group py-3 md:py-4 rounded-lg text-sm md:text-base"
                            >
                                <span className="relative z-10">Sign In</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-CloudbyzBlue opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                            </button>

                            <div className="relative my-4 md:my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-xs md:text-sm">
                                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleGoogleLogin}
                                className="w-full bg-white border-2 border-gray-300 text-gray-700 font-semibold shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-200 flex items-center justify-center py-3 md:py-4 rounded-lg text-sm md:text-base gap-2 md:gap-3"
                            >
                                <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                <span>Login Using Google</span>
                            </button>
                        </form>

                        <p className="text-center text-slate-600 mt-6 md:mt-8 text-sm md:text-base">
                            New user?{' '}
                            <a href="/signup" className="text-CloudbyzBlue font-semibold hover:text-blue-600 transition-colors duration-200 relative group">
                                Sign up
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-CloudbyzBlue group-hover:w-full transition-all duration-200"></span>
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;