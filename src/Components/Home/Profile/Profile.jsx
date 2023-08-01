import React, { useEffect, useState } from "react";
import "./Profile.css";
import Avatar from "@mui/material/Avatar";
import { useOutletContext } from "react-router-dom";
import Joi from "joi";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { baseURL } from "./../../../index";
import axios from "axios";

export default function Profile({currentUser}) {
  const [users, user, config] = useOutletContext();
  const [info, setInfo] = useState(user);
  const [edit, setEdit] = useState(false);

  const [newProfile, setNewProfile] = useState({
    firstName: "",
    lastName: "",
    DOB: ""
    // phone: "",
    // Address: '',
  });
  const [errList, setErrList] = useState([]);
  const [regFlag, setRegFlag] = useState(false);

  const showPrevData = () => {
    const temp = { ...newProfile };
    const inputs = Array.from(document.getElementsByClassName("edit-input"));
    for (const input of inputs) {
      if (input.id === "DOB") {
        input.value = user[input.id].split("T")[0];
      } else {
        input.value = user[input.id];
      }
      temp[input.id] = input.value;
    }
    setNewProfile(temp);
  };
  const setData = (e) => {
    let temp = { ...newProfile };
    temp[e.target.id] = e.target.value;
    setNewProfile(temp);
  };
  const submitForm = async (e) => {
    console.log("first")
    e.preventDefault();
    const schema = Joi.object({
      firstName: Joi.string().min(3).max(10).alphanum(),
      lastName: Joi.string().min(3).max(10).alphanum(),
      DOB: Joi.string().min(10).max(10),
    });

    let joiResponse = schema.validate(newProfile, { abortEarly: false });
    if (joiResponse.error) {
      console.log(joiResponse.error)
      setErrList(joiResponse.error.details);
    } else {
      setErrList([]);
      setRegFlag(true);
      console.log("first")
      const result = await axios
        .put(`${baseURL}/user/profile/update`, newProfile, config)
        .catch(function (error) {
          if (error.response) {
            console.log(error.response);
          }
        });
        console.log(result)
      if (result?.data?.message === "done") {
        setRegFlag(false);
        localStorage.setItem("token", result.data.token)
        currentUser();
        setEdit(false);
      } else {
        setRegFlag(false);
        alert("Failed to update profile");
      }
    }
  };

  function getError(key) {
    for (const error of errList) {
      if (error.context.key === key) {
        return error.message;
      }
    }
    return "";
  }

  useEffect(() => {
    showPrevData();
  }, [edit]);

  return (
    <div className="col">
      <div className="row mx-lg-3 pt-lg-5  min-vh-100 mt-md-0 mt-5 pt-lg-0 pt-5">
        <div className="col-md-5">
          <div className="content mt-md-5 mt-2 ">
            <div className="profile-img text-center p-3 rounded-2">
              <div className="profile-avatar d-inline-block">
                <Avatar
                  className="mx-auto"
                  alt="Remy Sharp"
                  src={user?.profilePic?.secure_url}
                  sx={{ width: 130, height: 130 }}
                />
              </div>
              <h3>{user?.firstName} {user?.lastName}</h3>
              <p className="text-white"> @{user?.userName} </p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="content contact-information my-md-5 my-2 rounded-2">
            <div className="header p-2 mb-2">
              <h2>Personal information</h2>
            </div>

            <div className="card-body">
              {edit ? (
                <form id="editForm" onSubmit={submitForm}>
                  <div className="row mb-2 px-3">
                    <div className="col-md-3">
                      <label
                        htmlFor="firstName"
                        className="form-label col-form-label"
                      >
                        First Name:{" "}
                      </label>
                    </div>
                    <div className="col-md-9">
                      <input
                        onChange={setData}
                        type="text"
                        className="form-control edit-input"
                        id="firstName"
                      />
                      <p className=" fs-6 text-danger mb-3">
                        {" "}
                        {getError("firstName")}
                      </p>
                    </div>
                  </div>
                  <div className="row mb-2 px-3">
                    <div className="col-md-3">
                      <label
                        htmlFor="lastName"
                        className="form-label col-form-label"
                      >
                        Last Name:{" "}
                      </label>
                    </div>
                    <div className="col-md-9">
                      <input
                        onChange={setData}
                        type="text"
                        className="form-control edit-input"
                        id="lastName"
                      />
                      <p className=" fs-6 text-danger mb-3">
                        {" "}
                        {getError("lastName")}
                      </p>
                    </div>
                  </div>
                  <div className="row mb-2 px-3">
                    <div className="col-md-3">
                      <label
                        htmlFor="DOB"
                        className="form-label col-form-label"
                      >
                        Date of Birth:{" "}
                      </label>
                    </div>
                    <div className="col-md-9">
                      <input
                        onChange={setData}
                        type="date"
                        className="form-control edit-input"
                        id="DOB"
                      />
                      <p className=" fs-6 text-danger mb-3">
                        {" "}
                        {getError("DOB")}
                      </p>
                    </div>
                  </div>

                  {/* <div className="row mb-2 px-3">
                      <div className="col-md-3">
                        <label htmlFor="address" className="form-label col-form-label">Address: </label>
                      </div>
                      <div className="col-md-9">
                        <input onChange={setData} type="text" className="form-control edit-input" id="address" />
                        <p className=" fs-6 text-danger mb-3"> {getError("address")}</p>
                      </div>
                    </div> */}

                  <div className="mb-3 d-flex justify-content-center">
                  <button className="btn btn-primary">
                    {regFlag ? "Waiting..." : "Submit"}
                  </button>
                  </div>
                  
                </form>
              ) : (
                <div className="profileData py-3">
                  <div className="row text-center">
                    <div className="col-sm-4">
                      <h6 className="mb-0">First Name</h6>
                    </div>
                    <div className="col-sm-8 text-secondary">
                      {info?.firstName}
                    </div>
                  </div>
                  <hr />
                  <div className="row text-center">
                    <div className="col-sm-4">
                      <h6 className="mb-0">Last Name</h6>
                    </div>
                    <div className="col-sm-8 text-secondary">
                      {info?.lastName}
                    </div>
                  </div>
                  <hr />
                  <div className="row text-center">
                    <div className="col-sm-4">
                      <h6 className="mb-0">Date of Birth</h6>
                    </div>
                    <div className="col-sm-8 text-secondary">
                      {info?.DOB.split("T")[0]}
                    </div>
                  </div>
                  <hr />
                  <div className="row text-center">
                    <div className="col-sm-4">
                      <h6 className="mb-0">Email</h6>
                    </div>
                    <div className="col-sm-8 text-secondary">{info?.email}</div>
                  </div>
                  <hr />
                  
                  <div className="row text-center">
                    <div className="col-sm-4">
                      <h6 className="mb-0">Age</h6>
                    </div>
                    <div className="col-sm-8 text-secondary">{info?.age}</div>
                  </div>
                  <hr />
                  <div className="text-center">

                  <button className="btn mx-auto" onClick={()=>{setEdit(true)}}> Edit </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
