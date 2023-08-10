import React, { useEffect, useState } from "react";
import AuthUser from "../../components/AuthUser";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Checkbox,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { getjobs, postjob } from "../../config/supabase";
import ReactQuill from "react-quill";
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
function getCurrentDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so add 1 and pad with leading zero if needed
  const day = String(currentDate.getDate()).padStart(2, "0"); // Pad with leading zero if needed

  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}

const educations = [
  "none",
  "Basic reading & writing",
  "High School",
  "Bachelor",
  "Master",
  "Phd",
];

export default function AddJob() {
  const { user } = AuthUser();
  const [jobs, setjobs] = useState([]);
  const [loading, setloading] = useState(true);
  const [jobDetails, setJobDetails] = useState({
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
    applicants: [],
  });
  const handleChange = (event) => {
    const { name, value, type } = event.target;
    // console.log(event);
    if (Array.isArray(event.target.value)) {
      const {
        target: { value },
      } = event;
      setJobDetails((prevDetails) => ({
        ...prevDetails,
        category: typeof value === "string" ? value.split(",") : value,
      }));
    } else {
      setJobDetails((prevDetails) => ({
        ...prevDetails,
        [name]: type === "checkbox" ? event.target.checked : value,
      }));
    }
  };

  useEffect(() => {
    setJobDetails((prev) => ({
      ...prev,
      company_id: user?.id,
      company_name: user?.user_metadata?.name,
      status: "active",
      company_pfp: user?.user_metadata?.pfp,
    }));
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // console.log(jobDetails);
    if (jobDetails.description.trim() === "") {
      alert("Please Fill out the description");
      return;
    }
    setloading(true);
    const res = await postjob(jobDetails);
    if (res?.message) {
      handleerror(res);
      setloading(false);
    } else {
      navigate("/Homer", { replace: true });
    }
  };

  const navigate = useNavigate();

  const handleerror = (err) => {
    console.error(err.message);
  };

  useEffect(() => {
    const fetchjobs = async () => {
      setloading(true);
      setjobs([]);
      const res = await getjobs(user.id);
      if (res.message) {
        handleerror(res);
        return;
      }
      setjobs(res);
      setloading(false);
    };
    if (user !== null && user.user_metadata.type === "employee") {
      return () => window.history.back();
    } else if (user !== null && user.user_metadata.type === "employer")
      fetchjobs();
    return () => {};
  }, [navigate, user]);

  if (loading === true) {
    return (
      <div className="w-screen h-screen items-center justify-center flex">
        <CircularProgress />
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="AddJobContainer">
        <form onSubmit={handleSubmit} className="FormContainer">
          <h2 className="text-2xl font-bold mb-6  ml-4">Add a New Job</h2>
          <div className="mb-4 flex flex-row gap-4 items-center">
            {/* title */}
            <label
              htmlFor="title"
              className="block font-medium mb-2 whitespace-nowrap mx-auto ml-4"
            >
              Job Title:
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="w-full h-14 rounded border focus:outline-none focus:ring focus:border-blue-300 transition-all"
              value={jobDetails.title}
              onChange={handleChange}
              required
            />
            {/* categories */}
            <FormControl sx={{ m: 1, width: "100%" }} required>
              <InputLabel id="demo-multiple-chip-label">Categories</InputLabel>
              <Select
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                multiple
                value={jobDetails.category}
                onChange={handleChange}
                input={
                  <OutlinedInput id="select-multiple-chip" label="Categories" />
                }
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
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
          </div>
          <section className="flex w-full items-center justify-center">
            {/* description */}
            <ReactQuill
              type="text"
              id="description"
              name="description"
              theme="snow"
              className="w-[90%] focus:border-blue-300 transition-all h-44"
              value={jobDetails.description}
              onChange={(text) => {
                setJobDetails((prevDetails) => ({
                  ...prevDetails,
                  description: text,
                }));
              }}
            />
          </section>
          <div className="mb-4 mt-14 flex flex-wrap">
            {/* education */}
            <FormControl
              sx={{ m: 1, minWidth: 120 }}
              size="small"
              required
              className="w-[30%]"
            >
              <InputLabel id="demo-select-small-label">Education</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                name="education"
                value={jobDetails.education}
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
            {/* full/part time */}
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
                value={jobDetails.employment_type}
                label="Type"
                onChange={handleChange}
              >
                <MenuItem value={"Part Time"}>Part-time</MenuItem>
                <MenuItem value={"Full Time"}>Full-time</MenuItem>
              </Select>
            </FormControl>
            {/* experience */}
            <FormControl
              sx={{ m: 1, minWidth: 120 }}
              size="small"
              required
              className="w-[30%]"
            >
              <InputLabel id="demo-select-small-label">Experience</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                name="experience"
                value={jobDetails.experience}
                label="Experience"
                onChange={handleChange}
              >
                <MenuItem value={"none"}>none</MenuItem>
                <MenuItem value={"beginner"}>Beginner</MenuItem>
                <MenuItem value={"intermediate"}>Intermediate</MenuItem>
                <MenuItem value={"expert"}>Expert</MenuItem>
              </Select>
            </FormControl>
            {/* salary */}
            <label
              htmlFor="salary"
              className="block font-medium mb-2 whitespace-nowrap m-4 ml-4"
            >
              Salary: in $
            </label>
            <input
              type="number"
              id="salary"
              name="salary"
              className=" w-[30%] h-14 rounded border focus:outline-none focus:ring focus:border-blue-300 transition-all"
              value={jobDetails.salary}
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
                value={jobDetails.salary_unit}
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

            <footer className="flex flex-row items-center w-full justify-center">
              <label htmlFor="deadline" className="block font-medium mb-2 ">
                Applications Deadline:
              </label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={jobDetails.deadline}
                onChange={handleChange}
                required
                min={getCurrentDate()}
              />
              <label htmlFor="visibility" className="block font-medium mb-2 ">
                Make the job visible:
              </label>
              <Checkbox
                checked={jobDetails.visibility}
                onChange={handleChange}
                id="visibility"
                name="visibility"
              />
            </footer>
          </div>
          <div className="flex justify-center items-center">
            <button type="submit" id="Submit_button">
              Submit Job
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
