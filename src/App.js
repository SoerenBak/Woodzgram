import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './components/Post';
import { db, auth } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import Upload from './components/Upload';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState ([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser);

      } else {
        setUser(null);
      }
    })

    return () => {
      unsubscribe();
    }
  }, [user, username]);

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id, 
        post: doc.data()
      })));
    })
  }, []);

  const signUp = (event) => {
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      authUser.user.updateProfile({
        displayName: username,
      })
    })
    .catch((error) => alert(error.message))
  }

  const signIn = (event) => {
    event.preventDefault();

    auth.signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message));
    setOpenSignIn(false);
  }

  return (
    <div className="App">

      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <h2 id="modal-title">Register to<span className="logo-font"><br></br> Woodzgram</span></h2>
          <form className="sign-up">
            <Input placeholder="Username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            <Input placeholder="Email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button type="submit" className="sign-in-up" onClick={signUp}>Sign Up!</Button>
          </form>
        </div>
      </Modal>

      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <h2 id="simple-modal-title"><center>Login</center></h2>
          <form className="sign-up">
            <Input placeholder="Email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button type="submit" className="login-modal" onClick={signIn}>Login</Button>
          </form>
        </div>
      </Modal>

      <header>
        <h2>Woodzgram</h2>
          { user ? (
            <Button onClick={() => auth.signOut()}>Logout</Button>
          ): (
            <div className="signing">
              <Button className="register-btn" onClick={() => setOpen(true)}>Register</Button>
              <Button className="login-btn" onClick={() => setOpenSignIn(true)}>Login</Button>
            </div>
          )}
      </header>
      <div className="upload-modal">
        {user?.displayName ? (
          <Upload username={user.displayName}/>
        ): (
          <div className="upload-message">
            <h3>You need to login to upload images</h3>
          </div>
        )}
      </div>
      <content>
        <div className="posts">
          {
            posts.map(({id, post}) => (
              <Post key={post.id} postId={id} username={post.username} user={user} caption={post.caption} imageUrl={post.imageUrl} />
            ))
          }
        </div>
      </content>
    </div>
    
  );
}

export default App;
