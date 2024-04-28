import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import "./Home.css";
import { Link, Outlet, useLocation } from "react-router-dom";
import axios from "axios";
import { BEARERKEY, baseURL } from "../../index.js";

export default function Home({ user, removeUser, handleClick, setAlert }) {
  const location = useLocation();
  const [buttonID, setButtonID] = useState("/home/dashboard");
  
  const [chatId, setChatId] = useState(null)
  const [users, setUsers] = useState(null);
  const [groupData, setGroupData] = useState({
    members:[],
    name:'',
    password:'',
    groupImageURL:''
  })
  const config = {
    headers: {
      authorization: BEARERKEY + localStorage.getItem("token"),
    },
  };

  let chosen = [];

  const addRecipient = (id, idx) => {
    let tempData = {...groupData}
    tempData.members.push(id)
    document.getElementById(id).disabled = true;
    setGroupData(tempData);

  }
  const clearRecipients = () => {
    chosen = []
  }
  const getGroupData = (e) => {
    let tempData = {...groupData}
    tempData[e.target.id] = e.target.value
    setGroupData(tempData);
  }
  const createGroup = async() => {
    const result = await axios.post(`${baseURL}/group/add`, groupData, config).catch(err => alert(err.response.data.message))
    if(result?.data?.message === "done"){
      setAlert({type: 'success', message: "Group is created!"})
      handleClick();
      // alert("Group created!")
    }
  }


  const getUsers = async () => {
    const result = await axios
      .get(`${baseURL}/user/users`, config)
      .catch((err) => {
        console.log(err);
      });
    if (result?.data?.message === "done") {
      setUsers(result.data.users);
    }
  };

  useEffect(() => {
    // setButtonID(location.pathname)
    if (user) {
      getUsers();
    }
  }, []);
  useEffect(() => {
    if (
      location.pathname === "/" ||
      location.pathname === "/login" ||
      location.pathname === "/signup"
    ) {
      document.getElementById("home-container").classList.add("d-none");
    } else {
      document.getElementById("home-container").classList.remove("d-none");
    }
    // setButtonID(location.pathname)
  }, [location.pathname]);
  // console.log(buttonID)

  return (
    <>
      <div className="container-fluid pb-0" id="home-container">
        <div className="row min-vh-100">
          <div className="col-2 p-0 d-lg-inline d-none">
            <div className="wrapper side-nav h-100">
              <div className="d-flex flex-column justify-content-between ">
                {location.pathname === "/" ||
                location.pathname === "/login" ||
                location.pathname === "/signup" ? (
                  <Link to={"/login"}>
                    <div className="d-flex py-0 ps-4 align-items-center logo my-4">
                      <div className="logo-img me-1 d-flex align-items-center cursor-pointer">
                        <i className="fa-regular fa-comments fa-2xl logo"></i>
                      </div>
                      <h4 className="cursor-pointer logo"> Chatbox </h4>
                    </div>
                  </Link>
                ) : (
                  <Link to={"/home/dashboard"}>
                    <div className="d-flex py-0 ps-4 align-items-center logo my-4">
                      <div className="logo-img me-1 d-flex align-items-center cursor-pointer">
                        <i className="fa-regular fa-comments fa-2xl logo"></i>
                      </div>
                      <h4 className="cursor-pointer logo"> Chatbox </h4>
                    </div>
                  </Link>
                )}

                <div className="personal-data mb-3 mt-4">
                  {user ? (
                    <div className="d-flex align-items-center justify-content-center">
                      <div className="personal-img me-lg-3">
                        <Avatar
                          alt="Remy Sharp"
                          src={user?.profilePic?.secure_url}
                          sx={{ width: 56, height: 56 }}
                        />
                      </div>
                      <div className="personal-data logo d-xl-inline-block d-none">
                        <strong className="my-0 h5">
                          {" "}
                          {user?.firstName} {user?.lastName}{" "}
                        </strong>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <div className="">
                  {user ? (
                    <>
                      <Link to="/home/dashboard">
                        <div
                          className={
                             location.pathname === '/home/dashboard' || location.pathname === '/home'
                              ? "side-nav-item my-3 d-flex justify-content-xl-start justify-content-center active"
                              : "side-nav-item my-3 d-flex justify-content-xl-start justify-content-center"
                          }
                        >
                          <div className="side-nav-item-icon me-3">
                            <i className="fa-xl fa-solid fa-cubes r"></i>
                          </div>
                          <p className="h5 d-xl-inline-block d-none">
                            {" "}
                            Dashboard{" "}
                          </p>
                        </div>
                      </Link>
                      <Link to="/home/groups">
                        <div
                          className={
                            location.pathname === '/home/groups'
                              ? "side-nav-item my-3 d-flex justify-content-xl-start justify-content-center active"
                              : "side-nav-item my-3 d-flex justify-content-xl-start justify-content-center"
                          }
                        >
                          <div className="side-nav-item-icon me-3">
                            <i className="fa-xl fa-solid fa-user-group"></i>
                          </div>
                          <p className="h5 d-xl-inline-block d-none">
                            {" "}
                            Groups{" "}
                          </p>
                        </div>
                      </Link>
                      <Link to="/home/messages">
                        <div
                          className={
                            location.pathname === "/home/messages"
                              ? "side-nav-item my-3 d-flex justify-content-xl-start justify-content-center active"
                              : "side-nav-item my-3 d-flex justify-content-xl-start justify-content-center"
                          }
                        >
                          <div className="side-nav-item-icon me-3">
                            <i className="fa-xl fa-regular fa-comment-dots"></i>
                          </div>
                          <p className="h5 d-xl-inline-block d-none">
                            {" "}
                            Messages{" "}
                          </p>
                        </div>
                      </Link>
                      <Link to="/home/profile">
                        <div
                          className={
                            location.pathname === "/home/profile"
                              ? "side-nav-item my-3 d-flex justify-content-xl-start justify-content-center active"
                              : "side-nav-item my-3 d-flex justify-content-xl-start justify-content-center"
                          }
                        >
                          <div className="side-nav-item-icon me-3">
                            <i className="fa-xl fa-solid fa-user-large"></i>
                          </div>
                          <p className="h5 d-xl-inline-block d-none">
                            {" "}
                            Profile{" "}
                          </p>
                        </div>
                      </Link>
                      <div onClick={removeUser}>
                        <div className="side-nav-item my-3 d-flex justify-content-xl-start justify-content-center logout">
                          <div className="side-nav-item-icon me-3">
                            <i className="fa-solid fa-person-walking-arrow-right fa-flip-horizontal fa-2xl"></i>
                          </div>
                          <p className="h5 d-xl-inline-block d-none">
                            {" "}
                            Logout{" "}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <Link to="/login">
                        <div
                          className={
                            location.pathname === "/login"
                              ? "side-nav-item my-3 d-flex justify-content-xl-start justify-content-center active"
                              : "side-nav-item my-3 d-flex justify-content-xl-start justify-content-center"
                          }
                        >
                          <p className="h5 d-xl-inline-block d-none"> Login </p>
                        </div>
                      </Link>
                      <Link to="/signup">
                        <div
                          className={
                            location.pathname === "/signup"
                              ? "side-nav-item my-3 d-flex justify-content-xl-start justify-content-center active"
                              : "side-nav-item my-3 d-flex justify-content-xl-start justify-content-center"
                          }
                        >
                          <p className="h5 d-xl-inline-block d-none">
                            {" "}
                            SignUp{" "}
                          </p>
                        </div>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Recipients Modal */}
          <div
            className="modal fade"
            id="exampleModal"
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Add Group
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="recipients">
                    {
                      users?

                      users.map((person, idx) => {
                        return <div key={idx}>
                          {
                            person?._id === user._id?
                            ''
                            :
                            <div className="message d-flex mb-3 border-bottom pb-2 px-2 ">
                              <div className="friend-img me-2">
                                <Avatar
                                  alt="Remy Sharp"
                                  src={person?.profilePic?.secure_url}
                                  sx={{ width: 50, height: 50 }}
                                />
                              </div>
                              <div className="friend-data w-100">
                                <div className="upper d-flex justify-content-between align-items-center">
                                  <p className="h6 text-truncate"> {person.firstName} {person.lastName} </p>
                                  <button id ={person._id} className="btn" onClick={()=>{addRecipient(person._id, idx)}}> Add </button>
                                </div>
                              </div>
                            </div>
                          }
                        </div>
                      })
                      :
                      <p> Loading... </p>
                    }
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    data-bs-dismiss="modal"
                    onClick={clearRecipients}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    data-bs-dismiss="modal"
                    data-bs-toggle="modal"
                    data-bs-target="#submitGroup"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* End of Modal */}

          {/* Submit Group Modal */}
          <div
            className="modal fade"
            id="submitGroup"
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Add Group
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>

                <div className="modal-body">
                      <div className="d-flex my-2">
                        <label htmlFor="" className="me-4"> Name:  </label>
                        <input onChange={getGroupData} type="text" className="form-control" id="name"/>
                      </div>
                      <div className="d-flex my-2">
                        <label htmlFor="" className="me-0"> password:  </label>
                        <input onChange={getGroupData} type="password" className="form-control" id="password"/>
                      </div>
                      <div className="d-flex my-2 mt-2">
                        <label htmlFor="" className="me-4"> Image:  </label>
                        <input onChange={getGroupData} type="text" className="form-control" id="groupImageURL"/>
                      </div>
                    </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    data-bs-dismiss="modal"
                    onClick={createGroup}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* End of Modal */}
          
          <Outlet context={[users, user, config, setAlert, handleClick]} />
        </div>
      </div>
    </>
  );
}
