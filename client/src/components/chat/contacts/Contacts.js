import Axios from 'axios'
import React, { useContext, useState } from 'react'
import { Button, ListGroup, Modal } from 'react-bootstrap'
import { AiFillMinusCircle } from 'react-icons/ai'
import ContactsContext from '../../../context/ContactsContext'
import UserContext from '../../../context/UserContext'
import './contacts.css'

export default function Contacts() {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState()
    const { userData } = useContext(UserContext)
    const { contacts } = useContext(ContactsContext)

    const deleteContact = async () => {
        try {
            await Axios.post(
                'http://localhost:5000/chat/delete-contact',
                {
                    userId: userData.id,
                    contactId: selectedContact.id
                }
            )
            closeModal()
        } catch (err) {
            console.log(err);
        }
    }

    function closeModal() {
        setModalOpen(false)
        setSelectedContact()
    }

    function openRemoveModal(contact) {
        setModalOpen(true)
        setSelectedContact(contact)
    }

    return (
        <ListGroup className="contacts-container" variant="flush">
            {contacts && contacts.map((contact, index) => {
                return (
                    <ListGroup.Item key={index} className="sContact border-bottom d-flex justify-content-between">
                        <span>
                            {contact.name}
                        </span>
                        <AiFillMinusCircle className="remove-contact-icon" onClick={() => openRemoveModal(contact)}/>
                        <Modal show={modalOpen} onHide={closeModal} >
                            <>
                                <Modal.Header className="leave-modal-header" closeButton>Remove contact</Modal.Header>
                                <Modal.Body className="leave-modal-body">
                                    <Modal.Title id="modal-title-leave">Are you sure you want to remove <br />{selectedContact && selectedContact.name}?</Modal.Title>
                                    <Button type="submit" id="button" className="cancel-button" onClick={closeModal}>Cancel</Button>
                                    <Button type="submit" id="button" className="leave-button" onClick={deleteContact}>Remove</Button>
                                </Modal.Body>
                            </>
                        </Modal>
                    </ListGroup.Item>
                )
            })}
        </ListGroup >
    )
}
