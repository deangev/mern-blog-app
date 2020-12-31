import Axios from 'axios';
import React, { useContext, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import ContactsContext from '../../../context/ContactsContext';
import UserContext from '../../../context/UserContext';
import Errors from '../../misc/Errors';
import './newConversationModal.css'

export default function NewConversationModal({ closeModal }) {
    const { userData } = useContext(UserContext)
    const myUser = { id: userData.id, name: userData.name }
    const [selectedContactIds, setSelectedContactIds] = useState([myUser])
    const { contacts } = useContext(ContactsContext)
    const [error, setError] = useState();
    const [conversationName, setConversationName] = useState()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const createConversation = async (req, res) => {
            try {
                await Axios.post("http://localhost:5000/chat/conversation", {
                    name: conversationName,
                    contacts: selectedContactIds
                })
                closeModal()
            } catch (err) {
                err.response.data.message && setError(err.response.data.message);
            }
        }
        createConversation()
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


    return (
        <>
            <Modal.Header className="conversations-modal-header" closeButton>Create Conversation</Modal.Header>
            <Modal.Body className="conversations-modal-body">
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="conversation-name-form">
                        <Form.Label>Conversation name</Form.Label>
                        <Form.Control onChange={(e) => setConversationName(e.target.value)} required id="conversation-input" type="text"/>
                    </Form.Group>
                    {contacts.map(contact => (
                        <Form.Group controlId={contact.id} key={contact.id}>
                            <Form.Check
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
                    <Button className="create-button" type="submit">Create</Button>
                    
                </Form>
            </Modal.Body>
        </>
    )
}
