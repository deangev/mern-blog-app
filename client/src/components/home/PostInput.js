import React, { useState } from 'react';
import { useContext } from 'react';
import UserContext from '../../context/UserContext';
import { Button, Form } from 'react-bootstrap';
import Axios from 'axios';
import Errors from '../misc/Errors';
import './postInput.css';

export default function PostInput() {
    const [text, setText] = useState('');
    const [error, setError] = useState();
    const { userData } = useContext(UserContext)

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const time = new Date()
            let minutes = time.getMinutes()
            if (minutes < 10) {
                minutes = `0${minutes}`
            }
            const date = `${time.getHours()}:${minutes}, ${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()}`

            await Axios.post("http://localhost:5000/home/post",
                {
                    publisherId: userData.id,
                    content: text,
                    date: date
                }
            )

        } catch (err) {
            err.response.data.message && setError(err.response.data.message);
        }

        setText('')
    }


    return (
        <div id="left-container">
            <div id="input-container">
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <div className="form-group form-container">
                            <Form.Control
                                as="textarea"
                                row={8}
                                className="form-textarea"
                                placeholder={`Hello ${userData.name && userData.name.charAt(0).toUpperCase() + userData.name.slice(1)}, Share your thoughts with us!`}
                                value={text}
                                dir="auto"
                                required
                                maxLength="700"
                                onChange={e => setText(e.target.value)}
                            />
                        </div>
                        {error && (
                            <Errors message={error} />
                        )}
                        <Button
                            variant="outline-dark"
                            className="submit-button"
                            type="submit"
                        >
                            Post
                        </Button>
                        <div className='text-counter'>
                            {text.length} / 700
                        </div>
                    </Form.Group>
                </Form>
            </div>
        </div>
    )
}
