import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { paginationClasses } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { Link, useOutletContext } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../../../index.js";

export default function Dashboard() {
  const [users, user, config, setAlert, handleClick] = useOutletContext();
  const [recent, setRecent] = useState(null);
  const [circularPercentage, setCircularPercentage] = useState(0);
  const [analytics, setAnalytics] = useState(null)
  

  const getAnalytics = async() => {
    const result = await axios.get(`${baseURL}/user/dashboard`, config).catch(
      e => {
        if(e.response.data.message === "jwt expired"){
          localStorage.removeItem("item");
          
        }
      }
    );
    setAnalytics(result?.data?.analytics)
  }
  const getRecentChats = async () => {
    const result = await axios
      .get(`${baseURL}/conversation/recent`, config)
      .catch((err) => console.log(err));
    if (result?.data?.message === "done") {
      setRecent(result.data.chats);
    }
  };
  // Online
  const [slider, setSlider] = useState("");
  let isDown = false;
  let startX;
  let scrollLeft;

  const end = () => {
    isDown = false;
    slider.classList.remove("activeOnline");
  };

  const start = (e) => {
    isDown = true;
    slider.classList.add("activeOnline");
    startX = e.pageX || e.touches[0].pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  };

  const move = (e) => {
    if (!isDown) return;

    e.preventDefault();
    const x = e.pageX || e.touches[0].pageX - slider.offsetLeft;
    const dist = x - startX;
    slider.scrollLeft = scrollLeft - dist;
  };

  if (slider) {
    (() => {
      slider.addEventListener("mousedown", start);
      slider.addEventListener("touchstart", start);

      slider.addEventListener("mousemove", move);
      slider.addEventListener("touchmove", move);

      slider.addEventListener("mouseleave", end);
      slider.addEventListener("mouseup", end);
      slider.addEventListener("touchend", end);
    })();
  }
  // End of Online

  useEffect(() => {
    setSlider(document.querySelector(".items"));
    setCircularPercentage(0.7);
    if (user) {
      getRecentChats();
      getAnalytics();
    }
  }, []);

  return (
    <div className="col">
      {
        analytics?
      <div className="row min-vh-100 mt-md-0 mt-5 pt-lg-0 pt-5 mx-lg-2 justify-content-center">
      <div className="row analytics mt-lg-5 mt-0 mb-3 gx-lg-4 gx-2 gy-lg-4 gy-md-5">
        <div className="col-md-3 col-sm-6 py-sm-0 py-1 mb-md-0 mb-5">
          <div className="analytic-card  text-center p-3 position-relative rounded-2">
            <div className="circular-container"></div>
            <div className="analytic-card-description mt-1">
              <h5 className="mt-2"> Messages sent </h5>
              <span className="fs-5"> {analytics?.messagesSent} </span>
            </div>
            <div
              className="circular-progress  position-absolute"
              style={{ width: 110, height: 110 }}
            >
              <CircularProgressbar
                backgroundPadding={6}
                value={analytics?.messagesSent}
                background={true}
                maxValue={Math.ceil( ((analytics?.messagesSent + analytics?.messagesReceived)))? Math.ceil( ((analytics?.messagesSent + analytics?.messagesReceived))) : 1}
                text={
                  isNaN(Math.floor(analytics?.messagesSent / (analytics?.messagesSent + analytics?.messagesReceived) * 100))?
                  "0%"
                  :
                  `${Math.floor(analytics?.messagesSent / (analytics?.messagesSent + analytics?.messagesReceived) * 100)}%`
                }
                styles={buildStyles({ pathTransitionDuration: 2 })}
              />
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 py-sm-0 py-1 mb-md-0 mb-5">
          <div className="analytic-card  text-center p-3 position-relative rounded-2">
            <div className="circular-container"></div>
            <div className="analytic-card-description mt-1">
              <h5 className="mt-2"> Messages accept </h5>
              <span className="fs-5"> {analytics?.messagesReceived} </span>
            </div>
            <div
              className="circular-progress  position-absolute"
              style={{ width: 110, height: 110 }}
            >
              <CircularProgressbar
                backgroundPadding={6}
                value={analytics?.messagesReceived}
                background={true}
                maxValue={(analytics?.messagesSent + analytics?.messagesReceived)? (analytics?.messagesSent + analytics?.messagesReceived) : 1}
                text={
                  isNaN(Math.floor(analytics?.messagesReceived / (analytics?.messagesSent + analytics?.messagesReceived) * 100))?
                  "0%"
                  :
                  `${Math.floor(analytics?.messagesReceived / (analytics?.messagesSent + analytics?.messagesReceived) * 100)}%`
                }
                styles={buildStyles({ pathTransitionDuration: 2 })}
              />
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 py-sm-0 py-1 mb-md-0 mb-sm-0 mb-5">
          <div className="analytic-card  text-center p-3 position-relative rounded-2">
            <div className="circular-container"></div>
            <div className="analytic-card-description mt-1">
              <h5 className="mt-2"> Chats joined </h5>
              <span className="fs-5"> {analytics?.chatsJoined} </span>
            </div>
            <div
              className="circular-progress  position-absolute"
              style={{ width: 110, height: 110 }}
            >
              <CircularProgressbar
                backgroundPadding={6}
                value={analytics?.chatsJoined}
                background={true}
                maxValue={users?.length}
                text={`${Math.floor(analytics?.chatsJoined / users?.length*100)}%`}
                styles={buildStyles({ pathTransitionDuration: 2 })}
              />
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 py-sm-0 py-1 ">
          <div className="analytic-card  text-center p-3 position-relative rounded-2">
            <div className="circular-container"></div>
            <div className="analytic-card-description mt-1">
              <h5 className="mt-2"> Groups joined </h5>
              <span className="fs-5"> {analytics?.groupsJoined} </span>
            </div>
            <div
              className="circular-progress  position-absolute"
              style={{ width: 110, height: 110 }}
            >
              <CircularProgressbar
                backgroundPadding={6}
                value={(analytics?.groupsJoined)}
                background={true}
                maxValue={(analytics?.groupsJoined + analytics?.chatsJoined) == 0? 1 : (analytics?.groupsJoined + analytics?.chatsJoined)}
                text={isNaN(`${Math.floor(analytics?.groupsJoined / (analytics?.chatsJoined + analytics?.groupsJoined)*100)}%`) ? "0%" : `${Math.floor(analytics?.groupsJoined / (analytics?.chatsJoined + analytics?.groupsJoined)*100)}%`}
                styles={buildStyles({ pathTransitionDuration: 2 })}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 my-3">
          <div className="control-panel-section  p-3 rounded-2">
            <h3>Control panel</h3>
            <p>
              {" "}
              User-friendly control panel for managing chat features and
              settings on the website.{" "}
            </p>
            <div className="control-panel-buttons my-2 text-center">
              <button className="btn  w-75 my-2" onClick={()=>{setAlert({type:'info', message:'Coming soon!'}); handleClick()}}>
                {" "}
                Create chat{" "}
              </button>
              <button className="btn  w-75 my-2" data-bs-toggle="modal"
                data-bs-target="#exampleModal">
                {" "}
                Create group{" "}
              </button>
              <button className="btn  w-75 my-2" onClick={()=>{setAlert({type:'info', message:'Coming soon!'}); handleClick()}}>
                {" "}
                Edit profile image{" "}
              </button>
              <Link to='/home/profile'>
                <button className="btn  w-75 my-2">
                  {" "}
                  Edit personal information{" "}
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-6 my-3">
          <div className="users  pt-3 px-3 rounded-2 mb-3">
            <h3> Users </h3>
            <ul className="items  px-0">
              {
                users?
                users?.map((person, idx)=>{
                  return<>
                  {
                    person._id === user._id?
                    ''
                    :
                    <li className="offline item" key={idx}>
                      <div className="image-wrapper position-relative">
                        <Avatar
                          alt="Remy Sharp"
                          src={person?.profilePic?.secure_url}
                          sx={{ width: 85, height: 85 }}
                        />
                        {
                          person?.isOnline?
                          ''
                          :
                          <div className="offline-layer position-absolute top-0 rounded-circle bg-offline  w-100 h-100"></div>
                        }
                      </div>
                      <h6> {person?.firstName} {person?.lastName} </h6>
                    </li>
                  }

                  </>
                })
                :
                <p className=" mx-3 my-2 fs-5"> Loading... </p>
              }
            </ul>
          </div>
          <div className="recent-chats  p-3 pb-2 rounded-2">
            <h3> Recent chats </h3>
            <div className="chats">
              <ul className="items px-0 my-0 py-0">
              {
                recent?
                recent?.map((conversation, idx)=>{
                  return<>
                  {
                    conversation.type === "chat"?
                      <li className="offline item text-center mb-0 mx-2 px-0" key={idx}>
                        <div className="image-wrapper position-relative">
                          <Avatar
                            alt="Remy Sharp"
                            src={conversation.users[0]?.profilePic?.secure_url}
                            sx={{ width: 85, height: 85 }}
                          />
                          {
                            conversation.users[0]?.isOnline?
                            ''
                            :
                            <div className="offline-layer position-absolute top-0 rounded-circle bg-offline  w-100 h-100"></div>
                          }
                        </div>
                        <h6> {conversation.users[0]?.firstName} {conversation.users[0]?.lastName} </h6>
                      </li>
                    :
                    <li className="offline item text-center mb-0 mx-2 px-0" key={idx}>
                      <div className="image-wrapper position-relative">
                        <Avatar
                          alt="Remy Sharp"
                          src={conversation?.details?.groupImageURL}
                          sx={{ width: 85, height: 85 }}
                        />
                          <div className="offline-layer position-absolute top-0 rounded-circle bg-offline  w-100 h-100"></div>
                      </div>
                      <h6> {conversation?.details?.name} </h6>
                    </li>
                  }
                    
                  </>
                })
                :
                <p className=" mx-3 my-2 fs-5"> Loading... </p>
              }
                
                
              </ul>
            </div>
          </div>
        </div>

      </div>
      </div>
        :
<div className=" w-100 h-100 d-flex justify-content-center align-items-center">
            <div class="sk-circle">
              <div class="sk-circle1 sk-child"></div>
              <div class="sk-circle2 sk-child"></div>
              <div class="sk-circle3 sk-child"></div>
              <div class="sk-circle4 sk-child"></div>
              <div class="sk-circle5 sk-child"></div>
              <div class="sk-circle6 sk-child"></div>
              <div class="sk-circle7 sk-child"></div>
              <div class="sk-circle8 sk-child"></div>
              <div class="sk-circle9 sk-child"></div>
              <div class="sk-circle10 sk-child"></div>
              <div class="sk-circle11 sk-child"></div>
              <div class="sk-circle12 sk-child"></div>
            </div>
          </div>
      }
    </div>
  );
}
