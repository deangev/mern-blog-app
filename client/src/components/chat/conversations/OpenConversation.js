import React, { useState, useCallback, useEffect } from 'react';
import { Button, Form, InputGroup, Modal } from 'react-bootstrap';
import Axios from 'axios';
import { useContext } from 'react';
import UserContext from '../../../context/UserContext';
import ConversationsContext from '../../../context/ConversationsContext';
import './openConversation.css'
import { useSocket } from '../../../context/SocketProvider';
import { FaCrown } from 'react-icons/fa'
import { AiFillMinusCircle, AiOutlineSend } from 'react-icons/ai'
import ContactsContext from '../../../context/ContactsContext';
import { url } from '../../../context/urlProvider'
import Errors from '../../misc/Errors';

export default function OpenConversation() {
    const [text, setText] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [modalOpen2, setModalOpen2] = useState(false);
    const [modalOpen3, setModalOpen3] = useState(false);
    const [removeUser, setRemoveUser] = useState();
    const { userData } = useContext(UserContext);
    const [selectedContactIds, setSelectedContactIds] = useState([]);
    const { conversations, setConversations, selectedConversation, setSelectedConversation } = useContext(ConversationsContext);
    const { contacts } = useContext(ContactsContext);
    const [error, setError] = useState();
    const socket = useSocket();

    const setRef = useCallback(node => {
        if (node) {
            node.scrollIntoView({ smooth: true })
        }
    }, [])

    const handleSubmitContact = async (e) => {
        e.preventDefault()
        const addContactToConversation = async (req, res) => {
            try {
                console.log(selectedContactIds);
                closeModal3()
                await Axios.post(`${url}/chat/add-contacts-to-conversation`, {
                    contacts: selectedContactIds,
                    conversationId: selectedConversation[0].id
                })

            } catch (err) {
                err.response.data.message && setError(err.response.data.message);
            }
        }
        selectedContactIds.map(obj => (
            selectedConversation[0].contacts.push(obj)
        ))
        setSelectedContactIds([])
        addContactToConversation()
    }

    function handleCheckboxChange(contactId) {
        setSelectedContactIds(prevSelectedContactIds => {
            if (prevSelectedContactIds.includes(contactId.id)) {
                return prevSelectedContactIds.filter(prevId => {
                    return contactId.id !== prevId
                })
            } else {
                return [...prevSelectedContactIds, contactId]
            }
        })
    }

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

    ///////////////
    useEffect(() => {
        if (socket == null) return

        socket.on('receive-message', addMessageToConversation)


        return () => socket.off('receive-message')
    }, [socket, addMessageToConversation])
    ///////////////

    useEffect(() => {
        const getConversations = async () => {
            let token = localStorage.getItem('auth-token');
            if (token) {
                let allConversations = await Axios.get(
                    `${url}/chat/get-conversations`,
                    { headers: { "x-auth-token": token } }
                );
                setConversations(allConversations.data)
            }
        }
        getConversations();
    }, [userData.email, setConversations])

    //////////////////////
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let senderName = userData.name
            let conversationRec = selectedConversation[0].id
            socket.emit('send-message', { conversationRec, senderName, text })
            await Axios.post(
                `${url}/chat/message`,
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

    function closeModal3() {
        setModalOpen3(false)
    }


    function openRemoveModal(id) {
        setModalOpen2(true)
        setRemoveUser(id)
    }

    const removeConversationContact = async (index) => {
        try {
            selectedConversation[0].contacts.splice(index, 1)
            closeModal2()
            await Axios.post(
                `${url}/chat/delete-conversation-contact`,
                {
                    userId: removeUser.id,
                    conversationId: selectedConversation[0].id
                }
            )
            setRemoveUser()
        } catch (err) {
            console.log(err);
        }
    }

    const deleteConversation = async (e) => {
        e.preventDefault()
        try {
            Axios.post(
                `${url}/chat/delete-conversation`,
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
                            <div ref={lastMessage ? setRef : null} key={index} className={`text-message  d-flex flex-column ${message.fromMe ? 'align-self-end' : 'align-self-start'}`}>
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
                            <Button type="submit" style={{ fontSize: '2.3rem', width: '6rem' }}><AiOutlineSend /></Button>
                        </InputGroup.Append>
                    </InputGroup>
                </Form.Group>
            </Form>
            <div className="conversation-contacts-list ">
                <div style={{ position: 'relative', height: '100%', width: '100%' }}>
                    <div className="conversation-contacts-list2">
                        <div style={{ position: 'relative', height: '83%' }}>
                            <div style={{ position: 'relative' }}>
                                <h1>Contacts</h1>
                            </div>
                            <div className="all-conversation-contacts flex-grow-1 overflow-auto">
                                {selectedConversation && selectedConversation[0].contacts.map((contact, index) => {
                                    return (
                                        <div key={index} className="conversation-contact d-flex justify-content-between">
                                            {contact.name && contact.name.charAt(0).toUpperCase() + contact.name.slice(1)}
                                            <div className="crown-minus-icon pr-5">
                                                {selectedConversation[0].contacts[0].id === contact.id ?
                                                    <FaCrown style={{ color: '#fbbc05' }} /> :
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
                    <div className="conversations-buttons">
                        {selectedConversation[0].contacts[0].id === userData.id && <Button id="add-contacts-button" variant="outline-success" onClick={() => setModalOpen3(true)}>
                            Add contacts
                        </Button>}

                        <Button id="leave-conversation-button" variant="outline-danger" className='rounded-0' style={{ position: `${selectedConversation[0].contacts[0].id !== userData.id && 'absolute'}`, bottom: `${selectedConversation[0].contacts[0].id !== userData.id && '0'}`, left: `${selectedConversation[0].contacts[0].id !== userData.id && '0'}` }} onClick={() => setModalOpen(true)}>
                            Leave conversation
                        </Button>
                    </div>


                    <Modal show={modalOpen3} onHide={closeModal3} >
                        <>
                            <Modal.Header className="leave-modal-header" closeButton>Add contact</Modal.Header>
                            <Modal.Body className="leave-modal-body">
                                <Form onSubmit={handleSubmitContact}>
                                    {contacts.map(contact => (
                                        selectedConversation[0].contacts.some(c => c.id === contact.id) ? null :
                                            <Form.Group controlId={contact.id} key={contact.id}>
                                                <Form.Check
                                                    style={{ fontSize: '1.9rem', color: '#1877f2', paddingLeft: '2.4rem' }}
                                                    type="checkbox"
                                                    value={selectedContactIds.includes(contact.id)}
                                                    label={contact.name}
                                                    onChange={() => handleCheckboxChange({ id: contact.id, name: contact.name })}
                                                />
                                            </Form.Group>
                                    ))}
                                    {error && (
                                        <Errors message={error} />
                                    )}
                                    <Button type="submit" id="button" className="cancel-button" onClick={closeModal3}>Cancel</Button>
                                    <Button className="add-contact-button" type="submit">Add</Button>
                                </Form>
                            </Modal.Body>
                        </>
                    </Modal>
                </div>
            </div>
        </div>
    )
}