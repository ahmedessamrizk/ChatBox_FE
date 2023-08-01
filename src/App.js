import * as React from 'react';
import logo from './logo.svg';
import './App.css';
import Chat from './Components/Chat/Chat';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Home from './Components/Home/Home.jsx';
import Messages from './Components/Home/Messages/Messages.jsx';
import Profile from './Components/Home/Profile/Profile.jsx';
import Dashboard from './Components/Home/Dashboard/Dashboard.jsx';
import Groups from './Components/Home/Groups/Groups.jsx';
import Navbar from './Components/Navbar/Navbar.jsx';
import Login from './Components/Login/Login.jsx';
import Signup from './Components/SignUp/Signup';
import { useEffect, useState } from 'react';
import { BEARERKEY, baseURL } from './index.js';
import axios from 'axios';
import { socket } from './socket.js';
import jwtDecode from 'jwt-decode';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';


function App() {
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const [open, setOpen] = React.useState(false);
  const [alert, setAlert] = useState({
    type:'',
    message:'',
  })

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  let navigate = useNavigate();
  const [user, setUser] = useState(null);

  function ProtectedLogin(props) {
    if (!(localStorage.getItem("token"))) {
      return props.children;
    }
    else {
      return <Navigate to='/home' />
    }
  }
  function ProtectedRoute(props) {
    if (localStorage.getItem("token")) {
      return props.children;
    }
    else {
      return <Navigate to='/login' />
    }
  }
  


  async function currentUser() {
    const decoded = jwtDecode(localStorage.getItem("token"));

    setUser(decoded.user)
    // const config = {
    //   headers: {
    //     authorization: BEARERKEY + localStorage.getItem("token"),
    //   }
    // };
    // let result = await axios.get(`${baseURL}/user/profile`, config).catch(function (error) {
    //   if (error.response) {
    //     console.log(error.response);
    //   }
    // });

    // if (result?.data?.message == "done") {
    //   setUser(result.data.user);
    //   navigate("/home")
    // } else {
    //   localStorage.removeItem("token");
    //   setUser(null);
    // }
  }
  async function removeUser() {
    const config = {
      headers: {
        authorization: BEARERKEY + localStorage.getItem("token")
      }
    };
    let result = await axios.get(`${baseURL}/user/signout`, config).catch(function (error) {
      if (error.response) {
        console.log(error.response);
      }
    });
    console.log(result)
    if (result?.data?.message == "done") {
      localStorage.removeItem("token");
      navigate('/login');
      setUser(null);
    } else {
      alert("Failed to log out")
    }
  }



  useEffect(() => {
    // isLogin()
    if (localStorage.getItem("token")) {
      currentUser();
    }
  }, [])
  return <>
  <Stack spacing={2} sx={{ width: '100%' }}>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={alert.type} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
      {/* <Alert severity="error">This is an error message!</Alert>
      <Alert severity="warning">This is a warning message!</Alert>
      <Alert severity="info">This is an information message!</Alert>
      <Alert severity="success">This is a success message!</Alert> */}
    </Stack>
    <Navbar user={user} removeUser={removeUser} />
    <Routes>
      <Route path='/home' element={<ProtectedRoute><Home user={user} removeUser={removeUser} handleClick={handleClick} setAlert={setAlert} /></ProtectedRoute>} >
        <Route path='/home/messages/' element={<ProtectedRoute><Messages /></ProtectedRoute>} />
        <Route path='/home/profile' element={<ProtectedRoute><Profile currentUser={currentUser}/></ProtectedRoute>} />
        <Route path='/home/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path='/home/groups' element={<ProtectedRoute><Groups /></ProtectedRoute>} />
        <Route path='/home' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      </Route>

      <Route path='/chat' element={<Chat />} />
      <Route path='/' element={<ProtectedLogin> <Login currentUser={currentUser} /> </ProtectedLogin>} />
      <Route path='login' element={<ProtectedLogin> <Login currentUser={currentUser} /> </ProtectedLogin>} />
      <Route path='signup' element={<ProtectedLogin> <Signup /> </ProtectedLogin>} />

    </Routes>

  </>
}

export default App;
