import React, { useContext } from 'react'
import UnLoggedNav from './unLoggedNav/UnLoggedNav';
import UserContext from '../../context/UserContext'
import * as io from 'react-icons/io';
import { Link } from 'react-router-dom'
import './navbar.css'
import LoggedNav from './loggedNav/LoggedNav';

export default function Navbar() {
    const { userData } = useContext(UserContext);
    let token = localStorage.getItem('auth-token')


    return (
        <div className="navbar-container" style={{ margin: 0 }}>
            <Link to="/"><span className="home-icon d-flex justify-self-center"><io.IoMdHome className="icon" /></span></Link>
            {token && userData.name ?
                <LoggedNav /> :
                <UnLoggedNav />
            }

        </div>
    )
}
