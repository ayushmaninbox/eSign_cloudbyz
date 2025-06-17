import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faEye, faEyeSlash, faSignature } from '@fortawesome/free-solid-svg-icons';
import Loader from '../ui/Loader';
import Error404 from '../ui/404error';

const SignUp = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState(false);

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

    const handleSignUp = async (e) => {
        e.preventDefault();
        
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

    if (serverError) {
        return <Error404 />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <Loader loading={isLoading}>
                {loadingStates}
            </Loader>
            
            <div className="flex w-full max-w-6xl h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Left Side */}
                <div className="w-1/2 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-CloudbyzBlue/5 to-transparent"></div>
                    <FontAwesomeIcon icon={faSignature} className="text-8xl text-CloudbyzBlue drop-shadow-lg relative z-10" />
                </div>

                {/* Right Side */}
                <div className="w-1/2 p-12 flex flex-col justify-center bg-gradient-to-br from-white to-slate-50">
                    <div className="max-w-md mx-auto w-full">
                        <img src="/images/cloudbyz.png" alt="Cloudbyz Logo" className="w-48 mx-auto mb-8 drop-shadow-sm" />
                        
                        <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center bg-gradient-to-r from-slate-800 to-CloudbyzBlue bg-clip-text text-transparent">
                            Create Account
                        </h2>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium animate-pulse">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSignUp} className="space-y-6">
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                                    <FontAwesomeIcon icon={faUser} className="text-slate-400 group-focus-within:text-CloudbyzBlue transition-colors duration-200" />
                                </div>
                                <input
                                    type="text"
                                    id="username"
                                    placeholder="Enter your username"
                                    required
                                    className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-xl bg-white/80 backdrop-blur-sm focus:border-CloudbyzBlue focus:ring-4 focus:ring-CloudbyzBlue/10 outline-none transition-all duration-200 text-slate-700 placeholder-slate-400"
                                />
                            </div>

                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                                    <FontAwesomeIcon icon={faEnvelope} className="text-slate-400 group-focus-within:text-CloudbyzBlue transition-colors duration-200" />
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Enter your email"
                                    required
                                    className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-xl bg-white/80 backdrop-blur-sm focus:border-CloudbyzBlue focus:ring-4 focus:ring-CloudbyzBlue/10 outline-none transition-all duration-200 text-slate-700 placeholder-slate-400"
                                />
                            </div>

                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                                    <FontAwesomeIcon icon={faLock} className="text-slate-400 group-focus-within:text-CloudbyzBlue transition-colors duration-200" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full pl-12 pr-12 py-4 border-2 border-slate-200 rounded-xl bg-white/80 backdrop-blur-sm focus:border-CloudbyzBlue focus:ring-4 focus:ring-CloudbyzBlue/10 outline-none transition-all duration-200 text-slate-700 placeholder-slate-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-CloudbyzBlue transition-colors duration-200 p-1 rounded-lg hover:bg-CloudbyzBlue/10"
                                >
                                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                </button>
                            </div>

                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                                    <FontAwesomeIcon icon={faLock} className="text-slate-400 group-focus-within:text-CloudbyzBlue transition-colors duration-200" />
                                </div>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirm-password"
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="w-full pl-12 pr-12 py-4 border-2 border-slate-200 rounded-xl bg-white/80 backdrop-blur-sm focus:border-CloudbyzBlue focus:ring-4 focus:ring-CloudbyzBlue/10 outline-none transition-all duration-200 text-slate-700 placeholder-slate-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-CloudbyzBlue transition-colors duration-200 p-1 rounded-lg hover:bg-CloudbyzBlue/10"
                                >
                                    <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                                </button>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 bg-gradient-to-r from-CloudbyzBlue to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden group"
                            >
                                <span className="relative z-10">Sign Up</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-CloudbyzBlue opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                            </button>
                        </form>

                        <p className="mt-8 text-center text-slate-600">
                            Already have an account?{' '}
                            <a href="/signin" className="text-CloudbyzBlue font-semibold hover:text-blue-600 transition-colors duration-200 relative group">
                                Sign In
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-CloudbyzBlue group-hover:w-full transition-all duration-200"></span>
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;