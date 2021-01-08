import React, { useContext } from 'react'
import UserContext from '../../context/UserContext';
import Dashboard from '../chat/Dashboard'
import Loading from './Loading'

export default function Chat() {
    const { userData } = useContext(UserContext);
    let token = localStorage.getItem('auth-token')

    return (
        <div>
            {(token && userData.token === undefined) && <Loading />}        
            {token && userData.token !== undefined && <Dashboard />}        
        </div>
    )
}
