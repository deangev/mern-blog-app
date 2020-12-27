import React, { useContext } from 'react'
import { ListGroup } from 'react-bootstrap'
import ConversationsContext from '../../../context/ConversationsContext'
import './conversations.css'

export default function Conversations() {
    const { conversations, selectedConversationIndex, setSelectedConversationIndex, setSelectedConversation } = useContext(ConversationsContext)

    function changeIndex(index) {
        setSelectedConversationIndex(index)
        const chosenConversation = conversations && conversations.filter(obj => {
            return obj.id === index
        })
        setSelectedConversation(chosenConversation)
    }

    return (
        <ListGroup className="conversations-container" variant="flush" >
            {conversations && conversations.map((conversation) => {
                return (
                    <ListGroup.Item
                        action
                        className="li"
                        key={conversation.id}
                        onClick={() => changeIndex(conversation.id)}
                        active={selectedConversationIndex === conversation.id}>
                        <span className="names">{conversation.name}</span>
                    </ListGroup.Item>
                )
            })}
        </ListGroup >
    )
}

// {conversation.contacts.map(r => r).join(', ')}