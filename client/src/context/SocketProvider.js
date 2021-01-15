import React, { useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'
import UserContext from './UserContext'
import { url } from '../context/urlProvider'

const SocketContext = React.createContext()

export function useSocket() {
    return useContext(SocketContext)
}

export default function SocketProvider({ children }) {
    const [socket, setSocket] = useState()
    const { userData } = useContext(UserContext)
    let id = userData.id

    useEffect(() => {
        const newSocket = io(
            `${url}`,
            { query: { id } }
        )
        setSocket(newSocket)

        return () => newSocket.close()
    }, [id])

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}