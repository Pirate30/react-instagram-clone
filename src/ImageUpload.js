import { Button } from '@material-ui/core';
import React, { useState } from 'react';
import { db, storage } from './firebaseconfig';
import firebase from "firebase";
import "./ImageUpload.css"

function ImageUpload({ username }) {

    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);

    const selectFile = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0])
        }
    }

    const uploadFile = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        uploadTask.on(
            "state_chnaged",
            // progress bar
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                // showing err
                console.log(error);
                alert(error.message);
            },
            () => {
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        // postinf the image into db
                        db.collection("post").add({
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


    };

    return (
        <div className="imageupload">
            <progress className="imageupload__progress" value={progress} max="100" />
            <input type="text" placeholder="Enter a Caption" value={caption} onChange={event => setCaption(event.target.value)} />
            <input type="file" onChange={selectFile} required="true" />
            <Button onClick={uploadFile}>Upload</Button>
        </div>
    )
}

export default ImageUpload
