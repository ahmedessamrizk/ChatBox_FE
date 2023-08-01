import Joi from "joi";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SignUp.css";
import axios from "axios";
import { baseURL } from "./../../index";

export default function Signup() {
  let navigate = useNavigate();
  //Data
  const [apiFlag, setApiFlag] = useState(false);
  const [googleFlag, setGoogleFlag] = useState(false);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    userName: "",
    DOB: "",
  });
  const [ErrList, setErrList] = useState([]);
  const [APIRes, setAPIRes] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  //Functions
  function getUser(e) {
    setAPIRes(null);
    let newUser = { ...user };
    let data = e.target.value;
    newUser[e.target.id] = data;
    setUser(newUser);
    // console.log(e.target.value);
    checkInputs(newUser, e);
  }

  function checkInputs(newUser, e) {
    const schema = Joi.object({
      firstName: Joi.string().min(3).max(10).alphanum().required(),
      userName: Joi.string().min(3).max(10).alphanum().required(),
      DOB: Joi.date(),
      phone: Joi.number().min(5),
      lastName: Joi.string().min(3).max(10).alphanum().required(),
      email: Joi.string()
        .required()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required(),
      password: Joi.string()
        .pattern(
          new RegExp(
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
          )
        )
        .required()
        .messages({
          "string.pattern.base":
            "Minimum eight, at least one uppercase letter, one lowercase letter, one number and one special character",
        }),
    });
    let joiResponse = schema.validate(newUser, { abortEarly: false });
    let inputField = e.target;
    if (inputField.id === "DOB") {
      return;
    }
    if (joiResponse.error) {
      // console.log(joiResponse.error.details);
      let errors = joiResponse.error.details;
      let errorFlag,
        i = 0;
      for (i = 0; i < errors.length; i++) {
        if (errors[i].context.label === inputField?.id) {
          errorFlag = true;
          break;
        }
      }
      if (errorFlag) {
        inputField?.nextElementSibling.classList.remove("d-none");
        inputField?.classList.add("invalid-input");
        inputField?.classList.remove("valid-input");
        // inputField?.nextElementSibling.children[1].classList.remove("d-none");
        // inputField?.nextElementSibling.children[0].classList.add("d-none");
        setErrList([errors[i]]);
      } else {
        inputField?.classList.remove("invalid-input");
        inputField?.classList.add("valid-input");
        // inputField?.nextElementSibling.children[0].classList.remove("d-none");
        // inputField?.nextElementSibling.children[1].classList.add("d-none");
        setErrList([]);
      }
      if (inputField.value === "" && errorFlag) {
        inputField?.classList.remove("invalid-input");
        setErrList([]);
      }
    } else {
      inputField?.classList.remove("invalid-input");
      inputField?.classList.add("valid-input");
      // inputField?.nextElementSibling.children[0].classList.remove("d-none");
      // inputField?.nextElementSibling.children[1].classList.add("d-none");
      setErrList([]);
    }
  }
  function getError(key) {
    for (const error of ErrList) {
      if (error.context.key === key) {
        return error.message;
      }
    }
    return "";
  }
  const handlePassword = (e) => {
    if (!showPassword) {
      document.getElementById("password").type = "text";
      setShowPassword(true);
    } else {
      document.getElementById("password").type = "password";
      setShowPassword(false);
    }
  };
  async function checkAPI(e) {
    e.preventDefault();
    if (ErrList.length !== 0) {
      setAPIRes("Invalid data");
      return;
    }
    setApiFlag(true);
    let result = await axios
      .post(`${baseURL}/auth/signup`, user)
      .catch(function (error) {
        if (error.response) {
          console.log(error.response);
          setAPIRes(error?.response?.data?.message);
          setApiFlag(false);
        }
      });

    if (result?.data?.message === "done") {
      setApiFlag(false);
      setAPIRes(null);
      navigate("/login");
    }
  }

  return (
    <>
      <div className="login signup d-flex justify-content-center pt-5">
        <div className="content d-block p-lg-4 p-2 text-center position-relative my-5 pt-1">
          <div className="layer d-flex justify-content-center align-items-center pt-2">
            <div className="logo-img">
              <img src="/chat.png" className="img-fluid" alt="" />
            </div>
          </div>
          <h1 className="mb-4 mt-5 text-white">Welcome to Chatbox</h1>
          <form onSubmit={checkAPI} className="form" action="">
          
            <div className="d-flex">
              <div className="position-relative input-field text-start me-2">
                <input
                  type="text"
                  name="firstName"
                  required
                  onChange={getUser}
                  id="firstName"
                  className="form-control position-relative"
                />
                <label
                  htmlFor="firstName"
                  className="text-dark position-absolute"
                >
                  First Name
                </label>
                <p className="text-danger " id="firstName">
                  {getError("firstName")}
                </p>
              </div>
              <div className="position-relative input-field text-start">
                <input
                  type="text"
                  name="lastName"
                  required
                  onChange={getUser}
                  id="lastName"
                  className="form-control position-relative"
                />
                <label
                  htmlFor="lastName"
                  className="text-dark position-absolute"
                >
                  Last Name
                </label>
                <p className="text-danger " id="lastName">
                  {getError("lastName")}
                </p>
              </div>
            </div>

            <div className="position-relative input-field text-start my-4">
              <input
                type="text"
                name="userName"
                required
                onChange={getUser}
                id="userName"
                className="form-control position-relative"
              />
              <label htmlFor="userName" className="text-dark position-absolute">
                userName
              </label>
              <p className="text-danger " id="userName">
                {getError("userName")}
              </p>
            </div>
            <div className="position-relative input-field text-start my-4">
              <input
                type="text"
                name="email"
                required
                onChange={getUser}
                id="email"
                className="form-control position-relative"
              />
              <label htmlFor="email" className="text-dark position-absolute">
                Email
              </label>
              <p className="text-danger " id="email">
                {getError("email")}
              </p>
            </div>

            <div className="position-relative input-field text-start my-4">
              <input
                type="password"
                name="password"
                required
                onChange={getUser}
                id="password"
                className="form-control position-relative"
              />
              <label htmlFor="password" className="text-dark position-absolute">
                Password
              </label>
              <p className="text-danger " id="password">
                {getError("password")}
              </p>
            </div>
            <div className="position-relative input-field text-start my-4">
              <input
                autoComplete="off"
                onChange={getUser}
                type="date"
                id="DOB"
                className="form-control position-relative"
              />{" "}
              <label htmlFor="DOB" className="text-dark position-absolute">
                DOB
              </label>
              <p className="text-danger mb-2" id="DOB">
                {getError("DOB")}
              </p>
            </div>
            <div className="position-relative input-field text-start my-4">
              <input
                type="number"
                name="phone"
                onChange={getUser}
                id="phone"
                className="form-control position-relative"
              />
              <label htmlFor="phone" className="text-dark position-absolute">
                Phone
              </label>
              <p className="text-danger " id="phone">
                {getError("phone")}
              </p>
            </div>

            {/* Show password & login */}
            <div className="d-flex justify-content-between">
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="inlineCheckbox1"
                  value="option1"
                  onChange={handlePassword}
                />
                <label
                  className="form-check-label h6"
                  htmlFor="inlineCheckbox1"
                >
                  Show password
                </label>
              </div>
              <Link to={"/login"}><u>Login</u></Link>
            </div>
            <button className="btn btn-primary w-100 my-4">{
              apiFlag?
              'Loading...'
              :
              'Sign Up'
            }  </button>
            {APIRes ? (
                    <div className="alert alert-danger"> {APIRes} </div>
                  ) : (
                    ""
                  )}
          </form>
        </div>
      </div>
    </>
  );
}
