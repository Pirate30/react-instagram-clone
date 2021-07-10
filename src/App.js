import React, { useState, useEffect } from "react";
import './App.css';
import Post from "./Post";
import { db, auth } from "./firebaseconfig";
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input } from "@material-ui/core";
import ImageUpload from "./ImageUpload";
import InstagramEmbed from "react-instagram-embed";

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
    width: 300,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [openLogIn, setOpenLogIn] = useState(false);
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState(['']);
  const [password, setPassword] = useState(['']);
  const [email, setEmail] = useState(['']);
  const [user, setUser] = useState(null)

  // useEffect is somsething that runs piece of code on the specific condition

  useEffect(() => {
    // this runs once asa the app.js file gets load
    db.collection('post').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      // whenever the new post added or the any data from the post modifies this thing runs
      setPosts(snapshot.docs.map(docs => ({
        id: docs.id,
        post: docs.data()
      })));
    })
  }, []);

  // checking if the user is logged in or loged out
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in
        console.log(authUser);
        setUser(authUser);

        // // check whether is this new user or old and if new then update his display name
        // if (authUser.displayName) {
        //   // dont update his username
        // } else {
        //   return authUser.updateProfile({
        //     displayName: username,
        //   })
        // }

      } else {
        // logged out
        setUser(null)
      }
    });

    return () => {
      unsubscribe();
    }
  }, [user, username])

  // after signup function
  const signUp = (event) => {
    event.preventDefault();

    auth.createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((error) => alert(error.message));
    setOpen(false);
  };

  // after login functipon
  const logIn = (event) => {
    event.preventDefault();

    auth.signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpenLogIn(false);

  };

  return (
    <div className="app">

      <div className="app__header">
        <img
          className="app_headerImage"
          src="https://instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="logo"
        />

        {
          user ? (
            <Button onClick={() => auth.signOut()}>LogOut</Button>
          ) : (
            <div className="app__loginContainer">
              <Button onClick={() => setOpenLogIn(true)}>LogIn</Button>
              <Button onClick={() => setOpen(true)}>SignUp</Button>

            </div>
          )
        }
      </div>

      {/* <button type="button" onClick={handleOpen}>
        Open Modal
      </button> */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signUp">
            <center>
              {/* <div className="app__header"> */}
              <img
                className="app_headerImage"
                src="https://instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="logo"
              />
            </center>
            {/* </div> */}
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="password"
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>SignUp</Button>

          </form>
        </div>
      </Modal>

      {/* modal for the login action */}

      <Modal
        open={openLogIn}
        onClose={() => setOpenLogIn(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signUp">
            <center>
              {/* <div className="app__header"> */}
              <img
                className="app_headerImage"
                src="https://instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="logo"
              />
            </center>
            {/* </div> */}
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder="password"
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={logIn}>LogIn</Button>

          </form>
        </div>
      </Modal>


      {/* <Button onClick={() => setOpen(true)}>SignUp</Button> */}
      <div className="app__post">
        {
          posts.map(({ id, post }) => (
            <Post key={id} postId={id} user={user} username={post.username} imageUrl={post.imageUrl} avatarUrl={post.avatarUrl} caption={post.caption} />
          ))
        }
      </div>



      {
        user?.displayName ? (
          <ImageUpload username={user.displayName} />
        ) : (
          <h2>Oops... to upload something, You'll have to Login First</h2>
        )
      }


    </div>
  );
}

export default App;
