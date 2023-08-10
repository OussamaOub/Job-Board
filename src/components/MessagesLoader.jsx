import React, { useEffect, useRef, useState } from "react";
import { sendmessage } from "../config/supabase";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const formatDate = (date) => {
  const options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };
  return new Date(date).toLocaleString(undefined, options);
};

export default function MessagesLoader({ channel, user, handleerror }) {
  const [newmsg, setnewmsg] = useState("");
  const messageContainerRef = useRef(null);

  const scrollToBottom = () => {
    // Smooth scroll to the bottom of the messages container
    if (messageContainerRef.current) {
      const element = messageContainerRef.current;
      const scrollHeight = element.scrollHeight;
      const clientHeight = element.clientHeight;
      const maxScrollTop = scrollHeight - clientHeight;
      let currentScrollTop = element.scrollTop;

      const duration = 300; // Duration of the smooth scroll in milliseconds
      const step = 10; // The amount of scroll change in each step

      const scrollStep = () => {
        currentScrollTop += step;
        if (currentScrollTop >= maxScrollTop) {
          element.scrollTop = maxScrollTop;
        } else {
          element.scrollTop = currentScrollTop;
          requestAnimationFrame(scrollStep);
        }
      };

      requestAnimationFrame(scrollStep);
    }
  };

  useEffect(() => {
    // Scroll to the bottom of the messages container when component mounts or when new messages are added
    scrollToBottom();
  }, [channel.messages]);

  const handlesendmessage = async () => {
    if (newmsg.trim().length === 0) {
      Swal.fire("Empty Message", "Can't send an empty message", "error");
      handleerror("Can't send an empty message");
      return;
    }
    const msg = {
      sender: user.id,
      receiver:
        channel.user1_id === user.id ? channel.user2_id : channel.user1_id,
      content: newmsg,
      time: formatDate(new Date()), // Format the current date and time
    };
    const res = await sendmessage(msg, channel.id);
    if (res) handleerror(res);
    setnewmsg("");
  };

  if (Object.keys(channel).length === 0 && channel.constructor === Object)
    return (
      <div className="w-full h-full flex items-center justify-center">
        Click a channel to see
      </div>
    );

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -100 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-blue-600 text-center text-white p-6 rounded-b-lg font-semibold text-lg"
      >
        Chatting with{" "}
        {channel.user1_id === user.id ? channel.user2_name : channel.user1_name}
      </motion.header>

      {/* Main Content (Messages Area) */}
      <main
        ref={messageContainerRef} // Set the ref for the messages container
        className="flex-grow p-4 bg-white overflow-y-auto flex flex-col"
      >
        {channel.messages &&
          channel.messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${
                message.sender === user.id ? "self-end" : "self-start"
              }`}
            >
              <div
                className={`border rounded-md p-2 max-w-[300px] ${
                  message.sender === user.id
                    ? "bg-green-300 self-end"
                    : "bg-blue-300"
                }`}
                style={{ wordWrap: "break-word" }}
              >
                <p>{message.content}</p>
                <p className="text-sm text-gray-500">{message.time}</p>
              </div>
            </div>
          ))}
      </main>

      {/* Footer (Message Input Area) */}
      <motion.footer
        initial={{ opacity: 0, x: 100 }}
        animate={{ x: 0, opacity: 1 }}
        className="bg-blue-200 p-4"
      >
        <motion.input
          initial={{ opacity: 0, y: 100 }}
          animate={{ y: 0, opacity: 1 }}
          type="text"
          value={newmsg}
          placeholder="Message . . ."
          onChange={(e) => {
            setnewmsg(e.target.value);
          }}
          className="border rounded-xl p-2 w-full"
          onKeyDown={(k) => {
            if (k.key === "Enter") handlesendmessage(newmsg);
          }}
        />
      </motion.footer>
    </div>
  );
}
