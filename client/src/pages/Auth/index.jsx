import "./styles.css"

import { useEffect, useState } from 'react'
import { postData } from '../../utils/api'
import { useNavigate } from 'react-router-dom'

export default function Auth() {

    const [inputs, setInputs] = useState({})
    const [loginError, setLoginError] = useState('')
    const [signupError, setSignupError] = useState('')

    const username = sessionStorage.getItem('username')

    const navigate = useNavigate()

    useEffect(() => {
        if (username) {
            navigate('/dashboard')
        }
    }, [])

    function authSuccess(username) {
        sessionStorage.setItem('username', username);
        setTimeout(() => { navigate('/dashboard') }, 1000);
    }

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }))
    }

    const handleLoginSubmit = async (event) => {
        event.preventDefault();
        if (inputs.loginUsername == null) {
            setLoginError('Username is required')
            return;
        }
        if (inputs.loginPassword == null) {
            setLoginError('Password is required')
            return;
        }
        const username = inputs.loginUsername
        const password = inputs.loginPassword

        const credentials = {
            username: username,
            password: password
        }

        const data = await postData('login', credentials)

        if (data.success) {
            authSuccess(username)
        } else {
            setLoginError(data.message)
        }
    }

    const handleSignUpSubmit = async (event) => {
        event.preventDefault();
        if (inputs.signupUsername == null) {
            setSignupError('Username is required')
            return;
        }
        if (inputs.signupPassword == null) {
            setSignupError('Password is required')
            return;
        }
        if (inputs.signupConfirmPassword == null) {
            setSignupError('Confirm Password is required')
            return;
        }
        if (inputs.signupPassword !== inputs.signupConfirmPassword) {
            setSignupError('Passwords do not match')
            return;
        }

        const username = inputs.signupUsername
        const password = inputs.signupPassword

        const credentials = {
            username: username,
            password: password
        }

        const data = await postData('signup', credentials)

        if (data.success) {
            authSuccess(username)
        } else {
            setSignupError(data.message)
        }
    }

    return (
        <div className="auth-container">
            <div className="login-container">
                <h1>Login</h1>
                <form className="login-form" onSubmit={handleLoginSubmit}>
                    <label htmlFor="username">Username</label>
                    <input type="text" id="login-username" name="loginUsername" onChange={handleChange} />
                    <label htmlFor="password">Password</label>
                    <input type="password" id="login-password" name="loginPassword" onChange={handleChange} />
                    <div className="error-message">
                        {loginError}
                    </div>
                    <button type="submit">Login</button>
                </form>
            </div>
            <div className="signup-container">
                <h1>Sign Up</h1>
                <form className="signup-form" onSubmit={handleSignUpSubmit}>
                    <label htmlFor="username">Username</label>
                    <input type="text" id="signup-username" name="signupUsername" onChange={handleChange} />
                    <label htmlFor="password">Password</label>
                    <input type="password" id="signup-password" name="signupPassword" onChange={handleChange} />
                    <label htmlFor="confirm-password">Confirm Password</label>
                    <input type="password" id="signup-confirm-password" name="signupConfirmPassword" onChange={handleChange} />
                    <div className="error-message">
                        {signupError}
                    </div>
                    <button type="submit">Sign Up</button>
                </form>
            </div>
        </div>
    )
}