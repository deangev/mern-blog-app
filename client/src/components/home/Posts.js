import React, { useState } from 'react';
import { useContext } from 'react';
import { Button, Card, Form, InputGroup, Modal } from 'react-bootstrap';
import * as FaIcons from "react-icons/fa";
import PostsProvider from '../../context/PostsProvider';
import UserContext from '../../context/UserContext';
import { url } from '../../context/urlProvider'
import Axios from 'axios';
import './posts.css';

export default function Posts() {
    const [commentInput, setCommentInput] = useState();
    const [inputIndex, setInputIndex] = useState();
    const [showCommentsIndex, setShowCommentsIndex] = useState();
    const { posts } = useContext(PostsProvider);
    const { userData } = useContext(UserContext);
    const [modalOpen, setModalOpen] = useState(false);
    const [profileModal, setProfileModal] = useState();

    const handleClick = async (e) => {
        try {
            await Axios.post(
                `${url}/home/like`,
                {
                    userId: userData.id,
                    postId: e.currentTarget.value
                }
            )
        } catch (err) {
            throw err
        }
    }

    const publishComment = async (e) => {
        try {
            e.preventDefault()
            if (commentInput !== '') {
                await Axios.post(
                    `${url}/home/comment`,
                    {
                        commenterId: userData.id,
                        postContent: commentInput,
                        postId: e.currentTarget.value
                    }
                )
                setCommentInput('');
                document.querySelectorAll('textarea')[inputIndex + 1].value = '';
            }
        } catch (err) {
            throw err
        }
    }

    const showProfile = async (index) => {
        try {
            const userProfile = await Axios.post(
                `${url}/users/getProfile`, {
                userId: index
            }
            )
            setProfileModal(userProfile.data)
            setModalOpen(true)
        } catch (err) {
            throw err
        }
    }

    function closeModal() {
        setModalOpen(false)
    }

    return (
        <div className="posts-container">
            <br /><br /><br /><br /><br /><br /><br />
            {posts && posts.map((post, index) => {
                return (
                    <Card key={index}>
                        <Card.Body className="card-component" style={{ position: 'relative' }}>
                            {post.publisher.profile ?
                                <img className="profile-img" onClick={() => showProfile(post.publisher.id)} src={post.publisher.profile} alt="image1" style={{ cursor: 'pointer', width: '4rem', height: '4rem', marginRight: '2rem', borderRadius: '50%' }}></img> :
                                <FaIcons.FaRegUserCircle className="user-icon-post" onClick={() => showProfile(post.publisher.id)} />
                            }
                            <Card.Title>{`${post.publisher.firstName.charAt(0).toUpperCase() + post.publisher.firstName.slice(1)} ${post.publisher.lastName.charAt(0).toUpperCase() + post.publisher.lastName.slice(1)}`}</Card.Title>
                            <Card.Subtitle id="time" className="mb-2 text-muted">{post.date}</Card.Subtitle>
                            <Card.Text id="content">{post.content}</Card.Text>
                            <div className='like-button-s'>
                                <Button value={post._id} onClick={handleClick} id={`${post.likes.includes(userData.id) ? 'like-button' : 'unliked-button'}`} variant="light">
                                    <p id="likes-length">{post.likes.length}</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-heart-fill" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
                                    </svg>
                                    <p id="like-p">Like</p>
                                </Button>
                            </div>
                            <div className="comments-container">
                                <div style={{ paddingBottom: '5rem' }}>
                                    {post.comments[0] &&
                                        <div className="single-comment">
                                            <div className="commenter-user-icon-container">
                                                {post.comments[0].profile ?
                                                    <img className="profile-img" src={post.comments[0].profile} onClick={() => showProfile(post.comments[0].id)} alt="image1" style={{ cursor: 'pointer', width: '4rem', height: '4rem', marginRight: '2rem', borderRadius: '50%' }}></img> :
                                                    <FaIcons.FaRegUserCircle className="user-icon-post" onClick={() => showProfile(post.comments[0].id)} />
                                                }
                                            </div>
                                            <div className="comment-content-name">
                                                <div className="commenter-name">
                                                    {`${post.comments[0].firstName.charAt(0).toUpperCase() + post.comments[0].firstName.slice(1)} ${post.comments[0].lastName.charAt(0).toUpperCase() + post.comments[0].lastName.slice(1)}`}
                                                </div>
                                                <div className="comment-content">
                                                    {post.comments[0].content}
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    {post.comments[1] &&
                                        <div className="single-comment">
                                            <div className="commenter-user-icon-container">
                                                {post.comments[1].profile ?
                                                    <img className="profile-img" src={post.comments[1].profile} onClick={() => showProfile(post.comments[1].id)} alt="image1" style={{ cursor: 'pointer', width: '4rem', height: '4rem', marginRight: '2rem', borderRadius: '50%' }}></img> :
                                                    <FaIcons.FaRegUserCircle className="user-icon-post" onClick={() => showProfile(post.comments[1].id)} />
                                                }
                                            </div>
                                            <div className="comment-content-name">
                                                <div className="commenter-name">
                                                    {`${post.comments[1].firstName.charAt(0).toUpperCase() + post.comments[1].firstName.slice(1)} ${post.comments[1].lastName.charAt(0).toUpperCase() + post.comments[1].lastName.slice(1)}`}
                                                </div>
                                                <div className="comment-content">
                                                    {post.comments[1].content}
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    {(showCommentsIndex !== index) && post.comments.length > 2 ?
                                        <div className="more-comments" onClick={() => {
                                            setShowCommentsIndex(index)
                                            document.querySelectorAll('.more-comments')[index].style.display = 'none'
                                        }}>
                                            View {post.comments.length - 2} more {post.comments.length === 3 ? 'comment' : 'comments'}
                                        </div>
                                        :
                                        <div className="more-comments" style={{ display: 'none' }}></div>
                                    }
                                    {
                                        posts[showCommentsIndex] && posts[showCommentsIndex] === post &&
                                        posts[showCommentsIndex].comments.map((comment, index) => {
                                            return (
                                                post.comments[0] !== comment && post.comments[1] !== comment
                                                &&
                                                <div className="single-comment" key={index}>
                                                    <div className="commenter-user-icon-container">
                                                        {comment.profile ?
                                                            <img className="profile-img" src={comment.profile} onClick={() => showProfile(post.comments[index].id)} alt="image1" style={{ cursor: 'pointer', width: '4rem', height: '4rem', marginRight: '2rem', borderRadius: '50%' }}></img> :
                                                            <FaIcons.FaRegUserCircle className="user-icon-post" onClick={() => showProfile(post.comments[index].id)} />
                                                        }
                                                    </div>
                                                    <div className="comment-content-name">
                                                        <div className="commenter-name">
                                                            {`${comment.firstName.charAt(0).toUpperCase() + comment.firstName.slice(1)} ${comment.lastName.charAt(0).toUpperCase() + comment.lastName.slice(1)}`}
                                                        </div>
                                                        <div className="comment-content">
                                                            {comment.content}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }

                                </div>
                                <div className="comment-form">
                                    <Form >
                                        <Form.Group>
                                            <InputGroup>
                                                <Form.Control
                                                    id='comment-input'
                                                    index={index}
                                                    as="textarea"
                                                    rows={1}
                                                    style={{ 'height': `${commentInput && commentInput.length > 37 && '6rem'}` }}
                                                    dir="auto"
                                                    onChange={e => setCommentInput(e.target.value)}
                                                    placeholder="Write a comment"
                                                />
                                                <InputGroup.Append>
                                                    <Button type="submit" id="comment-button" onFocus={() => setInputIndex(index)} onClick={publishComment} value={post._id} index={index}>Comment</Button>
                                                </InputGroup.Append>
                                            </InputGroup>
                                        </Form.Group>
                                    </Form>
                                </div>
                            </div>
                        </Card.Body>
                        <Modal className="profile-modal" show={modalOpen} onHide={closeModal}>
                            <>
                                <Modal.Body className="profile-modal-body">
                                    {profileModal &&
                                        <div>
                                            <div className="border-bottom">
                                                <div className="profile-modal-img-container">
                                                    {profileModal.profile ?
                                                        <img className="profile-modal-img" src={profileModal.profile.imgURL && profileModal.profile.imgURL} alt="image1"></img> :
                                                        <FaIcons.FaRegUserCircle className="profile-modal-img" style={{width: '8rem', height: '8rem', color: '#1877f2'}}/>
                                                    }
                                                </div>
                                                <div className="profile-modal-name-container">
                                                    <h2>{profileModal.firstName.charAt(0).toUpperCase()}{profileModal.firstName.slice(1)} {profileModal.lastName.charAt(0).toUpperCase()}{profileModal.lastName.slice(1)}</h2>
                                                </div>
                                            </div>
                                            <div className="profile-modal-gallery-container text-muted">
                                                {profileModal.gallery.length > 0 ?
                                                    <div>
                                                        <h1 style={{ color: 'black', fontSize: '2rem', marginBottom: '4rem' }}>Gallery</h1>
                                                        {profileModal.gallery.map((photo, index) => {
                                                            return (
                                                                <img key={index} className="profile-modal-gallery-img" src={photo.imgURL} alt="image1"></img>
                                                            )
                                                        })}
                                                    </div> :
                                                    <div style={{ textAlign: 'center' }}>
                                                        {`${profileModal.firstName.charAt(0).toUpperCase()}${profileModal.firstName.slice(1)} ${profileModal.lastName.charAt(0).toUpperCase()}${profileModal.lastName.slice(1)}'s gallery is empty`}
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    }
                                </Modal.Body>
                            </>
                        </Modal>
                    </Card>
                )
            })}
        </div >
    )
}
