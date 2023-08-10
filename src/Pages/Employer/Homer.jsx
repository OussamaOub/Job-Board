import React, { useEffect, useState } from "react";
import AuthUser from "../../components/AuthUser";
import { CircularProgress } from "@mui/material";
import Header from "../../components/Header";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getjobs } from "../../config/supabase";
import { motion } from "framer-motion";

export default function Homer() {
  const { user } = AuthUser();
  const [loading, setloading] = useState(true);
  const [recentjobs, setrecentjobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchrecentjobs = async () => {
      setloading(true);
      setrecentjobs([]);
      const temp = await getjobs(user?.id);
      setrecentjobs(temp);
      setloading(false);
    };
    if (user && user.user_metadata.type === "employer") fetchrecentjobs();
    else if (user && user.user_metadata.type === "employee") navigate("/Homee");
    return () => {};
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
      <header className="Welcome_msg">
        <motion.p
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Welcome back {user.user_metadata.name}
        </motion.p>
      </header>
      <motion.h1
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="m-4 text-3xl font-bold font-mono"
      >
        Your Recent Job posts:
      </motion.h1>
      {/* Recent Jobs */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="Recent_jobs_Container"
      >
        <section className="Recent_Jobs relative gap-8">
          <div className="job_container">
            {recentjobs &&
              recentjobs.length > 0 &&
              recentjobs.map((job, index) => (
                <Link
                  to={`/ViewJob/${job.id}`}
                  key={index}
                  className={`bg-white rounded-lg shadow-md p-4 mb-4 text-center hover:scale-105 transition-all border ${
                    job.status === "active"
                      ? "border-green-500"
                      : job.status === "pending"
                      ? "border-blue-500"
                      : "border-red-500"
                  }`}
                >
                  <h2 className="text-xl font-bold mb-2">{job.title}</h2>
                  <p className="text-gray-600 mb-2">
                    Salary: ${job.salary}/{job.salary_unit}
                  </p>
                  <p className="text-gray-600 mb-2">
                    Employment Type:{" "}
                    {job.employment_type === "part" ? "Part time" : "Full Time"}
                  </p>
                  <p className="text-gray-600 mb-2">
                    Experience: {job.experience}
                  </p>
                  <p className="text-gray-600 mb-2">
                    Applicants: {job.n_applicants}
                  </p>
                </Link>
              ))}
            {recentjobs.length === 0 && (
              <div>You currently have no jobs :{"("}</div>
            )}
          </div>
          <img
            title="Add Job"
            src="https://www.svgrepo.com/show/524226/add-circle.svg"
            className="absolute w-8 right-4 bottom-4 hover:w-12 transition-all cursor-pointer"
            onClick={() => navigate("/AddJob")}
          />
        </section>
      </motion.div>
    </>
  );
}
