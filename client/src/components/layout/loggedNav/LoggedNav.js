import React, { useContext } from 'react'
import {useHistory} from 'react-router-dom';
import { Nav } from 'react-bootstrap'
import './loggedNav.css'
import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md";
import * as GoIcons from "react-icons/go";
import UserContext from '../../../context/UserContext'

export default function LoggedNav() {
    const { userData, setUserData } = useContext(UserContext);
    const history = useHistory();

    const chat = () => history.push('/chat')
    const profile = () => history.push('/profile')
    const logout = () => {
        setUserData({
            token: undefined,
            name: undefined,
            id: undefined
        })
        localStorage.setItem('auth-token', '')
        history.push('/')
    }

    return (
        <div className="d-flex logged-container">
            <Nav>
                <Nav.Item>
                    <Nav.Link className="option" onClick={profile}>Profile</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link className="option" onClick={chat}>Chat</Nav.Link>
                </Nav.Item>
            </Nav>

            <div className="user-info d-flex">
                <FaIcons.FaRegUserCircle className="user-icon" />
                <h3 className="user-name">{userData.name.charAt(0).toUpperCase() + userData.name.slice(1)}</h3>

                <button type="submit" className="" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><MdIcons.MdArrowDropDown className="dropdown-icon" /></button>
                <div className="dropdown-menu dropdown-menu-self" aria-labelledby="dropdownMenuButton">
                    <button onClick={logout} id="dropdown-item"><GoIcons.GoSignOut />Log Out</button>
                </div>
            </div>
        </div>
    )
}
