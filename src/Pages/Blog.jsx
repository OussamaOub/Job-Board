import React, { useEffect, useState } from "react";
import AuthUser from "../components/AuthUser";
import {
  Box,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  Typography,
} from "@mui/material";
import Header from "../components/Header";
import Swal from "sweetalert2";
import { deletepost, getblogposts, postblogpost } from "../config/supabase";
import ReactQuill from "react-quill";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  height: "70%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function removeHtmlTags(str) {
  return str.replace(/<[^>]*>/g, "");
}

export function convertTimestampToReadable(timestamp) {
  const date = new Date(timestamp);
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const dayOfWeek = daysOfWeek[date.getDay()];
  const day = date.getDate();
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = ("0" + date.getMinutes()).slice(-2);
  const amOrPm = hours >= 12 ? "pm" : "am";
  const formattedHours = hours % 12 || 12;

  return `${dayOfWeek} ${day}, ${year} at ${formattedHours}:${minutes}${amOrPm}`;
}
const options = ["Delete post"];
const AddSVG = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      {" "}
      <path
        d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15"
        stroke="#1C274C"
        strokeWidth="1.5"
        strokeLinecap="round"
      ></path>{" "}
      <path
        d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7"
        stroke="#1C274C"
        strokeWidth="1.5"
        strokeLinecap="round"
      ></path>{" "}
    </g>
  </svg>
);

const AddingSVG = () => (
  <img src="https://mapwv.gov/huntfish/map/images/loading.gif" />
);

export default function Blog() {
  const { user } = AuthUser();
  const [loading, setloading] = useState(true);
  const [blogposts, setblogposts] = useState([]);
  const [iserror, setiserror] = useState(null);
  const [iswriting, setiswriting] = useState(false);
  const [blogcontent, setblogcontent] = useState("");
  const [open, setopen] = useState(false);
  const [flag, setflag] = useState(true);

  const handledeletepost = async (post) => {
    setloading(true);
    const res = await deletepost(post.id, user.id);
    if (res) {
      handleerror(res);
      setloading(false);
      return;
    }
    setflag(!flag);
    setloading(false);
  };

  const handlesendpost = async () => {
    if (removeHtmlTags(blogcontent).trim() === "") {
      alert("Don't write empty posts!!");
      return;
    }
    setloading(true);
    const newpost = {
      user_name: user.user_metadata.name,
      user_id: user.id,
      content: blogcontent,
      user_img: user.user_metadata.pfp,
    };
    const res = await postblogpost(newpost);
    if (res) {
      handleerror(res);
      setloading(false);
      return;
    }
    setflag(!flag);
    setiswriting(false);
    setloading(false);
  };

  const handleerror = (err) => {
    setiserror(err);
    Swal.fire("Error", err.message, "error");
  };
  useEffect(() => {
    const fetchblogposts = async () => {
      setloading(true);
      setblogposts([]);
      const res = await getblogposts();
      if (res.code) {
        handleerror(res);
        setiserror(true);
        setloading(false);
      }
      setblogposts(res);
      setloading(false);
    };
    fetchblogposts();
  }, [flag]);

  if (!user || loading === true) {
    return (
      <div className="w-screen h-screen items-center justify-center flex">
        <CircularProgress />
      </div>
    );
  }
  return (
    <>
      <div className="w-full relative flex flex-col min-w-[525px]">
        <Header />
        {blogposts.length === 0 && (
          <div className="w-full h-screen flex items-center justify-center min-w-[525px]">
            The blog is currently empty
          </div>
        )}
        <Modal
          open={iswriting}
          onClose={() => setiswriting(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              className="text-center"
            >
              Write a post
            </Typography>
            <img
              className="absolute top-4 right-4 w-8 cursor-pointer transition-all hover:scale-110"
              src="https://www.svgrepo.com/show/469752/send-alt.svg"
              onClick={() => {
                handlesendpost();
              }}
            />
            <ReactQuill
              theme="snow"
              className="h-[80%]"
              onChange={(e) => {
                setblogcontent(e);
              }}
              value={blogcontent}
            />
          </Box>
        </Modal>
        <div className="w-full flex flex-col-reverse gap-8 items-center my-10">
          {blogposts.length > 0 &&
            blogposts.map((blog, index) => {
              return (
                <div className="border-2 w-1/2 flex flex-col" key={index}>
                  <section className="flex flex-row items-center py-2 border-b-2 justify-between">
                    <div className="flex flex-row items-center justify-start py-2 gap-8 min-h-[100px] max-h-[100px]">
                      <img
                        title="Post"
                        src={blog.user_img}
                        className="w-20 rounded-xl object-contain ml-4"
                      />
                      <p>{blog.user_name}</p>
                    </div>
                    {user.id === blog.user_id && (
                      <img
                        onClick={() => {
                          handledeletepost(blog);
                        }}
                        src="https://www.svgrepo.com/show/499798/delete.svg"
                        title="delete"
                        className="w-10 p-2 cursor-pointer hover:scale-105 transition-all"
                      />
                    )}
                  </section>
                  <p className="text-gray-500 font-extralight text-sm font-mono mx-4 mt-4">
                    {convertTimestampToReadable(blog.created_at)}
                  </p>
                  <ReactQuill
                    readOnly={true}
                    theme="bubble"
                    value={blog.content}
                  />
                </div>
              );
            })}
        </div>
      </div>

      <div className="w-full sticky right-4 bottom-4 transition-all">
        <div
          className={
            "w-10 cursor-pointer transition-all hover:scale-110 absolute right-4 bottom-4"
          }
          onClick={() => {
            setiswriting(!iswriting);
          }}
        >
          {iswriting ? <AddingSVG /> : <AddSVG />}
        </div>
      </div>
    </>
  );
}
