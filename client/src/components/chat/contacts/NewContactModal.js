import React, { useContext, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import UserContext from '../../../context/UserContext';
import Axios from 'axios';
import Errors from '../../misc/Errors';
import { url } from '../../../context/urlProvider'
import './newContactModal.css';

export default function NewContactModal({ closeModal }) {
    const [id, setId] = useState();
    const [error, setError] = useState();
    const { userData } = useContext(UserContext)

    const submit = async (e) => {
        e.preventDefault();
        try {
            const myEmail = userData.email
            await Axios.post(`${url}/chat/contact`, {
                id,
                email: myEmail
            })
            closeModal()
        } catch (err) {
            err.response.data.message && setError(err.response.data.message);
        }
    }

    return (
        <>
            <Modal.Header className="contact-modal-header" closeButton>Create Contact</Modal.Header>
            <Modal.Body className="contact-modal-body">
                <Form onSubmit={submit}>
                    <Form.Group className="form-group">
                        <Form.Label>Id</Form.Label>
                        <Form.Control id="input" dir="auto" onChange={e => setId(e.target.value)} style={{ fontSize: '1.8rem' }} type="text" required />
                    </Form.Group>
                    {error && (
                        <Errors message={error} />
                    )}
                    <Button type="submit" id="button" className="create-button">Create</Button>
                </Form>
            </Modal.Body>
        </>
    )
}
