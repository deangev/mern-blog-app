import React, { useContext } from 'react'
import UserContext from '../../context/UserContext'
import PostInput from '../home/PostInput'
import Posts from '../home/Posts'

export default function Home() {
    const { userData } = useContext(UserContext);

    return (
        <div style={{ backgroundColor: '#f0f2f5' }}>
            {userData.name &&
                <div>
                    <PostInput />
                    <Posts />
                </div>
            }
        </div>
    )
}
