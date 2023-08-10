import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React, { useState } from "react";
import { searchforjobs } from "../config/supabase";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function extractFirstLineWithoutTags(description) {
  // Remove HTML tags from the description using regex
  const cleanedDescription = description.replace(/(<([^>]+)>)/gi, "");

  // Extract the first line without tags
  const firstLine = cleanedDescription.split("\n")[0].trim();

  return firstLine;
}

export default function Search({ tosearch, settosearch, refss }) {
  const [results, setresults] = useState([]);
  const [param, setparam] = useState("title");
  const [isfetched, setisfetchded] = useState(false);

  const searchfor = async () => {
    if (param.trim() === "" || tosearch.trim() === "") {
      return;
    }
    setisfetchded(false);
    const res = await searchforjobs(tosearch, param);
    if (res.code) console.warn(res);
    setresults(res);
    setisfetchded(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.3 }}
        className="job-search-container"
      >
        <section className="flex flex-col w-1/2 h-auto  min-w-[525px] p-2">
          <motion.input
            ref={refss}
            name="search"
            title="search"
            placeholder="Search for jobs"
            value={tosearch}
            onChange={(e) => settosearch(e.target.value)}
            className="border-2 rounded-lg w-full text-center py-2 min-w-[525px]"
            onKeyDown={(k) => {
              if (k.key === "Enter") {
                searchfor();
              }
            }}
            whileFocus={{ scale: 1.01, borderColor: "#2563eb" }}
          />
          <div className="w-full py-1 gap-1 flex flex-col border-x-2 p-4 border-b-2 min-w-[525px]">
            {isfetched && !results.code && results.length === 0
              ? "No Jobs Found"
              : results.map((job, index) => (
                  <motion.div
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.1 }}
                    key={index}
                    className="job-search-result overflow-ellipsis"
                  >
                    <Link to={`/ViewJob/${job.id}`}>
                      <p>Title: {job.title}</p>
                      <p>
                        Description:{" "}
                        {extractFirstLineWithoutTags(job.description)}
                      </p>
                      <p className="text-green-500">
                        Pay: ${job.salary}/{job.salary_unit}
                      </p>
                      <p>Company: {job.company_name}</p>
                      <div className="flex flex-row gap-1 text-violet-500">
                        Categories:{" "}
                        {job.category.map((cat, index) => (
                          <p key={index} title={cat}>
                            {cat}.
                          </p>
                        ))}
                      </div>
                    </Link>
                  </motion.div>
                ))}
          </div>
        </section>
        <Link to={"/AllJobs"}>
          {" "}
          <img
            className="w-10 hover:scale-110 transition-all cursor-pointer"
            title="Browse All Offers"
            src="https://www.svgrepo.com/show/450907/form-dropdown.svg"
          />
        </Link>
        <span className="flex flex-row items-center gap-4">
          <FormControl
            sx={{ m: 1, minWidth: 120 }}
            size="small"
            required
            className="w-[30%]"
          >
            <InputLabel id="demo-select-small-label">By</InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              name="Title"
              value={param}
              label="By"
              onChange={(e) => {
                setparam(e.target.value);
              }}
            >
              <MenuItem value={"title"}>Title</MenuItem>
              <MenuItem value={"description"}>Description</MenuItem>
              <MenuItem value={"employment_type"}>
                Type (full/part time)
              </MenuItem>
              <MenuItem value={"company_name"}>Company Name</MenuItem>
            </Select>
          </FormControl>
          <div className="cursor-pointer  transition-all flex flex-row gap-4">
            <img
              title="Search"
              src="https://www.svgrepo.com/show/532551/search-alt-1.svg"
              className="w-7 hover:scale-105 transition-all"
              onClick={() => {
                searchfor();
              }}
            />
            <img
              title="Remove Search"
              src="https://www.svgrepo.com/show/493964/delete-1.svg"
              className="w-7 hover:scale-105 transition-all"
              onClick={() => {
                setisfetchded(false);
                settosearch("");
                setresults([]);
              }}
            />
          </div>
        </span>
      </motion.div>
    </>
  );
}
