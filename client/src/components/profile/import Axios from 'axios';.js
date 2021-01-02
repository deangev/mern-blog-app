import Axios from 'axios';
import React, { useState, useContext } from 'react';
import ProfileContext from '../../context/ProfileContext';
import UserContext from '../../context/UserContext';
import './myProfile.css';

export default function MyProfile() {
    const [file, setFile] = useState()
    const { userData } = useContext(UserContext)

    // const uploadImage = async (e) => {
    //     e.preventDefault()
    //     const data = new FormData()
    //     data.append("file", file);
    //     data.append("userId", userData.id)
    //     await Axios.post("http://localhost:5000/images/upload", data)
    //     const image = await Axios.post("http://localhost:5000/images/images", {
    //         userId: userData.id
    //     })
    // }
    console.log(userData.profile && userData.profile[0].img.data);
    return (
        <div className="profile-container ">
            <div className="profile-img-container d-flex justify-content-center">
                {userData.profile && <img className="profile-img" src={`data:image/jpeg;base64,${userData.profile[0].img.data}`} alt="image1" style={{ width: '20rem', borderRadius: '50%' }}></img>}
            </div>
            <form className="form-container-profile" style={{ marginTop: '10rem' }}>
                <label htmlFor="file" className="btn d-flex justify-content-center" id="update-profile-button">Update profile picture</label>
                <input id="file" accept="image/*" style={{ visibility: "hidden" }} type="file" onChange={event => {
                    setFile(event.target.files[0])
                }} />
                {/* <button onClick={uploadImage}>Upload</button> */}
            </form>
        </div>
    )
}

// {/* <input type="file" id="file" accept="image/*" onChange={event => {
//     setFile(event.target.files[0])
// }} /> */}



import Axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import UserContext from '../../context/UserContext';
import './myProfile.css';

export default function MyProfile() {
    const [file, setFile] = useState()
    const [availableFile, setAvailableFile] = useState()
    const { userData } = useContext(UserContext)

    const uploadImage = async (e) => {
        e.preventDefault()
        const data = new FormData()
        data.append("file", file);
        data.append("userId", userData.id)
        await Axios.post("http://localhost:5000/images/upload", data)
        const image = await Axios.post("http://localhost:5000/images/images", {
            userId: userData.id
        })
        setAvailableFile(image.data)
    }

    useEffect(() => {
        const getImage = async () => {
            const image = await Axios.post("http://localhost:5000/images/images", {
                userId: userData.id
            })
            setAvailableFile(image.data)
        }
        getImage()
    }, [availableFile, userData.id])

    // console.log(availableFile);

    return (
        <div className="profile-container ">
            <div className="profile-img-container d-flex justify-content-center">
                {availableFile && <img className="profile-img" src={`data:image/jpeg;base64,${availableFile}`} alt="image1" style={{ width: '20rem', borderRadius: '50%' }}></img>}
            </div>
            <form className="form-container-profile" style={{ marginTop: '10rem' }}>
                <label htmlFor="file" className="btn d-flex justify-content-center" id="update-profile-button">Update profile picture</label>
                <input id="file" accept="image/*" style={{ visibility: "hidden" }} type="file" onChange={event => {
                    setFile(event.target.files[0])
                }} />
                <button onClick={uploadImage}>Upload</button>
            </form>
        </div>
    )
}

// {/* <input type="file" id="file" accept="image/*" onChange={event => {
    //     setFile(event.target.files[0])
// }} /> */}