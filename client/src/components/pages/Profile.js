import React, { useContext } from 'react'
import UserContext from '../../context/UserContext';
import Gallery from '../profile/Gallery';
import MyProfile from '../profile/MyProfile';
import Loading from './Loading';

export default function Profile() {
    const { userData } = useContext(UserContext);
    let token = localStorage.getItem('auth-token');

    return (

        <div className="d-flex" style={{ height: '100vh' }}>
            {token && userData.gallery &&
                <div className="d-flex" style={{ height: '100vh', width: '100%' }}>
                    <MyProfile />
                    <Gallery />
                </div>
            }
            {(token && userData.token === undefined) && <Loading />}
        </div>
    )
}

