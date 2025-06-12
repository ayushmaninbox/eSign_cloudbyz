import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash, faSignature } from '@fortawesome/free-solid-svg-icons';

const SignIn = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        localStorage.removeItem('username');
        localStorage.removeItem('useremail');
    }, []);

    const handleSignIn = (e) => {
        e.preventDefault();
        const emailInput = document.getElementById("email").value;
        const passwordInput = document.getElementById("password").value;

        // Hardcoded credentials for John Doe
        if (emailInput === "john.doe@cloudbyz.com" && passwordInput === "password") {
            localStorage.setItem("username", "John Doe");
            localStorage.setItem("useremail", "john.doe@cloudbyz.com");
            navigate("/home");
        } else {
            setError('Invalid email or password');
        }
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
                    font-family: 'Poppins', sans-serif;
                }

                .auth-box {
                    display: flex;
                    width: 90vw;
                    height: 90vh;
                    background-color: white;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
                    border-radius: 16px;
                    overflow: hidden;
                }

                .auth-left {
                    width: 50%;
                    background: linear-gradient(135deg, #f0f4f8, #e2e8f0);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 20px;
                }

                .auth-left-icon {
                    font-size: 8rem;
                    color: #3498db;
                    filter: drop-shadow(0 4px 8px rgba(52, 152, 219, 0.3));
                }

                .auth-right {
                    width: 50%;
                    padding: 60px 50px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    background: linear-gradient(to bottom, #ffffff, #f8fafc);
                }

                .auth-right img {
                    width: 60%;
                    height: auto;
                    margin-bottom: 40px;
                    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
                }

                .auth-right h2 {
                    margin-bottom: 30px;
                    font-size: 2.5rem;
                    color: #1e293b;
                    font-weight: 700;
                    letter-spacing: -0.025em;
                }

                .auth-right .form-group {
                    position: relative;
                    width: 100%;
                    margin-bottom: 20px;
                }

                .auth-right input {
                    width: 100%;
                    padding: 16px 20px;
                    padding-left: 50px;
                    padding-right: 50px;
                    font-size: 1rem;
                    border: 2px solid #e2e8f0;
                    border-radius: 12px;
                    background: white;
                    transition: all 0.3s ease;
                    font-family: 'Poppins', sans-serif;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
                }

                .auth-right input:focus {
                    outline: none;
                    border-color: #3498db;
                    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
                    transform: translateY(-1px);
                }

                .auth-right .form-group .icon {
                    position: absolute;
                    left: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #64748b;
                    font-size: 1.1rem;
                }

                .auth-right .form-group .eye-icon {
                    position: absolute;
                    right: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #64748b;
                    cursor: pointer;
                    font-size: 1.1rem;
                    transition: color 0.2s ease;
                }

                .auth-right .form-group .eye-icon:hover {
                    color: #3498db;
                }

                .auth-right button {
                    width: 100%;
                    padding: 16px 20px;
                    background: linear-gradient(135deg, #3498db, #2980b9);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    cursor: pointer;
                    font-size: 1.1rem;
                    font-weight: 600;
                    font-family: 'Poppins', sans-serif;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
                    margin-top: 10px;
                }

                .auth-right button:hover {
                    background: linear-gradient(135deg, #2980b9, #1f5f8b);
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(52, 152, 219, 0.4);
                }

                .auth-right button:active {
                    transform: translateY(0);
                }

                .sign-up-prompt p {
                    margin-top: 25px;
                    font-size: 0.95rem;
                    text-align: center;
                    color: #64748b;
                    font-family: 'Poppins', sans-serif;
                }

                .sign-up-prompt a {
                    color: #3498db;
                    text-decoration: none;
                    font-weight: 600;
                    transition: color 0.2s ease;
                }

                .sign-up-prompt a:hover {
                    color: #2980b9;
                    text-decoration: underline;
                }

                .error-message {
                    color: #ef4444;
                    margin-bottom: 20px;
                    font-size: 0.9rem;
                    font-weight: 500;
                    padding: 12px 16px;
                    background: #fef2f2;
                    border: 1px solid #fecaca;
                    border-radius: 8px;
                    font-family: 'Poppins', sans-serif;
                }
            `}</style>

            <div className="auth-box">
                <div className="auth-left">
                    <FontAwesomeIcon icon={faSignature} className="auth-left-icon" />
                </div>
                <div className="auth-right">
                    <img src="/images/cloudbyz.png" alt="Cloudbyz Logo" />
                    <h2>Sign In</h2>
                    {error && <div className="error-message">{error}</div>}
                    <form onSubmit={handleSignIn}>
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
                                required 
                            />
                            <FontAwesomeIcon 
                                icon={showPassword ? faEyeSlash : faEye} 
                                className="eye-icon"
                                onClick={() => setShowPassword(!showPassword)} 
                            />
                        </div>

                        <button type="submit">Sign In</button>
                    </form>

                    <div className="sign-up-prompt">
                        <p>New user? <a href="/signup">Sign up</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;