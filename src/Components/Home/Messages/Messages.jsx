import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import "./Messages.css";
import { useOutletContext, useParams } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../../../index.js";
import { socket } from "../../../socket.js";
import Skeleton from "@mui/material/Skeleton";

export default function Messages() {
  const [users, user, config] = useOutletContext();
  const [loadChat, setLoadChat] = useState(false);
  const [chats, setChats] = useState(null);
  const [chat, setChat] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [friendId, setFriendId] = useState(null);
  let selected;



  // const [message, setMessage] = useState(second)
  const getChats = async () => {
    socket.off("getChats");
    const result = await axios
      .get(`${baseURL}/conversation/user/chats`, config)
      .catch((err) => console.log(err));
    if (result?.data?.message === "done") {
      if (result.data.chats) {
        setChats(result.data.chats);
      } else {
        setChats([]);
      }
    }
    // if(result?.data?.chats){
    //   displayChat(result?.data?.chats[0].users[0]._id,result?.data?.chats[0]._id )
    // }
  };


  const checkInLastSeen = (arr) => {
    const check = arr.find((element) => element === user?._id);
    if (!check) {
      return true;
    }
    return false;
  };

  const displayChat = async (
    friendId = friendId,
    conversationId = conversationId,
    flag
  ) => {
    const data = {
      conversationId,
      friendId,
    };
    selected = conversationId

    socket.emit("joinRoom", data);
    
    if (conversationId !== chat?._id && flag === 'M') {
      setLoadChat(true);
    }else{
      setLoadChat(false)
    }
    // setChat(chat)
    const result = await axios
      .get(`${baseURL}/conversation/chat/${conversationId}`, config)
      .catch((err) => console.log(err));
    if (result?.data?.message === "done") {
      setChat(result.data.conversation);
    }
    setLoadChat(false);
  };

  const sendMessage = async () => {
    socket.emit("sendMessage", { conversationId, friendId });
    let messageBody = document.getElementById("message").value;
    if (messageBody === "") {
      alert("Can't send empty message");
    } else {
      document.getElementById("message").value = "";
      const result = await axios.post(
        `${baseURL}/message/add/${chat?._id}`,
        {
          content: messageBody,
          type: "chat",
        },
        config
      );
      if (result?.data?.message === "done") {
        getChats();
        let temp = { ...chat };
        let message = {
          content: messageBody,
          sender: {
            profilePic: user.profilePic,
            _id: user?._id,
            firstName: user.firstName,
            lastName: user.lastName,
          },
          createdAt: Date.now(),
        };
        temp.messages.push(message);
        setChat(temp);
      }
    }
  };

  const addConversation = async (friendId) => {
    const check = chats.find((chat) => chat?.users[0]?._id === friendId);
    if (!check) {
      const result = await axios.post(
        `${baseURL}/conversation/add`,
        {
          type: "chat",
          users: [friendId],
        },
        config
      );

      if (result?.data?.message === "done") {
        getChats();
      }
    }
    // const check = chats?.users
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

  let element = document.getElementById("chat-body");
  if (element) {
    element.scrollTop = element.scrollHeight;
  }
  useEffect(() => {
    setSlider(document.querySelector(".items"));
    getChats();

  }, []);

  socket.on("getChats", (data) => {
    if (data === user?._id) {
      getChats();
    }
  });

  socket.on("displayChat", (data) => {
    console.log(data.conversationId,chat?._id )
    if(data?.conversationId === chat?._id){
        displayChat(data.friendId, data?.conversationId);
    }
  });
  useEffect(() => {

    return () => {
      socket.off("displayChat");
      socket.off("getChats");
    };
  }, []);

  return (
    <>
      <div className="col-lg-10 col-12">
        {chats ? (
          <div className="row  min-vh-100 mt-md-0 mt-5 pt-lg-0 pt-5">
            <div className="col-lg-5 col-md-5 messages-section">
              <div className="wrapper">
                <div className="row">
                  <div className="d-flex justify-content-between align-content-center p-3 pb-0">
                    <h3 className="my-0"> Messages </h3>
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
                          <i className="fa-solid fa-magnifying-glass"></i>
                          {/* <span className="mglass">&#9906;</span> */}
                        </label>
                      </form>
                    </div>
                  </div>
                  <div className="all-groups online-people">
                    <h6 className="mb-2  ms-2 mt-2">Online</h6>
                    <ul className="items px-0 all-groups d-flex">
                      {users ? (
                        users?.map((person, idx) => {
                          return person?._id === user?._id ? (
                            ""
                          ) : (
                            <li
                              className="item position-relative"
                              onClick={() => {
                                addConversation(person?._id);
                              }}
                            >
                              {person?.isOnline ? (
                                <i className="fa-solid fa-circle position-absolute z-2 text-success me-2"></i>
                              ) : (
                                <div className="offline-layer position-absolute z-2 top-0 rounded-circle bg-offline  w-100 h-100"></div>
                              )}
                              <Avatar
                                alt="Remy Sharp"
                                src={person?.profilePic?.secure_url}
                                sx={{ width: 50, height: 50 }}
                              />
                            </li>
                          );
                        })
                      ) : (
                        <p className="fs-6 ms-3"> Loading... </p>
                      )}
                    </ul>
                  </div>
                </div>
                <div className="accordion" id="accordionExample">
                  {/* <div className="accordion-item mt-2">
                    <h2 className="accordion-header" id="headingOne">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseOne"
                        aria-expanded="true"
                        aria-controls="collapseOne"
                      >
                        <div className="d-flex align-items-center ">
                          <i className="fa-solid fa-location-dot me-2"></i>
                          <h6 className="my-0">Pinned Messages</h6>
                        </div>
                      </button>
                    </h2>
                    <div
                      id="collapseOne"
                      className="accordion-collapse collapse"
                      aria-labelledby="headingOne"
                      data-bs-parent="#accordionExample"
                    >
                      <div className="accordion-body p-0 ">
                        <div className="message d-flex border-bottom pb-2 px-2">
                          <div className="friend-img me-2">
                            <Avatar
                              alt="Remy Sharp"
                              src="/static/images/avatar/1.jpg"
                              sx={{ width: 50, height: 50 }}
                            />
                          </div>
                          <div className="friend-data w-100">
                            <div className="upper d-flex justify-content-between">
                              <p className="h6 text-truncate"> Peter Sameh </p>
                              <p className="date text-muted"> </p>
                            </div>
                            <div className="last-message text-truncate">
                              Hello my friend
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> */}
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
                          <h6 className="my-0">All Messages</h6>
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
                        {chats ? (
                          chats.length ? (
                            chats?.map((chat, idx) => {
                              return (
                                <div key={idx}>
                                  <div
                                    className={
                                      "message d-flex border-bottom pb-2 px-2"
                                    }
                                    onClick={() => {
                                      setFriendId(chat?.users[0]?._id);
                                      setConversationId(chat?._id);
                                      displayChat(
                                        chat?.users[0]?._id,
                                        chat?._id,
                                        'M'
                                      );
                                    }}
                                  >
                                    <div className="friend-img me-2">
                                      <Avatar
                                        alt="Remy Sharp"
                                        src={
                                          chat?.users[0]?.profilePic?.secure_url
                                        }
                                        sx={{ width: 50, height: 50 }}
                                      />
                                    </div>
                                    <div className="friend-data w-100 position-relative">
                                      {chat?.lastMessage?.sender?._id !==
                                        user?._id &&
                                      checkInLastSeen(chat?.lastSeen) && chat?.lastMessage ? (
                                        <div className="notify position-absolute end-0 top-25">
                                          <i class="fa-solid fa-square-envelope fa-lg text-danger"></i>
                                        </div>
                                      ) : (
                                        ""
                                      )}

                                      <div className="upper d-flex justify-content-between">
                                        <p className="h6 text-truncate">
                                          {" "}
                                          {chat?.users[0]?.firstName}{" "}
                                          {chat?.users[0]?.lastName}{" "}
                                        </p>
                                        <p className="date text-muted">
                                          {chat?.lastMessage ? (
                                            <>
                                              {new Date(
                                                chat?.lastMessage?.createdAt
                                              ).getHours() > 12
                                                ? new Date(
                                                    chat?.lastMessage?.createdAt
                                                  ).getHours() - 12
                                                : new Date(
                                                    chat?.lastMessage?.createdAt
                                                  ).getHours()}
                                              {":" +
                                                (new Date(
                                                  chat?.lastMessage?.createdAt
                                                ).getMinutes() +
                                                  1)}{" "}
                                              {new Date(
                                                chat?.lastMessage?.createdAt
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
                                        {
                                          chat?.lastMessage?
                                        chat?.lastMessage?.sender?._id ===
                                        user?._id ? (
                                          <p>
                                            {" "}
                                            You: {
                                              chat?.lastMessage?.content
                                            }{" "}
                                          </p>
                                        ) : (
                                          <p>
                                            {" "}
                                            {
                                              chat?.lastMessage?.sender
                                                ?.firstName
                                            }{" "}
                                            {
                                              chat?.lastMessage?.sender
                                                ?.lastName
                                            }
                                            : {chat?.lastMessage?.content}{" "}
                                          </p>
                                        ):''
                                      }
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <p className="fs-5 p-3">No Chats...</p>
                          )
                        ) : (
                          <p className="p-3"> Loading... </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col px-0 ">
              {
                <div className="wrapper chat mt-md-0 mt-3" id="chat-page">
                  <div className="chat-header py-4 d-flex ps-4 align-items-center">
                    {!loadChat ? (
                      <>
                        <Avatar
                          alt="Remy Sharp"
                          src={chat?.users[0]?.profilePic?.secure_url}
                          sx={{ width: 56, height: 56 }}
                        />
                        <div className="chat-header-data ms-3">
                          <h3>
                            {" "}
                            {chat?.users[0]?.firstName}{" "}
                            {chat?.users[0]?.lastName}{" "}
                          </h3>
                          {chat ? (
                            chat?.users[0]?.isOnline ? (
                              <div className="d-flex status align-items-center">
                                <i className="fa-solid fa-circle text-success me-2"></i>
                                <p>Online</p>
                              </div>
                            ) : (
                              <div className="d-flex status align-items-center">
                                <i className="fa-solid fa-circle text-danger me-2"></i>
                                <p>Offline</p>
                              </div>
                            )
                          ) : (
                            ""
                          )}
                        </div>
                      </>
                    ) : (
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
                    )}
                  </div>
                  <div className="chat-body px-3 pt-3" id="chat-body">
                    {loadChat ? (
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
                    ) : (
                      chat?.messages?.map((message, idx) => {
                        return (
                          <div
                            key={idx}
                            className={
                              message?.sender?._id === user?._id
                                ? "d-flex justify-content-end"
                                : "d-flex"
                            }
                          >
                            <div
                              className={
                                message?.sender?._id === user?._id
                                  ? "message mb-2 px-1 px-sm-2 d-flex flex-row-reverse owner"
                                  : "message px-1 px-sm-2 mb-2 d-flex friend"
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
                                  <p className="date text-muted d-none d-sm-block mx-2">
                                    {new Date(message?.createdAt).getHours() >
                                    12
                                      ? new Date(
                                          message?.createdAt
                                        ).getHours() - 12
                                      : new Date(message?.createdAt).getHours()}
                                    {":" +
                                      (new Date(
                                        message?.createdAt
                                      ).getMinutes() +
                                        1)}{" "}
                                    {new Date(message?.createdAt).getHours() >
                                    12
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
                      })
                    )}
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
              }
            </div>
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
