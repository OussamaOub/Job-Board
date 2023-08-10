import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AuthUser from "../components/AuthUser";
import Header from "../components/Header";
import {
  Box,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import {
  applytojob,
  deletejob,
  editjob,
  getjobbyid,
  getorcreatechannel,
  respondtoapplication,
} from "../config/supabase";
import Swal from "sweetalert2";
import ReactQuill from "react-quill";
import { motion } from "framer-motion";
import "react-quill/dist/quill.bubble.css";
import "react-quill/dist/quill.snow.css";

const categories = [
  "Accounting",
  "Agriculture",
  "Architecture",
  "Art",
  "Astronomy",
  "Automotive",
  "Biology",
  "Business",
  "Chemistry",
  "Climate",
  "Communication",
  "Computers",
  "Construction",
  "Cooking",
  "Cryptocurrency",
  "Culture",
  "Design",
  "Economics",
  "Education",
  "Energy",
  "Engineering",
  "Environment",
  "Fashion",
  "Film",
  "Finance",
  "Fitness",
  "Food",
  "Gardening",
  "Health",
  "History",
  "Hospitality",
  "Human Resources",
  "Information Technology",
  "Insurance",
  "Internet",
  "Investing",
  "Journalism",
  "Languages",
  "Law",
  "Linguistics",
  "Management",
  "Marketing",
  "Mathematics",
  "Media",
  "Medicine",
  "Music",
  "Nature",
  "Nursing",
  "Nutrition",
  "Philosophy",
  "Photography",
  "Physics",
  "Politics",
  "Psychology",
  "Real Estate",
  "Religion",
  "Science",
  "Social Media",
  "Sociology",
  "Space",
  "Sports",
  "Technology",
  "Transportation",
  "Travel",
  "Veterinary",
  "Weather",
  "Writing",
  "Astrology",
  "Camping",
  "Dance",
  "Embroidery",
  "Fitness",
  "Genealogy",
  "Horror",
  "Interior Design",
  "Jewelry Making",
  "Knitting",
  "Landscape Design",
  "Meditation",
  "Numerology",
  "Origami",
  "Paranormal",
  "Quilting",
  "Robotics",
  "Sculpture",
  "Tattoo Art",
  "Ufology",
  "Videography",
  "Wine Tasting",
  "Yoga",
  "Zoology",
];
const educations = [
  "none",
  "Basic reading & writing",
  "High School",
  "Bachelor",
  "Master",
  "Phd",
];

function formatDate(timestamp) {
  const date = new Date(timestamp);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

const formatDateSmol = (timestamp) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function isAvailable(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  if (date.getTime() > now.getTime()) return true;
  return false;
}

export default function ViewJob() {
  const { user } = AuthUser();
  const [loading, setLoading] = useState(true);
  const [jobinfo, setJobinfo] = useState({});
  const [isediting, setisediting] = useState(false);
  const [flag, setflag] = useState(true);
  const [isApplied, setisApplied] = useState(false);
  const [editedjob, seteditedjob] = useState({
    title: "",
    company_id: "",
    company_name: "",
    description: "",
    category: [],
    employment_type: "",
    experience: "",
    education: "",
    salary: "",
    salary_unit: "",
    visibility: true,
    deadline: "",
    status: "",
    n_applicants: 0,
  });

  const navigate = useNavigate();
  const JobId = useParams().id;

  const handleacceptrejectapp = async (resp, app_id) => {
    setLoading(true);
    const res = await respondtoapplication(resp, jobinfo.id, app_id);
    if (res) {
      handleerror(res);
      return;
    }
    setflag(!flag);
    setLoading(false);
    return;
  };

  const handlesendmessage = async () => {
    setLoading(true);
    const res = await getorcreatechannel(user, jobinfo);
    if (res) {
      handleerror(res);
      return;
    }
    navigate("/Messages");
    return;
  };

  const handleApply = async () => {
    setLoading(true);
    const newjob = {
      applicant_id: user.id,
      job_data: jobinfo,
      company_id: jobinfo.company_id,
      company_name: jobinfo.company_name,
      applicant_name: user.user_metadata.name,
      job_id: jobinfo.id,
      status: "pending",
      applicant_pfp: user.user_metadata.pfp,
    };
    const res = await applytojob(newjob);
    if (res) {
      handleerror(res);
      setLoading(false);
    }
    setflag(!flag);
    setLoading(false);
  };

  const handleerror = (err) => {
    //This code is for no row found
    if (err.code === "PGRST116") {
      Swal.fire("No job", "No such job found", "error").then(() => {
        navigate(-1, { replace: true });
        return;
      });
    } else {
      console.warn(err);
    }
  };

  const handledeletejob = async () => {
    if (confirm(`Are you sure you want to delete ${jobinfo.title}?`)) {
      setLoading(true);
      const res = await deletejob(jobinfo.id);
      if (res) {
        handleerror(res);
      } else {
        Swal.fire("Status", "Succesfully delete the job", "success");
      }
      setLoading(false);
      navigate(-1, { replace: true });
    }
  };

  const handleChange = (event) => {
    const { name, value, type } = event.target;
    // console.log(event);
    if (Array.isArray(event.target.value)) {
      const {
        target: { value },
      } = event;
      seteditedjob((prevDetails) => ({
        ...prevDetails,
        category: typeof value === "string" ? value.split(",") : value,
      }));
    } else {
      seteditedjob((prevDetails) => ({
        ...prevDetails,
        [name]: type === "checkbox" ? event.target.checked : value,
      }));
    }
  };

  const handleSubmitEditJob = async () => {
    setLoading(true);
    setisediting(!isediting);
    const res = await editjob(editedjob);
    if (res) {
      handleerror(res);
      setLoading(false);
    }
    setflag(!flag);
    setLoading(false);
  };

  useEffect(() => {
    const checkifapplied = () => {
      setLoading(true);
      const isUserApplied = jobinfo.applicants.some(
        (applicant) => applicant.id === user.id
      );
      setisApplied(isUserApplied);
      setLoading(false);
    };
    if (loading === false) checkifapplied();
  }, [jobinfo]);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      setJobinfo({});
      const res = await getjobbyid(JobId);
      if (res.code) {
        handleerror(res);
        setLoading(false);
      } else {
        if (res.length === 0) {
          setLoading(false);
          return () => {};
        }
        setJobinfo(res);
        seteditedjob(res);
        setLoading(false);
      }
    };
    fetchJob();
    return () => {};
  }, [JobId, flag]);

  if (!user || loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <>
      <Header />
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="JobInfoContainer relative "
      >
        <section className="JobInfoCard">
          <header>
            <h1 className="text-2xl p-4 font-bold font-mono">
              {jobinfo.title}
            </h1>
            <section className="flex flex-row justify-around flex-wrap">
              <div className="flex flex-col gap-8 text-center">
                <h1 className="text-gray-400 font-bold">By</h1>
                <h2 className="text-black font-mono font-semibold text-lg">
                  {jobinfo.company_name}
                </h2>
              </div>
              <div className="flex flex-col gap-8 text-center">
                <h1 className="text-gray-400 font-bold">Date posted</h1>
                <h2 className="text-black font-mono font-semibold text-lg">
                  {formatDate(jobinfo.created_at)}
                </h2>
              </div>
              <div className="flex flex-col gap-8 text-center">
                <h1 className="text-gray-400 font-bold">Pay</h1>
                {/* pay */}
                {isediting ? (
                  <div className="flex flex-row gap-1">
                    <input
                      type="number"
                      id="salary"
                      name="salary"
                      className=" w-[30%] h-14 rounded border focus:outline-none focus:ring focus:border-blue-300 transition-all"
                      value={editedjob.salary ?? jobinfo.salary}
                      onChange={handleChange}
                      min={0}
                      required
                    />
                    <FormControl
                      sx={{ m: 1, minWidth: 120 }}
                      size="small"
                      required
                      className="w-[30%]"
                    >
                      <InputLabel id="demo-select-small-label">Rate</InputLabel>
                      <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        name="salary_unit"
                        value={editedjob.salary_unit}
                        label="Rate"
                        onChange={handleChange}
                      >
                        <MenuItem value={"hourly"}>hourly</MenuItem>
                        <MenuItem value={"daily"}>daily</MenuItem>
                        <MenuItem value={"weekly"}>weekly</MenuItem>
                        <MenuItem value={"monthly"}>monthly</MenuItem>
                        <MenuItem value={"yearly"}>yearly</MenuItem>
                        <MenuItem value={"particular"}>particular</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                ) : (
                  <h2 className="text-black font-mono font-semibold text-lg">
                    ${jobinfo.salary}/{jobinfo.salary_unit}
                  </h2>
                )}
              </div>
              <div className="flex flex-col justify-around gap-4 text-center">
                {user.id === jobinfo.company_id ? (
                  <>
                    <span
                      className="bg-red-500 text-white px-4 py-1 transition-all rounded cursor-pointer hover:bg-red-600"
                      onClick={handledeletejob}
                    >
                      Delete
                    </span>
                    <span
                      className="bg-blue-500 text-white px-4 py-1 transition-all rounded cursor-pointer hover:bg-blue-600"
                      onClick={() => {
                        setisediting(!isediting);
                      }}
                    >
                      Modify
                    </span>
                  </>
                ) : (
                  <>
                    <span
                      className="bg-blue-500 text-white font-semibold font-mono px-4 py-1 rounded hover:bg-blue-600 cursor-pointer transition-all"
                      onClick={() => {
                        Swal.fire({
                          title: "Message",
                          text: `You are about to create a messaging channel with ${jobinfo.company_name}!`,
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonColor: "#3085d6",
                          cancelButtonColor: "#d33",
                          confirmButtonText: "Yes, create it!",
                        }).then((result) => {
                          if (result.isConfirmed) {
                            // User clicked on the "Yes, send it!" button
                            // Place the logic to send the message here

                            // For example, you can make an API call to send the message
                            // Assuming you have a function to send the message named 'sendMessage'
                            handlesendmessage();
                            Swal.fire(
                              "Created!",
                              "Your channel has been created successfully.",
                              "success"
                            );
                          } else {
                            // User clicked on the "Cancel" button or closed the dialog
                            Swal.fire(
                              "Cancelled",
                              "Your message was not sent.",
                              "error"
                            );
                          }
                        });
                      }}
                    >
                      Message
                    </span>
                    {isApplied ? (
                      <span className="bg-green-300 text-white font-semibold font-mono px-4 py-1 rounded  cursor-not-allowed transition-all disabled">
                        Applied
                      </span>
                    ) : (
                      <span
                        className="bg-green-500 text-white font-semibold font-mono px-4 py-1 rounded hover:bg-green-600 cursor-pointer transition-all disabled"
                        onClick={() => {
                          handleApply();
                        }}
                      >
                        Apply
                      </span>
                    )}
                  </>
                )}
              </div>
            </section>
            <hr className=" border-[1.5px] mt-4" />
          </header>

          <span className="flex flex-row items-center flex-wrap">
            <div className="w-2/3 flex flex-row justify-around">
              {/* Deadline */}
              <section className="flex flex-row font-bold gap-1 items-center">
                Deadline:
                {isediting ? (
                  <>
                    {" "}
                    <input
                      type="date"
                      id="deadline"
                      name="deadline"
                      value={formatDateSmol(editedjob.deadline) ?? ""}
                      onChange={handleChange}
                      required
                    />
                    {/* Other content */}
                  </>
                ) : (
                  <p
                    className={
                      isAvailable(jobinfo.deadline)
                        ? "text-green-600"
                        : "text-red-500"
                    }
                  >
                    {formatDateSmol(jobinfo.deadline)}
                  </p>
                )}
              </section>
              <section className="flex flex-row font-bold gap-1 items-center">
                Type:{" "}
                {isediting ? (
                  <>
                    <FormControl
                      sx={{ m: 1, minWidth: 120 }}
                      size="small"
                      required
                      className="w-[30%]"
                    >
                      <InputLabel id="demo-select-small-label">Type</InputLabel>
                      <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        name="employment_type"
                        value={
                          editedjob.employment_type ?? jobinfo.employment_type
                        }
                        label="Type"
                        onChange={handleChange}
                      >
                        <MenuItem value={"Part Time"}>Part-time</MenuItem>
                        <MenuItem value={"Full Time"}>Full-time</MenuItem>
                      </Select>
                    </FormControl>
                  </>
                ) : (
                  <p className="text-blue-500">{jobinfo.employment_type}</p>
                )}
              </section>
              <section className="flex flex-row font-bold gap-1 items-center">
                Status:
                {/* status */}
                {isediting ? (
                  <>
                    <FormControl
                      sx={{ m: 1, minWidth: 120 }}
                      size="small"
                      required
                      className="w-[30%]"
                    >
                      <InputLabel id="demo-select-small-label">
                        Status
                      </InputLabel>
                      <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        name="status"
                        value={editedjob.status ?? jobinfo.status}
                        label="Status"
                        onChange={handleChange}
                      >
                        <MenuItem value={"active"}>active</MenuItem>
                        <MenuItem value={"pending"}>pending</MenuItem>
                        <MenuItem value={"closed"}>closed</MenuItem>
                      </Select>
                    </FormControl>
                  </>
                ) : (
                  <p
                    className={
                      jobinfo.status === "active"
                        ? "text-green-500"
                        : jobinfo.status === "pending"
                        ? "text-blue-500"
                        : "text-red-500"
                    }
                  >
                    {jobinfo.status}
                  </p>
                )}
              </section>
            </div>
            <div className="w-1/3 border-l-2 pl-4 p-4 flex flex-row items-center justify-between">
              <h3 className="text-lg font-semibold">Details</h3>
              {isediting && (
                <span>
                  Set Visibility:{" "}
                  <label htmlFor="checkbox" className="relative">
                    <input
                      type="checkbox"
                      id="visibility"
                      name="visibility"
                      className="appearance-none h-5 w-5 opacity-0 absolute top-0 left-0 cursor-pointer"
                      checked={editedjob.visibility ?? jobinfo.visibility}
                      onChange={handleChange}
                    />
                    <span
                      className={`h-5 w-5 inline-flex items-center justify-center text-white font-semibold text-sm border rounded-full transition-all duration-100 p-3 ${
                        editedjob.visibility ? "bg-green-600" : "bg-red-600"
                      }`}
                    >
                      {editedjob.visibility ? "✔" : "✖"}
                    </span>
                  </label>
                </span>
              )}
            </div>
          </span>
          <hr className="border-[1.5px]" />
          <main className="flex flex-row">
            <header className="w-2/3  pt-4 pl-4">
              <h2 className="text-lg font-semibold font-sans">
                Job Description:
              </h2>
              <ReactQuill
                key={isediting ? "edit" : "view"}
                value={isediting ? editedjob.description : jobinfo.description}
                readOnly={!isediting}
                className="h-fit"
                onChange={(text) => {
                  seteditedjob((prevDetails) => ({
                    ...prevDetails,
                    description: text,
                  }));
                }}
                theme={isediting ? "snow" : "bubble"}
              />
            </header>
            <footer className="w-1/3 border-l-2 pt-4 pl-4">
              <div>
                <p className="font-semibold text-lg">Categories: </p>
                {isediting ? (
                  <FormControl sx={{ m: 1, width: "90%" }} required>
                    <InputLabel id="demo-multiple-chip-label">
                      Categories
                    </InputLabel>
                    <Select
                      labelId="demo-multiple-chip-label"
                      id="demo-multiple-chip"
                      multiple
                      value={editedjob.category ?? jobinfo.category}
                      onChange={handleChange}
                      input={
                        <OutlinedInput
                          id="select-multiple-chip"
                          label="Categories"
                        />
                      }
                      renderValue={(selected) => (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {selected.map((value, index) => (
                            <Chip key={index} label={value} />
                          ))}
                        </Box>
                      )}
                    >
                      {categories.map((name, index) => (
                        <MenuItem key={index} value={name}>
                          {name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <span className="categories-container">
                    {jobinfo.category.map((item, index) => (
                      <p
                        key={index}
                        className="text-black bg-blue-300 w-fit rounded-full px-2 py-1 font-serif cursor-default hover:scale-105 transition-all"
                      >
                        {item}
                      </p>
                    ))}
                  </span>
                )}
                <p className="font-semibold text-lg">Skills: </p>
                {isediting ? (
                  <>
                    <FormControl
                      sx={{ m: 1, minWidth: 120 }}
                      size="small"
                      required
                      className="w-[30%]"
                    >
                      <InputLabel id="demo-select-small-label">
                        Education
                      </InputLabel>
                      <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        name="education"
                        value={editedjob.education}
                        label="Education"
                        onChange={handleChange}
                      >
                        {educations.map((edu, index) => (
                          <MenuItem key={index} value={edu}>
                            {edu}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl
                      sx={{ m: 1, minWidth: 120 }}
                      size="small"
                      required
                      className="w-[30%]"
                    >
                      <InputLabel id="demo-select-small-label">
                        Experience
                      </InputLabel>
                      <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        name="experience"
                        value={editedjob.experience}
                        label="Experience"
                        onChange={handleChange}
                      >
                        <MenuItem value={"none"}>none</MenuItem>
                        <MenuItem value={"beginner"}>Beginner</MenuItem>
                        <MenuItem value={"intermediate"}>Intermediate</MenuItem>
                        <MenuItem value={"expert"}>Expert</MenuItem>
                      </Select>
                    </FormControl>
                  </>
                ) : (
                  <span className="flex flex-col gap-4 mb-1">
                    <p className="mt-4" title="Education">
                      Education:{" "}
                      {jobinfo.education === "none"
                        ? jobinfo.education
                        : `${jobinfo.education} level`}
                    </p>
                    <p title="Experience">
                      Experience:{" "}
                      {jobinfo.experience.charAt(0).toUpperCase() +
                        jobinfo.experience.slice(1)}
                    </p>
                  </span>
                )}
              </div>
              <div className="py-4">
                Current number of applicants: {jobinfo.n_applicants}
              </div>
              {jobinfo.n_applicants > 0 &&
                jobinfo.company_id === user.id &&
                jobinfo.applicants.map((applicant, index) => (
                  <div
                    key={index}
                    className="w-full flex flex-row justify-between items-center p-4"
                  >
                    <Link to={`/ViewPerson/${applicant.id}`}>
                      {applicant.name}
                    </Link>
                    {applicant.status === "pending" ? (
                      <div className="flex flex-row gap-4 p-4">
                        <img
                          title="Accept"
                          src="https://www.svgrepo.com/show/384403/accept-check-good-mark-ok-tick.svg"
                          className="w-7 hover:scale-105 transition-all cursor-pointer"
                          onClick={() => {
                            handleacceptrejectapp("accepted", applicant.id);
                          }}
                        />
                        <img
                          title="Reject"
                          src="https://www.svgrepo.com/show/384369/alert-danger-error-warning.svg"
                          className="w-7 hover:scale-105 transition-all cursor-pointer"
                          onClick={() => {
                            handleacceptrejectapp("rejected", applicant.id);
                          }}
                        />
                      </div>
                    ) : applicant.status === "accepted" ? (
                      <p className="text-green-500">Accepted</p>
                    ) : (
                      <p className="text-red-500">Rejected</p>
                    )}
                  </div>
                ))}
            </footer>
          </main>
        </section>
        {isediting && (
          <img
            title="Save changes"
            onClick={handleSubmitEditJob}
            src="https://www.svgrepo.com/show/458873/save.svg"
            className="absolute right-2 bottom-0 w-10 cursor-pointer hover:scale-105 transition-all"
          />
        )}
      </motion.div>
    </>
  );
}
