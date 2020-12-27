import React, { useContext, useState } from 'react'
import { useHistory, Link } from 'react-router-dom'
import UserContext from '../../../context/UserContext'
import './login.css'
import Errors from '../../misc/Errors'
import Axios from 'axios'

export default function Login() {
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [error, setError] = useState();

    const { setUserData } = useContext(UserContext)
    const history = useHistory();

    const submit = async (e) => {
        e.preventDefault()
        try {
            const loginUser = { email, password };
            const loginRes = await Axios.post(
                "http://localhost:5000/users/login",
                loginUser
            );
            setUserData({
                token: loginRes.data.token,
                name: loginRes.data.name,
                id: loginRes.data.id,
                email: loginRes.data.email
            });
            localStorage.setItem('auth-token', loginRes.data.token)
            history.push('/')
        } catch (err) {
            err.response.data.message && setError(err.response.data.message);
        }
    }

    return (
        <div className="row justify-content-center" style={{ margin: 0 }}>
            <div className="login-container col-10 col-lg-4">
                <h2>Login</h2>
                <form className="form" onSubmit={submit}>
                    <div className="txt-field">
                        <input
                            id="register-email"
                            type="email"
                            dir="auto"
                            onChange={e => setEmail(e.target.value)}
                        />
                        <span></span>
                        <label className="required" htmlFor="register-email">Email</label>
                    </div>
                    <div className="txt-field">
                        <input
                            id="register-password"
                            type="password"
                            dir="auto"
                            onChange={e => setPassword(e.target.value)}
                        />
                        <span></span>
                        <label className="required" htmlFor="register-password">Password</label>
                    </div>
                    {error && (
                        <Errors message={error} />
                    )}
                    <input id="login-button" type="submit" value="Log in" />
                    <div className="register">
                        <Link to="/register">
                            <p>Not a member? Register</p>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
