import React, { useEffect, useState } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import UserContext from './context/UserContext'
import Axios from 'axios'
import Login from './components/auth/login/Login';
import Register from './components/auth/register/Register';
import Navbar from './components/layout/Navbar';
import Home from './components/pages/Home'
import Chat from './components/pages/Chat';
import ContactsProvider from './context/ContactsContext'
import ConversationsProvider from './context/ConversationsContext'
import SocketProvider from './context/SocketProvider'
import PostsProvider from './context/PostsProvider'

export default function App() {
    const [userData, setUserData] = useState({
        token: undefined,
        name: undefined,
        id: undefined
    });

    const [contacts, setContacts] = useState();
    const [conversations, setConversations] = useState();
    const [selectedConversationIndex, setSelectedConversationIndex] = useState();
    const [selectedConversation, setSelectedConversation] = useState();
    const [posts, setPosts] = useState();

    const conversationValue = {
        conversations,
        setConversations,
        selectedConversationIndex,
        setSelectedConversationIndex,
        selectedConversation,
        setSelectedConversation
    };

    useEffect(() => {
        const checkLoggedIn = async () => {
            let token = localStorage.getItem('auth-token')
            if (token === null) {
                localStorage.setItem('auth-token', "")
                token = ""
            }
            const tokenRes = await Axios.post(
                "http://localhost:5000/users/tokenIsValid",
                null,
                { headers: { "x-auth-token": token } }
            )
            if (tokenRes.data) {
                const userRes = await Axios.get(
                    "http://localhost:5000/users/",
                    { headers: { "x-auth-token": token } }
                )
                setUserData({
                    token,
                    name: userRes.data.name,
                    id: userRes.data.id,
                    email: userRes.data.email
                })
            }
        }

        checkLoggedIn()
    }, [])

    useEffect(() => {
        const getContacts = async () => {
            let token = localStorage.getItem('auth-token');
            if (token) {
                let allContacts = await Axios.get(
                    "http://localhost:5000/chat/get-contacts",
                    { headers: { "x-auth-token": token } }
                );
                setContacts(allContacts.data)
            }
        }


        getContacts();
    }, [userData.email, contacts])

    useEffect(() => {
        const getConversations = async () => {
            let token = localStorage.getItem('auth-token');
            if (token) {
                let allConversations = await Axios.get(
                    "http://localhost:5000/chat/get-conversations",
                    { headers: { "x-auth-token": token } }
                );
                setConversations(allConversations.data)
            }
        }
        getConversations();
    }, [userData.email, conversations])

    useEffect(() => {
        const getPosts = async () => {
            let allPosts = await Axios.get(
                "http://localhost:5000/home/get-posts"
            )
            const postArray = allPosts.data.reverse();
            setPosts(postArray)
        }

        getPosts();
    }, [posts])

    return (
        <BrowserRouter>
            <UserContext.Provider value={{ userData, setUserData }}>
                <PostsProvider.Provider value={{ posts, setPosts }}>
                    <Navbar />
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route exact path="/login" component={Login} />
                        <Route exact path="/register" component={Register} />
                        <SocketProvider>
                            <ContactsProvider.Provider value={{ contacts, setContacts }}>
                                <ConversationsProvider.Provider value={conversationValue}>
                                    <Route exact path="/chat" component={Chat} />
                                </ConversationsProvider.Provider>
                            </ContactsProvider.Provider>
                        </SocketProvider>
                    </Switch>
                </PostsProvider.Provider>
            </UserContext.Provider>
        </BrowserRouter>
    )
}