import React, { useContext, useState } from 'react'
import Axios from 'axios';
import UserContext from '../../context/UserContext';
import * as FaIcons from "react-icons/fa";
import ProfileContext from '../../context/ProfileContext';
import './myProfile.css';

export default function MyProfile() {
    const [selectedFile, setSelectedFile] = useState()
    const { userData } = useContext(UserContext);
    const { availableFile, setAvailableFile } = useContext(ProfileContext)

    const singleFileUploadHandler = async (event) => {
        const data = new FormData();
        // If file selected
        if (selectedFile) {
            data.append('profileImage', selectedFile, selectedFile.name);
            data.append("userId", userData.id)
            await Axios.post('http://localhost:5000/images/profile-img-upload', data, {
                headers: {
                    'accept': 'application/json',
                    'Accept-Language': 'en-US,en;q=0.8',
                    'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                }
            })
            const userRes = await Axios.get(
                "http://localhost:5000/users/",
                { headers: { "x-auth-token": userData.token } }
            )
            setAvailableFile(userRes.data.profile);
            setSelectedFile()
        } else {

        }
    };

    return (
        <div className="profile-container">
            <div className="profile-img-container d-flex justify-content-center">
                {availableFile ?
                    <img className="profile-img" src={availableFile.imgURL} alt="image1" style={{ width: '20rem', height: '20rem', borderRadius: '50%' }}></img> :
                    <FaIcons.FaRegUserCircle className="user-icon" style={{ width: '20rem', height: '20rem', borderRadius: '50%' }} />
                }            
            </div>

            <div className="card-body d-flex justify-content-center flex-column">
                <label htmlFor="file" className="btn" id="update-profile-button" >Update profile picture</label>
                <input type="file" accept="image/*" style={{ visibility: "hidden" }} id="file" onChange={e => setSelectedFile(e.target.files[0])} />
                <p className="text-muted" id="max-file-size" style={{ textAlign: 'center' }}>( Max 2MB )</p>
                {selectedFile &&
                    <div className="image-info-profile">
                        <p>{selectedFile && selectedFile.name}</p>
                        <p className={`${selectedFile && selectedFile.size < 2000000 && 'text-success'}`} style={{color: 'red'}}>{selectedFile && (selectedFile.size) / 1000000} MB</p>
                        <div className="upload-button-gallery-w" style={{ outline: 'none' }}>
                            <button
                                className={`btn shadow-none ${selectedFile && selectedFile.size > 2000000 ? 'oversize-image' : 'upload-button-gallery'}`}
                                onClick={singleFileUploadHandler}
                                
                            >
                                Upload
                            </button>
                        </div>
                    </div>
                }
                {/* <div className="asd d-flex justify-content-center" style={{outline: 'none'}}>
                    <button className={`btn shadow-none ${selectedFile && selectedFile.size > 2000000 ? 'oversize-image': 'upload-button-gallery'}`} id="upload-profile-button" onClick={singleFileUploadHandler}>Upload</button>
                </div> */}
            </div>
        </div>
    )
}
