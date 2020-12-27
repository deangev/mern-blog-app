import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import UserContext from '../../../context/UserContext';
import Axios from 'axios';
import './register.css';
import Errors from '../../misc/Errors'

export default function Register() {
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [passwordCheck, setPasswordCheck] = useState();
    const [error, setError] = useState();

    const { setUserData } = useContext(UserContext)
    const history = useHistory()

    const submit = async (e) => {
        e.preventDefault();
        try {
            const newUser = { firstName, lastName, email, password, passwordCheck }
            await Axios.post(
                "http://localhost:5000/users/register",
                newUser
            );
            const loginRes = await Axios.post(
                "http://localhost:5000/users/login", {
                email,
                password
            });
            setUserData({
                token: loginRes.data.token,
                name: loginRes.data.name,
                id: loginRes.data.id,
                email: loginRes.data.email
            });
            localStorage.setItem("auth-token", loginRes.data.token)
            history.push('/')
        } catch (err) {
            err.response.data.message && setError(err.response.data.message);
        }
    }
    return (
        <div className="row justify-content-center" style={{ margin: 0 }}>
            <div className="register-container col-10 col-lg-4">
                <h2>Register</h2>
                <form className="form" onSubmit={submit}>
                    <div className="txt-field">
                        <input
                            id="register-first-name"
                            type="name"
                            dir="auto"
                            onChange={e => setFirstName(e.target.value)}
                        />
                        <span></span>
                        <label className="required" htmlFor="register-name">First name</label>
                    </div>
                    <div className="txt-field">
                        <input
                            id="register-last-name"
                            type="Last name"
                            dir="auto"
                            onChange={e => setLastName(e.target.value)}
                        />
                        <span></span>
                        <label className="required" htmlFor="register-name">Last name</label>
                    </div>
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
                    <div className="txt-field">
                        <input
                            id="register-password-check"
                            type="password"
                            dir="auto"
                            onChange={e => setPasswordCheck(e.target.value)}
                        />
                        <span></span>
                        <label className="required" htmlFor="register-password-check">Verify password</label>
                    </div>
                    {error && (
                            <Errors message={error}/>
                        )}
                    <input id="register-button" type="submit" value="Register" />

                </form>
            </div>
        </div>
    )
}
