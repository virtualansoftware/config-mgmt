import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GITHUB_CLIENT_ID, GITHUB_REDIRECT_URI } from '../constants';

export default function Login(){
    const[username, setUsername] = useState("");
    const[password, setPassword] = useState("");
    const[errorMessage, setErrorMessage] = useState("");
    const[showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e:any) => {
        e.preventDefault();

        if(!username || !password){
            setErrorMessage("please fill in this field");
        } else {
            navigate("/config-mgmt");
            toast.success("Login successful!");
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
        <div className="login-page">
            <div className="login-container">
                <form onSubmit={handleSubmit}>
                    <h2>Login</h2>
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
                    <div className="password" style={{ position: 'relative' }}>
                        <div>
                            <label>Password</label>
                            <Link to="/">Forgot password?</Link>
                        </div>
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
                    <div className="checkbox">
                        <input type="checkbox" id="rememberMe" />
                        <label htmlFor="rememberMe">Remember me</label>
                    </div>
                    <button className="btn btn-primary">Login</button><hr/>
                </form>
                <div className="githubLogin">
                    <button onClick={handleGitHubLogin}><i className="fa-brands fa-github"></i> Sign in with Github</button>
                </div>
                <p className="register">
                    Don't have an account?
                    <Link to="/register">Sign Up</Link>
                </p>
                <p className="rights">
                    © Virtualan Software, LLC. All rights reserved. | www.virtualansoftware.com | Privacy Policy
                </p>
            </div>
        </div>
    )
}