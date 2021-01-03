import React, { useState } from 'react';
import { useContext } from 'react';
import { Button, Card, Form, InputGroup } from 'react-bootstrap';
import * as FaIcons from "react-icons/fa";
import PostsProvider from '../../context/PostsProvider';
import UserContext from '../../context/UserContext';
import Axios from 'axios';
import './posts.css';

export default function Posts() {
    const [commentInput, setCommentInput] = useState()
    const [inputIndex, setInputIndex] = useState()
    const [showCommentsIndex, setShowCommentsIndex] = useState()
    const { posts } = useContext(PostsProvider)
    const { userData } = useContext(UserContext)

    const handleClick = async (e) => {
        try {
            await Axios.post(
                "http://localhost:5000/home/like",
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
                    "http://localhost:5000/home/comment",
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

    // console.log(posts);
    return (
        <div className="posts-container">
            <br /><br /><br /><br /><br /><br /><br />
            {posts && posts.map((post, index) => {
                return (
                    <Card key={index}>
                        <Card.Body className="card-component" style={{ position: 'relative' }}>
                            {post.publisher.profile ?
                                <img className="profile-img" src={post.publisher.profile} alt="image1" style={{ cursor: 'pointer', width: '4rem', height: '4rem', marginRight: '2rem', borderRadius: '50%' }}></img> :
                                <FaIcons.FaRegUserCircle className="user-icon-post" />
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
                                                    <img className="profile-img" src={post.comments[0].profile} alt="image1" style={{ cursor: 'pointer', width: '4rem', height: '4rem', marginRight: '2rem', borderRadius: '50%' }}></img> :
                                                    <FaIcons.FaRegUserCircle className="user-icon-post" />
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
                                                    <img className="profile-img" src={post.comments[1].profile} alt="image1" style={{ cursor: 'pointer', width: '4rem', height: '4rem', marginRight: '2rem', borderRadius: '50%' }}></img> :
                                                    <FaIcons.FaRegUserCircle className="user-icon-post" />
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
                                    {post.comments.length > 2 ?
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
                                                            <img className="profile-img" src={comment.profile} alt="image1" style={{ cursor: 'pointer', width: '4rem', height: '4rem', marginRight: '2rem', borderRadius: '50%' }}></img> :
                                                            <FaIcons.FaRegUserCircle className="user-icon-post" />
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
                    </Card>
                )
            })}
        </div >
    )
}
