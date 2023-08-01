import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import EmojiPicker from "emoji-picker-react";
import "./Groups.css";
import axios from "axios";
import { baseURL } from "../../../index.js";
import { useOutletContext } from "react-router-dom";
import { socket } from "../../../socket.js";
import { Skeleton } from "@mui/material";

export default function Groups() {
  const [users, user, config, setAlert, handleClick] = useOutletContext();
  const [loadChat, setLoadChat] = useState(false);
  const [allGroups, setAllGroups] = useState(null);
  const [group, setGroup] = useState(null);
  const [addGroup, setAddGroup] = useState(null);

  const getAllGroups = async () => {
    const result = await axios
      .get(`${baseURL}/group/all`, config)
      .catch((err) => console.log(err));
    if (result?.data?.message === "done") {
      setAllGroups(result.data);
    }
  };


  const getUserGroups = async () => {
    const result = await axios
      .get(`${baseURL}/group/user/groups`, config)
      .catch((err) => console.log(err));
    if (result?.data?.message === "done") {
      let temp = { ...allGroups };
      temp.userGroups = result.data.groups;
      setAllGroups(temp);
    }
  };

  const checkInLastSeen = (arr) => {
    const check = arr?.find((element) => element === user?._id);
    if (!check) {
      return true;
    }
    return false;
  };

  const displayChat = async (groupId, flag) => {
    const data = {
      conversationId: groupId,
    };
    socket.emit("joinRoom", data);

    if (groupId !== group?._id && flag === 'M') {
      setLoadChat(true);
    }else{
      setLoadChat(false)
    }

    const result = await axios
      .get(`${baseURL}/group/${groupId}/messages`, config)
      .catch((err) => console.log(err));
    if (result?.data?.message === "done") {
      setGroup(result.data.group);
    }
    setLoadChat(false);
  };

  const clearInput = () => {
    document.getElementById("groupPassword").value = "";
  };
  const joinGroup = async () => {
    let password = "";
    if (addGroup.password) {
      password = document.getElementById("groupPassword").value;
    }
    const result = await axios
      .patch(
        `${baseURL}/group/join`,
        {
          groupId: addGroup?._id,
          password: password,
        },
        config
      )
      .catch((err) => {
        alert(err.response.data.message);
        clearInput();
      });

    if (result?.data?.message === "done") {
      alert("Joined!");
      let temp = { ...allGroups };
      temp.userGroups.push(addGroup);
      getAllGroups();
    }
  };

  const sendMessage = async () => {
    socket.emit("sendMessage", { conversationId: group?._id, friendId: "" });
    let messageBody = document.getElementById("message").value;
    if (messageBody === "") {
      alert("Can't send empty message");
    } else {
      document.getElementById("message").value = "";
      const result = await axios.post(
        `${baseURL}/message/add/${group.conversation}`,
        {
          content: messageBody,
          type: "group",
        },
        config
      );
      if (result?.data?.message === "done") {
        getUserGroups();
        let temp = { ...group };
        let message = {
          content: messageBody,
          sender: {
            profilePic: { secure_url: user.profilePic.secure_url },
            _id: user?._id,
            firstName: user.firstName,
            lastName: user.lastName,
          },
          createdAt: Date.now(),
        };
        temp.messages.push(message);
        setGroup(temp);
      }
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
    getAllGroups();
    // getUserGroups();
  }, []);

  socket.on("getChats", (data) => {
    console.log(data);

    getUserGroups();
  });
  socket.on("displayChat", (data) => {
    displayChat(data.conversationId);

  });
  useEffect(() => {
    
    return () => {
      socket.off("displayChat");
      socket.off("getChats");
    };
  }, []);

  return (
    <>
      <div className="col-lg-10 col-12 groups">
        {allGroups ? (
          <div className="row  min-vh-100 mt-md-0 mt-5 pt-lg-0 pt-5">
            <div className="col-lg-5 col-md-5 messages-section ">
              <div className="wrapper">
                <div className="row">
                  <div className="d-flex justify-content-between p-3 pb-0">
                    <h3 className=" "> Groups </h3>
                    <div className="search-container mt-0">
                      <form action="/search" method="get">
                        <input
                          className="search expandright"
                          id="searchright"
                          type="search"
                          name="q"
                          placeholder="Search"
                        />
                        <label
                          className="button searchbutton text-center"
                          htmlFor="searchright"
                        >
                          <i className="fa-solid fa-magnifying-glass "></i>
                        </label>
                      </form>
                    </div>
                  </div>
                  <div className="all-groups">
                    <h6 className="mb-2  ms-2 mt-2">Available Groups</h6>
                    <ul className="items px-0 all-groups my-0 d-flex align-items-start">
                      <li
                        className="item active_add "
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                      >
                        <Avatar
                          alt="Remy Sharp"
                          src="https://cdn1.iconfinder.com/data/icons/content-10/24/usergroup-plus-512.png"
                          sx={{ width: 50, height: 50 }}
                        />
                      </li>

                      {allGroups ? (
                        allGroups?.groups?.map((group, idx) => {
                          return (
                            <li
                              className="offline item text-center"
                              key={idx}
                              data-bs-toggle="modal"
                              data-bs-target="#joinGroup"
                              onClick={() => {
                                setAddGroup(group);
                              }}
                            >
                              <div className="image-wrapper position-relative">
                                <Avatar
                                  alt="Remy Sharp"
                                  src={group?.groupImageURL}
                                  sx={{ width: 50, height: 50 }}
                                />
                              </div>
                              <h6> {group?.name} </h6>
                            </li>
                          );
                        })
                      ) : (
                        <p className=" m-3 fs-6"> Loading... </p>
                      )}
                    </ul>
                  </div>
                </div>
                <div className="accordion" id="accordionExample">
                  <div className="accordion-item mt-2">
                    <h2 className="accordion-header" id="headingTwo">
                      <button
                        className="accordion-button"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseTwo"
                        aria-expanded="true"
                        aria-controls="collapseTwo"
                      >
                        <div className="d-flex align-items-center ">
                          <i className="fa-solid fa-location-dot me-2"></i>
                          <h6 className="my-0">All Groups</h6>
                        </div>
                      </button>
                    </h2>
                    <div
                      id="collapseTwo"
                      className="accordion-collapse collapse show"
                      aria-labelledby="headingTwo"
                      data-bs-parent="#accordionExample"
                    >
                      <div className="accordion-body p-0 ">
                        {allGroups ? (
                          allGroups?.userGroups.length ? (
                            allGroups?.userGroups?.map((group) => {
                              return (
                                <div
                                  className="message d-flex border-bottom pb-2 px-2"
                                  key={group?._id}
                                  onClick={() => {
                                    displayChat(group?._id,'M');
                                  }}
                                >
                                  <div className="friend-img me-2">
                                    <Avatar
                                      alt="Remy Sharp"
                                      src={group?.groupImageURL}
                                      sx={{ width: 50, height: 50 }}
                                    />
                                  </div>
                                  <div className="friend-data w-100 position-relative">
                                    {group?.lastMessage?.sender?._id !==
                                      user?._id &&
                                    checkInLastSeen(group?.lastSeen) && group?.lastMessage ? (
                                      <div className="notify position-absolute end-0 top-25">
                                        <i class="fa-solid fa-square-envelope fa-lg text-danger"></i>
                                      </div>
                                    ) : (
                                      ""
                                    )}
                                    <div className="upper d-flex justify-content-between">
                                      <p className="h6 text-truncate">
                                        {" "}
                                        {group?.name}{" "}
                                      </p>
                                      <p className="date mx-2">
                                        {group?.lastMessage ? (
                                          <>
                                            {new Date(
                                              group?.lastMessage?.createdAt
                                            ).getHours() > 12
                                              ? new Date(
                                                  group?.lastMessage?.createdAt
                                                ).getHours() - 12
                                              : new Date(
                                                  group?.lastMessage?.createdAt
                                                ).getHours()}
                                            {":" +
                                              (new Date(
                                                group?.lastMessage?.createdAt
                                              ).getMinutes() +
                                                1)}{" "}
                                            {new Date(
                                              group?.lastMessage?.createdAt
                                            ).getHours() > 12
                                              ? "PM"
                                              : "AM"}
                                          </>
                                        ) : (
                                          ""
                                        )}{" "}
                                      </p>
                                    </div>
                                    <div className="last-message text-truncate">
                                      {group?.lastMessage ? (
                                        group?.lastMessage?.sender?._id ===
                                        user?._id ? (
                                          <p>
                                            {" "}
                                            You: {
                                              group?.lastMessage?.content
                                            }{" "}
                                          </p>
                                        ) : (
                                          <p>
                                            {" "}
                                            {
                                              group?.lastMessage?.sender
                                                ?.firstName
                                            }{" "}
                                            {
                                              group?.lastMessage?.sender
                                                ?.lastName
                                            }
                                            {" : "}
                                            {group?.lastMessage?.content}{" "}
                                          </p>
                                        )
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <p className="fs-5 p-3"> No Groups... </p>
                          )
                        ) : (
                          <p className=" m-3 fs-6"> Loading... </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col mt-sm-0 mt-2 px-0">
              <div className="wrapper chat mt-md-0 mt-3">
                <div className="chat-header py-4 d-flex ps-4 align-items-center">
                  {
                    loadChat?
                    <>
                        <Skeleton
                          animation="wave"
                          variant="circular"
                          width={56}
                          height={56}
                        />
                        <div className="chat-header-data ms-3 w-25">
                          <h3>
                            <Skeleton
                              animation="wave"
                              height={20}
                              width="100%"
                              style={{ marginBottom: 6 }}
                            />
                          </h3>
                          <Skeleton
                            animation="wave"
                            height={20}
                            width="50%"
                            style={{ marginBottom: 6 }}
                          />
                        </div>
                      </>
                    :
                    <>
                      <Avatar
                        alt="Remy Sharp"
                        src={group?.groupImageURL}
                        sx={{ width: 56, height: 56 }}
                      />
                      <div className="chat-header-data ms-3">
                        <h3> {group?.name} </h3>
                        <div className="d-flex status">
                          {group?.members?.map((member, idx) => {
                            return (
                              <div key={member?._id} className="d-flex">
                                <p className="">
                                  {" "}
                                  {member?.firstName} {member?.lastName}{" "}
                                </p>
                                {idx === group.members.length - 1 ? (
                                  <p className="me-2"> . </p>
                                ) : (
                                  <p className="me-2"> , </p>
                                )}
                                <p></p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  }
                </div>
                <div className="chat-body px-3 pt-3">
                  {
                    loadChat?
                    <>
                        <div className="d-flex w-100 mb-4">
                          <Skeleton
                            animation="wave"
                            variant="circular"
                            width={56}
                            height={56}
                          />
                          <div className="person-data w-100 ms-2 mt-1">
                            <Skeleton
                              animation="wave"
                              height={20}
                              width="16%"
                              style={{ marginBottom: 6 }}
                            />
                            <Skeleton
                              animation="wave"
                              height={20}
                              width="100%"
                              style={{ marginBottom: 6 }}
                            />
                          </div>
                        </div>
                        <div className="d-flex w-100 mb-4 flex-row-reverse">
                          <Skeleton
                            animation="wave"
                            variant="circular"
                            width={56}
                            height={56}
                          />
                          <div className="person-data w-100 me-2 mt-1">
                            <Skeleton
                              animation="wave"
                              height={20}
                              width="16%"
                              className="ms-auto"
                              style={{ marginBottom: 6 }}
                            />
                            <Skeleton
                              animation="wave"
                              height={20}
                              width="100%"
                              style={{ marginBottom: 6 }}
                            />
                          </div>
                        </div>
                        <div className="d-flex w-100 mb-4">
                          <Skeleton
                            animation="wave"
                            variant="circular"
                            width={56}
                            height={56}
                          />
                          <div className="person-data w-100 ms-2 mt-1">
                            <Skeleton
                              animation="wave"
                              height={20}
                              width="16%"
                              style={{ marginBottom: 6 }}
                            />
                            <Skeleton
                              animation="wave"
                              height={20}
                              width="100%"
                              style={{ marginBottom: 6 }}
                            />
                          </div>
                        </div>
                        <div className="d-flex w-100 mb-4 flex-row-reverse">
                          <Skeleton
                            animation="wave"
                            variant="circular"
                            width={56}
                            height={56}
                          />
                          <div className="person-data w-100 me-2 mt-1">
                            <Skeleton
                              animation="wave"
                              height={20}
                              width="16%"
                              className="ms-auto"
                              style={{ marginBottom: 6 }}
                            />
                            <Skeleton
                              animation="wave"
                              height={20}
                              width="100%"
                              style={{ marginBottom: 6 }}
                            />
                          </div>
                        </div>
                        <div className="d-flex w-100 mb-4">
                          <Skeleton
                            animation="wave"
                            variant="circular"
                            width={56}
                            height={56}
                          />
                          <div className="person-data w-100 ms-2 mt-1">
                            <Skeleton
                              animation="wave"
                              height={20}
                              width="16%"
                              style={{ marginBottom: 6 }}
                            />
                            <Skeleton
                              animation="wave"
                              height={20}
                              width="100%"
                              style={{ marginBottom: 6 }}
                            />
                          </div>
                        </div>
                        <div className="d-flex w-100 mb-4 flex-row-reverse">
                          <Skeleton
                            animation="wave"
                            variant="circular"
                            width={56}
                            height={56}
                          />
                          <div className="person-data w-100 me-2 mt-1">
                            <Skeleton
                              animation="wave"
                              height={20}
                              width="16%"
                              className="ms-auto"
                              style={{ marginBottom: 6 }}
                            />
                            <Skeleton
                              animation="wave"
                              height={20}
                              width="100%"
                              style={{ marginBottom: 6 }}
                            />
                          </div>
                        </div>
                      </>
                    :
                  group?.messages?.map((message, idx) => {
                    return (
                      <div
                        key={idx}
                        className={
                          message?.sender?._id === user?._id
                            ? "d-flex justify-content-end "
                            : "d-flex"
                        }
                      >
                        <div
                          className={
                            message?.sender?._id === user?._id
                              ? "message mb-2 px-1 px-sm-2 d-flex flex-row-reverse owner"
                              : "message px-1 px-sm-2 mb-2 d-flex"
                          }
                        >
                          <div className="friend-img me-2">
                            <Avatar
                              alt="Remy Sharp"
                              src={message?.sender?.profilePic?.secure_url}
                              sx={{ width: 50, height: 50 }}
                            />
                          </div>
                          <div
                            className={
                              message?.sender?._id === user?._id
                                ? "friend-data w-100 me-2"
                                : "friend-data w-100"
                            }
                          >
                            <div
                              className={
                                message?.sender?._id === user?._id
                                  ? "upper d-flex flex-row-reverse justify-content-between"
                                  : "upper d-flex justify-content-between"
                              }
                            >
                              <p className="h6 text-truncate">
                                {" "}
                                {message?.sender?.firstName}{" "}
                                {message?.sender?.lastName}{" "}
                              </p>
                              <p className="date mx-2 text-muted d-none d-sm-block">
                                {new Date(message?.createdAt).getHours() > 12
                                  ? new Date(message?.createdAt).getHours() - 12
                                  : new Date(message?.createdAt).getHours()}
                                {":" +
                                  (new Date(message?.createdAt).getMinutes() +
                                    1)}{" "}
                                {new Date(message?.createdAt).getHours() > 12
                                  ? "PM"
                                  : "AM"}
                              </p>
                            </div>
                            <div
                              className={
                                message?.sender?._id === user?._id
                                  ? "last-message ms-auto d-flex justify-content-end"
                                  : "last-message"
                              }
                            >
                              <p>{message?.content}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="send-message-section d-flex justify-content-between p-3">
                  <input
                    type="text"
                    className="form-control rounded-pill me-2 "
                    placeholder="Write your message..."
                    id="message"
                  />
                  <button
                    className="send-message-btn rounded-circle"
                    onClick={sendMessage}
                  >
                    {" "}
                    <i className="fa-solid fa-arrow-right"></i>{" "}
                  </button>
                </div>
              </div>
            </div>

            {/* Join Group Modal */}
            <div
              className="modal fade"
              id="joinGroup"
              tabIndex="-1"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">
                      Join Group: {addGroup?.name}
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>

                  <div className="modal-body">
                    {addGroup?.password ? (
                      <div className="d-flex my-2">
                        <label htmlFor="" className="me-0">
                          {" "}
                          password:{" "}
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          id="groupPassword"
                        />
                      </div>
                    ) : (
                      ""
                    )}
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      data-bs-dismiss="modal"
                      onClick={clearInput}
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      data-bs-dismiss="modal"
                      onClick={joinGroup}
                    >
                      Join
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* End of Modal */}
          </div>
        ) : (
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
        )}
      </div>
    </>
  );
}
