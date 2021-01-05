import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom';
import { Nav } from 'react-bootstrap'
import './loggedNav.css'
import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md";
import * as GoIcons from "react-icons/go";
import UserContext from '../../../context/UserContext';
import ProfileContext from '../../../context/ProfileContext';

export default function LoggedNav() {
    const { userData, setUserData } = useContext(UserContext);
    const { availableFile } = useContext(ProfileContext)
    const history = useHistory();

    const chat = () => history.push('/chat')
    const profile = () => history.push('/profile')
    const logout = () => {
        setUserData({
            token: undefined,
            name: undefined,
            id: undefined,
            email: undefined,
            profile: undefined,
            gallery: undefined
        })
        localStorage.setItem('auth-token', '')
        history.push('/')
        // location.reload()
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
                {availableFile ?
                    <img className="profile-img-nav profile-img" onClick={profile} src={availableFile.imgURL} alt="image1" style={{cursor: 'pointer',  width: '4rem', height: '4rem', marginRight: '2rem', borderRadius: '50%' }}></img> :
                    <FaIcons.FaRegUserCircle className="user-icon" onClick={profile} style={{cursor: 'pointer'}}/>
                }
                <h3 className="user-name">{userData.name.charAt(0).toUpperCase() + userData.name.slice(1)}</h3>

                <button type="submit" className="" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><MdIcons.MdArrowDropDown className="dropdown-icon" /></button>
                <div className="dropdown-menu dropdown-menu-self" aria-labelledby="dropdownMenuButton">
                    <button onClick={logout} id="dropdown-item"><GoIcons.GoSignOut />Log Out</button>
                </div>
            </div>
        </div>
    )
}
