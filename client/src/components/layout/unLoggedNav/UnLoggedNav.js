import React from 'react'
import {Nav} from 'react-bootstrap'
import './unLoggedNav.css'

export default function UnLoggedNav() {
    return (
        <Nav className="navbar justify-content-end">
            <Nav.Item className="mr-4">
                <Nav.Link className="option" href="/register">Register</Nav.Link>
            </Nav.Item>
            <Nav.Item className="mr-5">
                <Nav.Link className="option" href="/login">Login</Nav.Link>
            </Nav.Item>
        </Nav>
    )
}
