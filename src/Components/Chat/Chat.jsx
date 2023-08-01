import React, { useState } from "react";
import "./Chat.css";
import { socket } from "../../socket.js";

export default function Chat() {
  const [messages, setMessages] = useState([]);
//   socket.emit("hi", "hi server");


  // const sendMsg = () => {
  //   const message = document.getElementById("message").value;
  //   document.getElementById("message").value = ''
  //   socket.emit("sendMessage", message)
  // }
  //   socket.on("connect",()=>{
  //     socket.emit("load")
  //   })
  

  return (
    <>
      {/* <div className="chat d-flex justify-content-center mt-5">
        <div className="w-75">
            <div className="chat-body bg-info vh-90">
                {
                    messages?.map((message) => {
                        return <>
                            <div className="message my-2 w-auto bg-warning p-3">
                                <p className='d-inline'>{message.body}</p>
                            </div>
                        </>
                    })
                }
            </div>
            <div className="send-message-section">
                <input type="text" className='form-control' placeholder='Write your message' id='message' />
                <button type="button" className='btn btn-outline-success ms-auto d-block' onClick={sendMsg}> Send </button>
            </div>
        </div>
    </div> */}
    </>
  );
}
