import Axios from 'axios';
import React, { useContext, useState } from 'react';
// import { Col, Container, Row } from 'react-bootstrap';
import UserContext from '../../context/UserContext';
import './gallery.css'

export default function Gallery() {
    const [selectedFileGallery, setSelectedFileGallery] = useState()
    const { userData } = useContext(UserContext);

    const singleFileUploadHandler = async (event) => {
        const data = new FormData();
        // If file selected
        if (selectedFileGallery) {
            data.append('profileImage', selectedFileGallery, selectedFileGallery.name);
            data.append("userId", userData.id)
            await Axios.post('http://localhost:5000/images/gallery-img-upload', data, {
                headers: {
                    'accept': 'application/json',
                    'Accept-Language': 'en-US,en;q=0.8',
                    'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                }
            })
            // const userRes = await Axios.get(
            //     "http://localhost:5000/users/",
            //     { headers: { "x-auth-token": userData.token } }
            // )
        } else {

        }
    };

    return (
        <div className="gallery-container ">
            <div className="gallery-wrapper">
                <h2>Gallery</h2>
                <label htmlFor="filess" className="btn" id="upload-photo" style={{ color: '#1877f2' }}>Add photo</label>
                <input type="file" accept="image/*" id="filess" style={{ visibility: 'hidden' }} onChange={e => setSelectedFileGallery(e.target.files[0])} />
                <p className="text-muted" id="max-file-size-1" style={{ textAlign: 'center', display: 'inline-block' }}>( Max 5MB )</p>
                <div className="upload-button-gallery-w" style={{ outline: 'none' }}>
                    <button className="btn text-success shadow-none upload-button-gallery" onClick={singleFileUploadHandler}>Upload</button>
                </div>
                <span style={{height: '12rem', width: '100%'}} className='d-flex'></span>
                {userData.gallery && userData.gallery.map((gallery, index) => {
                    return (
                        <div className="photo-wrapper">
                            <img src={gallery.imgURL} className="photo"></img>
                        </div>
                    )
                })}
                
            </div>
        </div>
    )
}
