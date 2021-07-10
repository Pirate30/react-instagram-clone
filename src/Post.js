import React, { useEffect, useState } from 'react';
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";
import { db } from "./firebaseconfig";
import firebase from "firebase";

function Post({ postId, user, username, imageUrl, caption, avatarUrl }) {
    // usestate for all the comments
    const [comments, setComments] = useState([]);
    // usestate for the specific commnets
    const [comment, setComment] = useState("");

    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
                .collection("post")
                .doc(postId)
                .collection("comments")
                .orderBy('timestamp', 'desc')
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc) => doc.data()));
                });
        }
        return () => {
            unsubscribe();
        };
    }, [postId])

    // function for commenting feature
    const postComment = (event) => {

        event.preventDefault();
        db.collection("post").doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment("");

    }

    return (
        <div className="post">
            <div className="post__header">
                <Avatar
                    className="post__avatar"
                    src={avatarUrl}
                />
                <h3>{username}</h3>
            </div>
            <img
                className="post__image"
                src={imageUrl}
            />
            <h4 className="post__caption"><strong>{username}    </strong>{caption}
            </h4>
            {/* comments */}

            <div className="post__comments">
                {comments.map((comment) => (
                    <p>
                        <b>{comment.username}</b> {comment.text}
                    </p>
                ))}
            </div>


            {/* posting comments */}
            {user && <form className="post__commentBox">
                <input
                    className="post__input"
                    type="text"
                    placeholder="post a comment.."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <button
                    disabled={!comment}
                    className="post__button"
                    type="submit"
                    onClick={postComment}
                >
                    Post
                </button>
            </form>}



        </div>
    )
}

export default Post
