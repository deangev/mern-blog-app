import React, { useContext } from 'react';
import UserContext from '../../context/UserContext';
import PostInput from '../home/PostInput';
import Posts from '../home/Posts';
import Loading from './Loading';
import Login from '../auth/login/Login'

export default function Home() {
    const { userData } = useContext(UserContext);
    let token = localStorage.getItem('auth-token')

    return (
        <div style={{ backgroundColor: '#f0f2f5' }}>
            {token && userData.name &&
                <div>
                    <PostInput />
                    <Posts />
                </div>
            }
            {(token && userData.token === undefined) && <Loading />}
            {!token && <Login />}
        </div>
    )
}
