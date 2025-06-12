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

        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === emailInput && u.password === passwordInput);

        if (user) {
            localStorage.setItem("username", user.name);
            localStorage.setItem("useremail", user.email);
            navigate("/dashboard");
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

                .sign-up-prompt p {
                    margin-top: 15px;
                    font-size: 0.9rem;
                    text-align: center;
                }

                .sign-up-prompt a {
                    color: #3498db;
                    text-decoration: none;
                }

                .sign-up-prompt a:hover {
                    text-decoration: underline;
                }

                .error-message {
                    color: red;
                    margin-bottom: 15px;
                }
            `}</style>

            <div className="auth-box">
                <div className="auth-left">
                    <FontAwesomeIcon icon={faSignature} className="auth-left-icon" />
                </div>
                <div className="auth-right">
                    <img src="src/assets/CloudbyzLogo.png" alt="Cbyz Logo" />
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