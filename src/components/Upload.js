import React, { useState } from 'react'
import { Button } from '@material-ui/core';
import { db, storage } from '../firebase';
import firebase from "firebase";
import '../App.css';

function Upload({username}) {
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(0);
    const [progress, setProgress] = useState('');

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed", 
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                console.log(error);
            },
            () => {
                storage
                .ref("images").child(image.name).getDownloadURL()
                .then(url => {
                    db.collection("posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        imageUrl: url,
                        username: username
                    });

                    setProgress(0);
                    setCaption("");
                    setImage(null);
                })
            }
        )
    }

    return (
        
        <div className="image-upload">
            <input className="caption-input" type="text" value={caption} onChange={event => setCaption(event.target.value)} placeholder="Enter a caption..."></input>
            <input className="caption-input" type="file" onChange={handleChange}></input>
            <progress value={progress} max="100"></progress>
            <Button variant="contained" color="primary" onClick={handleUpload}>Upload</Button>
        </div>
    )
}

export default Upload
