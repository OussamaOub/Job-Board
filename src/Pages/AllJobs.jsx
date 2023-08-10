import React, { useEffect, useState } from "react";
import AuthUser from "../components/AuthUser";
import { getalljobs } from "../config/supabase";
import { CircularProgress } from "@mui/material";
import Header from "../components/Header";
import ReactQuill from "react-quill";
import { Link } from "react-router-dom";
import { convertTimestampToReadable } from "./Blog";

export default function AllJobs() {
  const { user } = AuthUser();
  const [loading, setloading] = useState(true);
  const [alljobs, setalljobs] = useState([]);

  const handleerror = (err) => {
    console.warn("ERROROROROR: ", err);
  };

  useEffect(() => {
    const fetchjobs = async () => {
      setloading(true);
      setalljobs([]);
      const res = await getalljobs();
      if (res.code) {
        handleerror(res);
        setloading(false);
        return;
      }
      setalljobs(res);
      setloading(false);
    };
    if (user) fetchjobs();
  }, [user]);

  if (!user || loading === true) {
    return (
      <div className="w-screen h-screen items-center justify-center flex">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="w-full flex flex-col-reverse gap-8 items-center my-10">
        {alljobs.length > 0 &&
          alljobs.map((job, index) => {
            return (
              <Link
                to={`/ViewJob/${job.id}`}
                className={`border-2 w-1/2 flex flex-col hover:rounded-lg transition-all hover:border-black hover:scale-x-105`}
                key={index}
              >
                <section className="flex flex-row items-center py-2 border-b-2 justify-between transition-all hover:border-black">
                  <div className="flex flex-row items-center justify-start py-2 gap-8 min-h-[100px] max-h-[100px]">
                    <img
                      title={`${job.company_name}`}
                      src={job.company_pfp}
                      className="w-20 rounded-xl object-contain ml-4"
                    />
                    <p>{job.company_name}</p>
                  </div>
                  {user.id === job.user_id && (
                    <img
                      onClick={() => {
                        //   handledeletepost(blog);
                        console.log("Deleting: ", job);
                      }}
                      src="https://www.svgrepo.com/show/499798/delete.svg"
                      title="delete"
                      className="w-10 p-2 cursor-pointer hover:scale-105 transition-all"
                    />
                  )}
                </section>
                <p className="text-gray-500 font-extralight text-sm font-mono mx-4 mt-4">
                  {/* {convertTimestampToReadable(blog.created_at)} */}
                  Deadline: {convertTimestampToReadable(job.deadline)}
                </p>
                <ReactQuill
                  readOnly={true}
                  theme="bubble"
                  value={job.description}
                />
              </Link>
            );
          })}
      </div>
    </div>
  );
}
