import React, { useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'
import UserContext from './UserContext'

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
            'http://localhost:5000',
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