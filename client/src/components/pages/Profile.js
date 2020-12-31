// import Axios from 'axios'
// import React, { useState, useEffect } from 'react'
// import App from './App'

export default function Profile() {
    // const [file, setFile] = useState()
    // const [availableFile, setAvailableFile] = useState()

    // const uploadImage = async (e) => {
    //     e.preventDefault()
    //     const data = new FormData()
    //     data.append("file", file);
    //     await Axios.post("http://localhost:5000/images/upload", data)
    // }


    // useEffect(() => {
    //     const getImage = async () => {
    //         const image = await Axios.get("http://localhost:5000/images/images")
    //         setAvailableFile(image.data)
    //     }
    //     getImage()
    // }, [availableFile])


    return (
        <div>
            
        </div>
    )
}

{/* <div style={{ position: 'absolute', top: '10rem' }}>
    <form>
        <input type="file" id="file" accept="image/*" onChange={event => {
            setFile(event.target.files[0])
            console.log(event.target.files);
        }} />
        <button onClick={uploadImage}>Upload</button>
    </form>
    {availableFile && <img src={`data:image/jpeg;base64,${availableFile}`} alt="image1" style={{width: '10rem', borderRadius: '50%'}}></img>}
</div> */}