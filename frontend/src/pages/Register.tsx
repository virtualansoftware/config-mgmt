import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GITHUB_CLIENT_ID, GITHUB_REDIRECT_URI } from '../constants';

export default function Register(){
    const[username, setUsername] = useState("");
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    const[confirm, setConfirm] = useState("");
    const[errorMessage, setErrorMessage] = useState("");
    const[showPassword, setShowPassword] = useState(false);
    const[showConfirm, setShowConfirm] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e:any) => {
        e.preventDefault();

        if(!username || !email || !password || !confirm){
            setErrorMessage("please fill in this field");
        } else {
            navigate("/config-mgmt");
            toast.success("Account created successfully!");
        }
    };

    const handleGitHubLogin = () => {
        const clientId = GITHUB_CLIENT_ID;
        const redirectUri = encodeURIComponent(GITHUB_REDIRECT_URI);
        const scope = "read:user user:email";
        const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
        window.location.href = githubAuthUrl;
    };
    
    return (
        <div className="register-page">
            <div className="register-container">
                <form onSubmit={handleSubmit}>
                    <h2>Sign up</h2>
                    <div className="username">
                        <label>Username</label><br/>
                        <input 
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={!username && errorMessage ? 'error-input' : ''}
                        />
                        {!username && <p className="errorMsg">{errorMessage}</p>}
                    </div>
                    <div className="email">
                        <label>Email</label><br/>
                        <input 
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={!email && errorMessage ? 'error-input' : ''}
                        />
                        {!email && <p className="errorMsg">{errorMessage}</p>}
                    </div>
                    <div className="password" style={{ position: 'relative' }}>
                        <label>Password</label>
                        <input 
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={!password && errorMessage ? 'error-input' : ''}
                        />
                        <span onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <i className="fa-solid fa-eye"></i> : <i className="fa-solid fa-eye-slash"></i>}
                        </span>
                        {!password && <p className="errorMsg">{errorMessage}</p>}
                    </div>
                    <div className="confirm" style={{ position: 'relative' }}>
                        <label>Confirm Password</label>
                        <input 
                            type={showConfirm ? 'text' : 'password'}
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            className={!confirm && errorMessage ? 'error-input' : ''}
                        />
                        <span onClick={() => setShowConfirm(!showConfirm)}>
                            {showConfirm ? <i className="fa-solid fa-eye"></i> : <i className="fa-solid fa-eye-slash"></i>}
                        </span>
                        {!confirm && <p className="errorMsg">{errorMessage}</p>}
                    </div>
                    <button className="btn btn-primary">Sign up</button><hr/>
                </form>
                <div className="githubLogin">
                    <button onClick={handleGitHubLogin}><i className="fa-brands fa-github"></i> Sign in with Github</button>
                </div>
                <p className="login">
                    Already have an account?
                    <Link to="/login">Login</Link>
                </p>
                <p className="rights">
                    © Virtualan Software, LLC. All rights reserved. | www.virtualansoftware.com | Privacy Policy
                </p>
            </div>
        </div>
    )
}