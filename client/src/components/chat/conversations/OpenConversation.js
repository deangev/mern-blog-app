import React, { useState, useCallback, useEffect } from 'react';
import { Button, Form, InputGroup, Modal } from 'react-bootstrap';
import Axios from 'axios';
import { useContext } from 'react';
import UserContext from '../../../context/UserContext';
import ConversationsContext from '../../../context/ConversationsContext';
import './openConversation.css'
import { useSocket } from '../../../context/SocketProvider';
import { FaCrown } from 'react-icons/fa'
import { AiFillMinusCircle } from 'react-icons/ai'

export default function OpenConversation() {
    const [text, setText] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [modalOpen2, setModalOpen2] = useState(false);
    const [removeUser, setRemoveUser] = useState();
    const { userData } = useContext(UserContext);
    const { conversations, selectedConversation, setSelectedConversation } = useContext(ConversationsContext)
    const socket = useSocket()

    const setRef = useCallback(node => {
        if (node) {
            node.scrollIntoView({ smooth: true })
        }
    }, [])


    const addMessageToConversation = useCallback(({ conversationRec, senderName, senderId, text }) => {

        if (selectedConversation[0].id === conversationRec) {
            if (userData.id !== senderId) {
                selectedConversation[0].messages.push({
                    _id: selectedConversation[0].id,
                    senderId: senderId,
                    senderName: senderName,
                    content: text
                })
            }
            return null
        }
        else {
            return null
        }

    }, [selectedConversation, userData.id])

    /////////////////
    useEffect(() => {
        if (socket == null) return

        socket.on('receive-message', addMessageToConversation)


        return () => socket.off('receive-message')
    }, [socket, addMessageToConversation])
    /////////////////

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let senderName = userData.name
            let conversationRec = selectedConversation[0].id
            socket.emit('send-message', { conversationRec, senderName, text })
            await Axios.post(
                'http://localhost:5000/chat/message',
                {
                    senderId: userData.id,
                    senderName: userData.name,
                    content: text,
                    conversation: selectedConversation[0].id
                }
            )
            selectedConversation[0].messages.push({
                senderId: userData.id,
                senderName: userData.name,
                content: text,
                conversation: selectedConversation[0].id,
                fromMe: true
            })
            document.getElementById('chat-input').value = ''
            setText('')
        } catch (err) {
            console.log(err);
        }
    }

    conversations && conversations.map(conversation => {
        conversation.messages.map(message => {
            const fromMe = userData.id === message.senderId;
            message['fromMe'] = fromMe;
            return fromMe;
        })
        return { ...conversation };
    })

    function sendMessageEnter(e) {
        // e.preventDefault()
        if (e.keyCode === 13) {
            if (text !== '') {
                handleSubmit(e);
                document.getElementById('chat-input').value = ''
            }
        }
    }

    function closeModal() {
        setModalOpen(false)
    }

    function closeModal2() {
        setModalOpen2(false)
    }


    function openRemoveModal(id) {
        setModalOpen2(true)
        setRemoveUser(id)
    }

    const removeConversationContact = async (index) => {
        try {
            selectedConversation[0].contacts.splice(index, 1)
            await Axios.post(
                'http://localhost:5000/chat/delete-conversation-contact',
                {
                    userId: removeUser.id,
                    conversationId: selectedConversation[0].id
                }
            )
            setRemoveUser()
            closeModal2()
        } catch (err) {
            console.log(err);
        }
    }

    const deleteConversation = async (e) => {
        e.preventDefault()
        try {
            Axios.post(
                "http://localhost:5000/chat/delete-conversation",
                {
                    userId: userData.id,
                    conversationId: selectedConversation[0].id
                }
            )
            closeModal()
            setSelectedConversation()
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="conversation-chat-container d-flex flex-column">

            <div className="flex-grow-1 overflow-auto chat-container">
                <div className="messages-container d-flex flex-column align-items-start justify-content-end px-3">
                    {selectedConversation && selectedConversation[0].messages.map((message, index) => {
                        const lastMessage = selectedConversation && selectedConversation[0].messages.length - 1 === index
                        return (
                            <div ref={lastMessage ? setRef : null} key={index} className={`text-message my-1 d-flex flex-column ${message.fromMe ? 'align-self-end' : 'align-self-start'}`}>
                                <div className={`rounded px-2 py-1 ${message.fromMe ? 'bg-primary text-white' : 'border'}`}>{message.content}</div>
                                <div className={`text-mutes small ${message.fromMe ? 'text-right' : ''}`}>{message.fromMe ? 'You' : message.senderName}</div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <Form className="chat-input" onSubmit={handleSubmit}>
                <Form.Group className="m-5">
                    <InputGroup>
                        <Form.Control
                            id="chat-input"
                            required
                            onKeyDown={e => sendMessageEnter(e)}
                            dir="auto"
                            onChange={e => setText(e.target.value)}
                            style={{ height: '5.5rem', resize: 'none', fontSize: '3rem' }}
                        >
                        </Form.Control>
                        <InputGroup.Append id="chat-input-button">
                            <Button type="submit" style={{ fontSize: '2.3rem', width: '15rem' }}>Send</Button>
                        </InputGroup.Append>
                    </InputGroup>
                </Form.Group>
            </Form>
            <div className="conversation-contacts-list ">
                <div style={{ position: 'relative', height: '100%', width: '100%' }}>
                    <div className="conversation-contacts-list2">
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'relative' }}>
                                <h1>Contacts</h1>
                            </div>
                            <div className="all-conversation-contacts flex-grow-1 overflow-auto">
                                {selectedConversation && selectedConversation[0].contacts.map((contact, index) => {
                                    return (
                                        <div key={index} className="conversation-contact d-flex justify-content-between">
                                            {contact.name.charAt(0).toUpperCase() + contact.name.slice(1)}
                                            <div className="crown-minus-icon pr-5">
                                                {selectedConversation[0].contacts[0].id === contact.id ?
                                                    <FaCrown style={{color: '#fbbc05'}}/> :
                                                    selectedConversation[0].contacts[0].id === userData.id && <AiFillMinusCircle onClick={() => openRemoveModal(contact)} className="minus-icon-contacts" />
                                                }
                                                <Modal show={modalOpen2} onHide={closeModal2} >
                                                    <>
                                                        <Modal.Header className="leave-modal-header" closeButton>Leave conversation</Modal.Header>
                                                        <Modal.Body className="leave-modal-body">
                                                            <Modal.Title id="modal-title-leave">Are you sure you want to remove <br />{removeUser && removeUser.name}?</Modal.Title>
                                                            <Button type="submit" id="button" className="cancel-button" onClick={() => setRemoveUser(index)}>Cancel</Button>
                                                            <Button type="submit" onClick={() => removeConversationContact(index)} id="button" className="leave-button">Remove</Button>
                                                        </Modal.Body>
                                                    </>
                                                </Modal>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>


                            <Modal show={modalOpen} onHide={closeModal} >
                                <>
                                    <Modal.Header className="leave-modal-header" closeButton>Leave conversation</Modal.Header>
                                    <Modal.Body className="leave-modal-body">
                                        <Modal.Title id="modal-title-leave">Are you sure you want to leave the <br />conversation?</Modal.Title>
                                        <Button type="submit" id="button" className="cancel-button" onClick={closeModal}>Cancel</Button>
                                        <Button type="submit" onClick={deleteConversation} id="button" className="leave-button">Leave</Button>
                                    </Modal.Body>
                                </>
                            </Modal>
                        </div>
                    </div>
                    <Button id="leave-conversation-button" className="rounded-0" onClick={() => setModalOpen(true)}>
                        Leave conversation
                    </Button>
                </div>
            </div>
        </div>
    )
}