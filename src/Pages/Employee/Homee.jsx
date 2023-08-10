import React, { useEffect, useRef, useState } from "react";
import AuthUser from "../../components/AuthUser";
import Header from "../../components/Header";
import { CircularProgress } from "@mui/material";
import { getapplicantjobs } from "../../config/supabase";
import Swal from "sweetalert2";
import Search from "../../components/Search";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Homee() {
  const { user } = AuthUser();
  const refss = useRef();
  const [loading, setloading] = useState(true);
  const [recentjobs, setrecentjobs] = useState([]);
  const [tosearch, settosearch] = useState("");
  const navigate = useNavigate();

  const handleerror = (err) => {
    Swal.fire("Error", err.message, "error");
  };

  useEffect(() => {
    const fetchrecentjobs = async () => {
      setloading(true);
      setrecentjobs([]);
      const res = await getapplicantjobs(user.id);
      if (res.code) {
        handleerror(res);
        setloading(false);
        return;
      }
      setrecentjobs(res);
      setloading(false);
    };
    if (user && user.user_metadata.type === "employee") fetchrecentjobs();
    else if (user && user.user_metadata.type === "employer") navigate("/Homer");
  }, [user]);

  if (!user || loading === true) {
    return (
      <div className="w-screen h-screen items-center justify-center flex">
        <CircularProgress />
      </div>
    );
  }
  return (
    <>
      <Header />
      <header className="Welcome_msg min-w-[525px]">
        <motion.p
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Welcome back {user.user_metadata.name}
        </motion.p>
      </header>
      <Search tosearch={tosearch} settosearch={settosearch} refss={refss} />
      <h1 className="m-4 text-3xl font-bold font-mono min-w-[525px]">
        Your Recent Applications:
      </h1>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.3 }}
        className="Recent_jobs_Container min-w-[525px]"
      >
        <section className="Recent_Jobs relative gap-8 min-w-[525px]">
          <div className="job_container min-w-[525px]">
            {recentjobs.length > 0 ? (
              <>
                {recentjobs.map((job, index) => (
                  <Link
                    title={`${
                      job.status.charAt(0).toUpperCase() + job.status.slice(1)
                    }`}
                    to={`/ViewJob/${job.job_data.id}`}
                    key={index}
                    className={`bg-white rounded-lg shadow-md p-4 mb-4 text-center hover:scale-105 transition-all border-2 ${
                      job.status === "accepted"
                        ? "border-green-500 border-4"
                        : job.status === "pending"
                        ? "border-blue-500"
                        : "border-red-500"
                    }`}
                  >
                    <h2 className="text-xl font-bold mb-2">
                      {job.job_data.title}
                    </h2>
                    <p className="text-gray-600 mb-2">
                      Salary: ${job.job_data.salary}/{job.job_data.salary_unit}
                    </p>
                    <p className="text-gray-600 mb-2">
                      Employment Type:{" "}
                      {job.job_data.employment_type === "part"
                        ? "Part time"
                        : "Full Time"}
                    </p>
                    <p className="text-gray-600 mb-2">
                      Experience: {job.job_data.experience}
                    </p>
                    <p className="text-gray-600 mb-2">
                      Company: {job.company_name}
                    </p>
                  </Link>
                ))}
              </>
            ) : (
              <>
                <div>
                  No Jobs yet, start by{" "}
                  <p
                    className="inline-block cursor-pointer underline text-violet-500 font-semibold"
                    onClick={() => {
                      refss.current.focus();
                    }}
                  >
                    applying to a job
                  </p>
                </div>
              </>
            )}
          </div>
        </section>
      </motion.div>
    </>
  );
}
