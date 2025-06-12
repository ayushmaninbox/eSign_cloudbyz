import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faEye, faEyeSlash, faSignature } from '@fortawesome/free-solid-svg-icons';

const SignUp = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        localStorage.removeItem('username');
        localStorage.removeItem('useremail');
    }, []);

    const handleSignUp = (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        const userData = {
            name: document.getElementById('username').value,
            email: document.getElementById('email').value,
            password: password
        };

        // Get existing users or initialize empty array
        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Check if email already exists
        if (existingUsers.some(user => user.email === userData.email)) {
            setError('Email already exists');
            return;
        }

        // Add new user
        existingUsers.push(userData);
        localStorage.setItem('users', JSON.stringify(existingUsers));

        // Set current user
        localStorage.setItem("username", userData.name);
        localStorage.setItem("useremail", userData.email);
        
        navigate('/dashboard');
    };

    return (
        <div className="auth-container">
            <style>{`
                .auth-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    width: 100vw;
                    background: linear-gradient(to right, white, #3498db);
                    box-sizing: border-box;
                }

                .auth-box {
                    display: flex;
                    width: 90vw;
                    height: 90vh;
                    background-color: white;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    border-radius: 10px;
                    overflow: hidden;
                }

                .auth-left {
                    width: 50%;
                    background-color: #f0f0f5;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 20px;
                }

                .auth-left-icon {
                    font-size: 8rem;
                    color: #3498db;
                }

                .auth-right {
                    width: 50%;
                    padding: 40px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                }

                .auth-right img {
                    width: 50%;
                    height: 15%;
                    margin-bottom: 40px;
                }

                .auth-right h2 {
                    margin-bottom: 20px;
                    font-size: 2rem;
                    color: #333;
                }

                .auth-right .form-group {
                    position: relative;
                    width: 100%;
                    margin-bottom: 15px;
                }

                .auth-right input {
                    width: 100%;
                    padding: 10px;
                    padding-left: 40px;
                    padding-right: 40px;
                    font-size: 1rem;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                }

                .auth-right .form-group .icon {
                    position: absolute;
                    left: 10px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #666;
                }

                .auth-right .form-group .eye-icon {
                    position: absolute;
                    right: 10px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #666;
                    cursor: pointer;
                }

                .error-message {
                    color: red;
                    font-size: 0.9rem;
                    margin-bottom: 10px;
                }

                .auth-right button {
                    width: 100%;
                    padding: 10px;
                    background-color: #3498db;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 1rem;
                }

                .auth-right button:hover {
                    background-color: white;
                    color: #2980b9;
                    border: 1px solid #2980b9;
                }

                .sign-in-prompt p {
                    margin-top: 15px;
                    font-size: 0.9rem;
                    text-align: center;
                }

                .sign-in-prompt a {
                    color: #3498db;
                    text-decoration: none;
                }

                .sign-in-prompt a:hover {
                    text-decoration: underline;
                }
            `}</style>
            
            <div className="auth-box">
                <div className="auth-left">
                    <FontAwesomeIcon icon={faSignature} className="auth-left-icon" />
                </div>
                <div className="auth-right">
                    <img src="src/assets/CloudbyzLogo.png" alt="Cbyz Logo" />

                    <h2>Sign Up</h2>
                    {error && <p className="error-message">{error}</p>}
                    <form onSubmit={handleSignUp}>
                        <div className="form-group">
                            <FontAwesomeIcon icon={faUser} className="icon" />
                            <input type="text" id="username" placeholder="Enter your username" required />
                        </div>

                        <div className="form-group">
                            <FontAwesomeIcon icon={faEnvelope} className="icon" />
                            <input type="email" id="email" placeholder="Enter your email" required />
                        </div>

                        <div className="form-group">
                            <FontAwesomeIcon icon={faLock} className="icon" />
                            <input 
                                type={showPassword ? "text" : "password"} 
                                id="password" 
                                placeholder="Enter your password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                            />
                            <FontAwesomeIcon 
                                icon={showPassword ? faEyeSlash : faEye} 
                                className="eye-icon"
                                onClick={() => setShowPassword(!showPassword)} 
                            />
                        </div>

                        <div className="form-group">
                            <FontAwesomeIcon icon={faLock} className="icon" />
                            <input 
                                type={showConfirmPassword ? "text" : "password"} 
                                id="confirm-password" 
                                placeholder="Confirm your password" 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required 
                            />
                            <FontAwesomeIcon 
                                icon={showConfirmPassword ? faEyeSlash : faEye} 
                                className="eye-icon"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                            />
                        </div>

                        <button type="submit">Sign Up</button>
                    </form>

                    <div className="sign-in-prompt">
                        <p>Already have an account? <a href="/">Sign In</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;