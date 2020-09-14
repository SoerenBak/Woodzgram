import React, { useState, useEffect } from 'react'
import { db } from '../firebase';
import firebase from 'firebase';
import { Button } from '@material-ui/core';

function Post({ postId, username, user, caption, imageUrl}) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');

    const postComment = (event) => {
        event.preventDefault();
        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment('');
    } 

    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
            .collection("posts")
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
        }, [postId]);

    return (
        <div className="post">
           <div className="post-header">
           <img src="https://styleguide.europeana.eu/images/fpo_avatar.png"></img>
            <h3>{username}</h3>
           </div>
            <img className="post-img" src={imageUrl}></img>
            <p><b>{username} </b><span style={{textDecoration: "underline"}}>{caption}</span></p>

            <div className="post-comments">
                {comments.map((comment) => 
                    <p>
                        <strong>{comment.username}</strong> {comment.text}
                    </p>
                )}
            </div>

            {user && (
                <form className="comment-form">
                    <input className="comments" type="text" placeholder="Add a comment..." value={comment} onChange={(e) => setComment(e.target.value)}></input>
                    <button className="comment-submit" disabled={!comment} type="submit" onClick={postComment}>Post</button>
                </form>
            )}
            
        </div>
    )
}

export default Post
