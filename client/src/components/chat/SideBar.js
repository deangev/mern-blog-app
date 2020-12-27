import React, { useContext, useState } from 'react'
import { Button, Modal, Nav, Tab } from 'react-bootstrap'
import Contacts from './contacts/Contacts';
import Conversations from './conversations/Conversations';
import NewContactModal from './contacts/NewContactModal';
import NewConversationModal from './conversations/NewConversationModal';
import './sidebar.css'
import UserContext from '../../context/UserContext'

export default function SideBar() {
    const [activeKey, setActiveKey] = useState('conversations');
    const [modalOpen, setModalOpen] = useState(false);
    const conversationsOpen = activeKey === 'conversations';

    const { userData } = useContext(UserContext)

    function closeModal() {
        setModalOpen(false)
    }

    return (
        <div className="sidebar-container d-flex flex-column">
            <Tab.Container className="tab-container" activeKey={activeKey} onSelect={setActiveKey}>
                <Nav variant="tabs" className="nav-links justify-content-center">
                    <Nav.Item>
                        <Nav.Link className="nav-link" eventKey='conversations' style={{ color: '#1877f2' }}>Conversations</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link className="nav-link" eventKey='contacts' style={{ color: '#1877f2' }}>Contacts</Nav.Link>
                    </Nav.Item>
                </Nav>
                <Tab.Content className="border-right overflow-auto flex-grow-1 tab-content">
                    <Tab.Pane eventKey='conversations'>
                        <Conversations />
                    </Tab.Pane>
                    <Tab.Pane eventKey='contacts'>
                        <Contacts />
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>

            <div className="my-id  border-top border-right small">
                Your Id: <span className="text-muted">{userData.id}</span>
            </div>
            <Button className="modal-button rounded-0" onClick={() => setModalOpen(true)} >
                New {conversationsOpen ? 'Conversation' : 'Contact'}
            </Button>

            <Modal show={modalOpen} onHide={closeModal}>
                {conversationsOpen ?
                    <NewConversationModal closeModal={closeModal} /> :
                    <NewContactModal closeModal={closeModal} />
                }
            </Modal>
        </div>
    )
}
