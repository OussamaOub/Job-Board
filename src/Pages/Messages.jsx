import React, { useEffect, useRef, useState } from "react";
import AuthUser from "../components/AuthUser";
import Header from "../components/Header";
import { CircularProgress } from "@mui/material";
import Swal from "sweetalert2";
import { getchannelsbyuserid, supabase } from "../config/supabase";
import back from "../assets/back.svg";
import MessagesLoader from "../components/MessagesLoader";
import SearchMessages from "../components/SearchMessages";
import { motion } from "framer-motion";

export default function Messages() {
  const { user } = AuthUser();
  const [loading, setLoading] = useState(true);
  const [channels, setChannels] = useState([]);
  const [focusedChannel, setFocusedChannel] = useState({});
  const [tosearch, settosearch] = useState("");
  const [searchresults, setsearchresults] = useState([]);
  const refss = useRef();

  useEffect(() => {
    const handlechannelchange = () => {
      if (
        Object.keys(focusedChannel).length === 0 &&
        focusedChannel.constructor === Object
      )
        return;
      else {
        channels.forEach((channel) => {
          {
            if (channel.id === focusedChannel.id) {
              setFocusedChannel(channel);
            }
          }
        });
      }
    };
    handlechannelchange();
  }, [channels]);

  const handleChannelError = (err) => {
    console.warn(err);
  };

  const fetchchannelafterloading = async () => {
    const res = await getchannelsbyuserid(user.id);
    if (res.code) {
      handleChannelError(res);
      return;
    }
    setChannels(res);
  };

  useEffect(() => {
    const fetchChannels = async () => {
      if (!user) return;

      setLoading(true);
      setChannels([]);

      const res = await getchannelsbyuserid(user.id);
      if (res.code) {
        handleChannelError(res);
        setLoading(false);
        return;
      }

      setChannels(res);
      setLoading(false);
    };

    const subscribeToChannelUpdates = () => {
      const channel = supabase
        .channel("custom-update-channel")
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "channels" },
          () => {
            fetchchannelafterloading();
          }
        )
        .subscribe();
    };

    fetchChannels();
    subscribeToChannelUpdates();
    return () => {};
  }, [user]);

  if (!user || loading) {
    return (
      <div className="w-screen h-screen items-center justify-center flex">
        <CircularProgress />
      </div>
    );
  }

  return (
    <>
      <div className="Messages-Main">
        <main className="Side_bar">
          <motion.header
            initial={{ opacity: 0, y: -100 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-blue-600 p-4 rounded-b-lg flex flex-row items-center justify-around"
          >
            <img
              src={back}
              className="w-10 hover:scale-110 transition-all cursor-pointer"
              onClick={() => {
                history.back();
              }}
            />
            <p className="text-lg text-white">Messages</p>
          </motion.header>
          <section className=" w-full flex flex-col">
            {/* <SearchMessages
              tosearch={tosearch}
              settosearch={settosearch}
              handleresults={setsearchresults}
            /> */}

            {channels.map((channel, index) => (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                key={index}
                className={`flex-wrap min-h-[100px] max-h-[100px] transition-all flex flex-row p-4 gap-4 border  cursor-pointer ${
                  focusedChannel.id === channel.id
                    ? "bg-gray-200 border-black rounded-lg"
                    : "bg-gray-100 "
                }`}
                onClick={() => {
                  setFocusedChannel(channel);
                }}
              >
                <img
                  src={
                    channel.user1_id === user.id
                      ? channel.user2_pfp
                      : channel.user1_pfp
                  }
                  className="w-12 object-contain"
                />
                <main>
                  {" "}
                  {channel.user1_id === user.id
                    ? channel.user2_name
                    : channel.user1_name}
                </main>
              </motion.div>
            ))}
          </section>
        </main>
        <footer className="w-[70%] ">
          <MessagesLoader
            channel={focusedChannel}
            handleerror={handleChannelError}
            user={user}
          />
        </footer>
      </div>
    </>
  );
}
