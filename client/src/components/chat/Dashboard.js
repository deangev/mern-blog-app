import React, { useContext } from 'react'
import ConversationsContext from '../../context/ConversationsContext'
import OpenConversation from './conversations/OpenConversation'
import SideBar from './SideBar'
import './sidebar.css'

export default function Dashboard() {
    const {selectedConversation} = useContext(ConversationsContext)

    return (
        <div className="dashboard-container d-flex" style={{ position: 'relative', height: '100vh' }}>
            <SideBar />
            {selectedConversation && <OpenConversation />}
        </div>
    )
}
