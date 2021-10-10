import './App.css';
import { getAuth , GoogleAuthProvider, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, updateProfile  } from "firebase/auth";
import initializeAuthentication from './Firebase/firebase.initialize';
import { useState } from 'react';

initializeAuthentication();

function App() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLogIn, setIsLogIn] = useState(false)
  const [user, setUser] = useState({})

  const provider = new GoogleAuthProvider();
  const auth = getAuth();

const handleGoogleSignIn = () => {
  signInWithPopup(auth, provider)
    .then(result => {
      const {displayName, email, photoURL} = result.user;
      const loggedInUser = {
        name: displayName,
        email: email,
        photo: photoURL,
      }
      setUser(loggedInUser);
    })
    .catch(error => {
      console.log(error.message);
    })
}

const handleSignOut = () => {
  signOut(auth)
  .then(() => {
    setUser({})
  })
}

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
const handleToggleLogIn = (event) => {
  // console.log(event.target.checked);
  setIsLogIn(event.target.checked);
}
const handleNameBlur = (event) => {
  // console.log(event.target.value);
  setName(event.target.value);
}
const handleEmailBlur = (event) => {
  // console.log(event.target.value);
  setEmail(event.target.value);
}
const handlePasswordBlur = (event) => {
  // console.log(event.target.value)
  setPassword(event.target.value)
}

// const handleSubmit = (event) => {
//   event.preventDefault();
//   // console.log('handleSubmit')
//   // console.log(email, password)
//   if(password.length < 6){
//     setError('Password Must be 6 characters long');
//     return;
//   }
//   if(!/(?=.*[A-Z].*[A-Z])/.test(password)){
//     setError('Password Must Contain 2 Upper Case ');
//     return;
//   }
//   createUserWithEmailAndPassword(auth, email, password)
//   .then(result => {
//     const user = result.user;
//     console.log(user);
//     setError('')
//   })
//   .catch(error => {
//     setError(error.message);
//   })

// }

const handleSubmit = (event) => {
  event.preventDefault();
  // console.log('handleSubmit')
  // console.log(email, password)
  if(password.length < 6){
    setError('Password Must be 6 characters long');
    return;
  }
  if(!/(?=.*[A-Z].*[A-Z])/.test(password)){
    setError('Password Must Contain 2 Upper Case ');
    return;
  }
  isLogIn ? processLogIn(email, password) : registerNewUser(email, password)
}

const processLogIn = (email, password) => {
  signInWithEmailAndPassword(auth, email, password)
  .then(result => {
    const user = result.user;
    console.log(user);
    setError('');
    verifyEmail();
    setUserName();
  })
  .catch(error => {
    setError(error.message);
  })
}

const registerNewUser = (email, password) => {
  createUserWithEmailAndPassword(auth, email, password)
  .then(result => {
    const user = result.user;
    console.log(user);
    setError('')
  })
  .catch(error => {
    setError(error.message);
  })
}

// const handleChange = (event) => {
//   console.log(event.target.value)
// }

const setUserName = () => {
  updateProfile(auth.currentUser, {displayName: name})
  .then(result => {
    console.log(result)
  })
}

const verifyEmail = () => {
  sendEmailVerification(auth.currentUser)
  .then(result => {
    console.log(result)
  });
}

const handleResetPassword = () => {
  sendPasswordResetEmail(auth, email)
  .then(result => {
    console.log(result)
  })
}

  return (
    <div className="mx-5 my-5">
      <form onSubmit={handleSubmit}>
        <h1 className="text-primary text-center">Plese {isLogIn ? 'Log In' : 'Register'}</h1>
        {
          !isLogIn && <div className="row mb-3">
          <label htmlFor="name" className="col-sm-2 col-form-label">Name</label>
          <div className="col-sm-10">
            <input onBlur={handleNameBlur} type="text" id="name" className="form-control" placeholder="Your Name"/>
          </div>
        </div>
        }
        <div className="row mb-3">
          <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Email</label>
          <div className="col-sm-10">
            {/* <input onChange={handleChange} type="email" className="form-control" id="inputEmail3"/> */}
            <input onBlur={handleEmailBlur} type="email" className="form-control" id="inputEmail3" placeholder="Your Email" required/>
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Password</label>
          <div className="col-sm-10">
            <input onBlur={handlePasswordBlur} type="password" className="form-control" id="inputPassword3" placeholder="Your Password" required/>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-sm-10 offset-sm-2">
            <div className="form-check">
              <input onChange={handleToggleLogIn} className="form-check-input" type="checkbox" id="gridCheck1"/>
              <label className="form-check-label" htmlFor="gridCheck1">
                Already Registered?
              </label>
            </div>
          </div>
        </div>
        <div className="row mb-3 text-danger">{error}</div>
        <button type="submit" className="btn btn-primary">
          {isLogIn ? 'Log In' : 'Register'}
        </button>
        <br />
        <br />
        <button onClick={handleResetPassword} type="button" className="btn btn-secondary btn-sm">Reset Password</button>
      </form>

      <div>---------------------------------</div>
      <br /><br /><br />
      {
        !user.name ?
        <button onClick={handleGoogleSignIn} className="btn btn-primary">Google Sign In</button>
        :
        <button onClick={handleSignOut} className="btn btn-primary">Sign Out</button>
      }
      {
        user.name && <div>
          <h2>Name: {user.name}</h2>
          <p>Email: {user.email}</p>
          <img src={user.photo} alt="" />
        </div>
      }
    </div>
  );
}

export default App;
