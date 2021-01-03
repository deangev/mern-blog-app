import React from 'react'
import Gallery from '../profile/Gallery'
import MyProfile from '../profile/MyProfile'

export default function Profile() {

    return (
        <div className="d-flex" style={{height: '100vh'}}>
            <MyProfile />
            <Gallery />
        </div>
    )
}

