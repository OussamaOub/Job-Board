import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AuthUser from "../components/AuthUser";
import Header from "../components/Header";
import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { getuserpage, updatedata, updatepage } from "../config/supabase"; // Import the necessary functions
import ReactQuill from "react-quill";
import { motion } from "framer-motion";
import { uploadimage } from "../config/firebase";

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

export default function ViewPerson() {
  const { user } = AuthUser();
  const [loading, setLoading] = useState(true);
  const [userinfo, setUserInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    name: "",
    pfp: "",
    age: "",
    bio: "",
    education: "",
    skills: [{}],
  });
  const [newimg, setnewimg] = useState(null);
  const [flag, setflag] = useState(true);
  const { id } = useParams();

  const handlesave = async () => {
    if (
      editedData.name.trim() === "" ||
      editedData.pfp.trim() === "" ||
      editedData.age.trim() === "" ||
      editedData.bio.trim() === "" ||
      editedData.education.trim() === "" ||
      editedData.skills.length === 0
    ) {
      alert("No field can be empty");
      return;
    }
    setLoading(true);
    const res = await updatepage(editedData);
    if (res) handleError(res);
    else setflag(!flag);
    setIsEditing(false);
    setLoading(false);
  };

  useEffect(() => {}, [editedData.pfp]);

  const handleError = (err) => {
    console.error(err);
  };

  useEffect(() => {
    const fetchUserPage = async () => {
      setLoading(true);
      setUserInfo(null);
      const res = await getuserpage(user, id);
      if (res === "No page yet") {
        alert("User did not set up a personal page yet!");
        window.history.back();
        return;
      } else if (res === "Not Visible") {
        alert("User Page not visible yet!");
        window.history.back();
        return;
      } else if (res === 1) {
        setflag(!flag);
      } else if (res.code) {
        handleError(res);
        setLoading(false);
        return;
      } else if (
        typeof res === "object" &&
        !Array.isArray(res) &&
        res !== null
      ) {
        setUserInfo(res);
        setEditedData(res);
        setLoading(false);
      }
    };

    if (user) {
      fetchUserPage();
    }

    return () => {
      // Cleanup if needed
    };
  }, [user, id, flag]);

  const handleSkillChange = (index, field, value) => {
    setEditedData((prev) => {
      const updatedSkills = [...prev.skills]; // Create a copy of the skills array

      // Check if the skill object at the specified index exists, create it if not
      if (!updatedSkills[index]) {
        updatedSkills[index] = {};
      }

      updatedSkills[index][field] = value; // Update the specific skill's field

      return {
        ...prev,
        skills: updatedSkills, // Update the skills array in the state
      };
    });

    // console.log(editedData.skills);
  };

  const handleChange = (event) => {
    const { name, value, type } = event.target;
    if (Array.isArray(event.target.value)) {
      const {
        target: { value },
      } = event;
      setEditedData((prevDetails) => ({
        ...prevDetails,
        category: typeof value === "string" ? value.split(",") : value,
      }));
    } else {
      setEditedData((prevDetails) => ({
        ...prevDetails,
        [name]: type === "checkbox" ? event.target.checked : value,
      }));
    }
  };

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
      <motion.div className="flex flex-col m-8 relative">
        {user.id === id && (
          <motion.div
            title="Modify"
            className="self-center text-white text-xl p-4 bg-blue-500 transition-all hover:bg-blue-300 font-semibold font-mono cursor-pointer rounded-xl mt-6"
            onClick={() => {
              setIsEditing(!isEditing);
            }}
          >
            Modify
          </motion.div>
        )}
        {isEditing && (
          <span>
            Set Visibility of the page:{" "}
            <label htmlFor="checkbox" className="relative">
              <input
                type="checkbox"
                id="visibility"
                name="visibility"
                className="appearance-none h-5 w-5 opacity-0 absolute top-0 left-0 cursor-pointer"
                checked={editedData.visibility}
                onChange={handleChange}
              />
              <span
                className={`h-5 w-5 inline-flex items-center justify-center text-white font-semibold text-sm border rounded-full transition-all duration-100 p-3 ${
                  editedData.visibility ? "bg-green-600" : "bg-red-600"
                }`}
              >
                {editedData.visibility ? "✔" : "✖"}
              </span>
            </label>
          </span>
        )}

        <motion.img
          title={userinfo.name}
          src={userinfo.pfp}
          className="w-80 resize object-contain self-center mt-10 rounded-xl"
        />
        {isEditing && (
          <>
            {" "}
            <label
              htmlFor="ProfessionalPicture"
              className="block text-sm font-medium mb-2"
            >
              Professional Picture:
            </label>
            <input
              type="file"
              accept=".png, .jpg, .jpeg"
              id="profilePicture"
              className="w-full px-3 py-2 rounded border focus:outline-none focus:ring focus:border-blue-300"
              onChange={async (e) => {
                setnewimg(e.target.files);
                const value = await uploadimage(e.target.files[0], user.id);
                setEditedData((prev) => ({ ...prev, pfp: value }));
              }}
            />
          </>
        )}
        {isEditing ? (
          <motion.input
            placeholder="name"
            title="name"
            name="name"
            onChange={handleChange}
            value={editedData.name ?? userinfo.name}
            className="self-center w-fit border-2 rounded-lg focus:border-blue-500 p-2 mt-4 text-center transition-all"
          />
        ) : (
          <motion.div className="self-center w-fit rounded-lg p-2 mt-4 flex flex-row gap-4 items-center justify-center">
            <p> Name: </p>
            <p className="font-bold font-mono text-xl">{userinfo.name}</p>
          </motion.div>
        )}
        {isEditing ? (
          <motion.input
            placeholder="age"
            title="age"
            name="age"
            type="number"
            onChange={handleChange}
            value={editedData.age ?? userinfo.age}
            className="self-center w-fit border-2 rounded-lg focus:border-blue-500 p-2 mt-4 text-center transition-all"
          />
        ) : (
          <motion.div className="self-center w-fit rounded-lg p-2 mt-4 flex flex-row gap-4 items-center justify-center">
            <p> Age: </p>
            <p className="font-bold font-mono text-xl">{userinfo.age}</p>
          </motion.div>
        )}
        <motion.div className="flex flex-col gap-4">
          <motion.p className="self-center w-fit rounded-lg p-2 mt-4 flex flex-row gap-4 items-center justify-center">
            BIO:
          </motion.p>
          <ReactQuill
            key={isEditing ? "edit" : "view"}
            value={isEditing ? editedData.bio : userinfo.bio}
            readOnly={!isEditing}
            className="h-fit w-[90%] self-center border"
            onChange={(text) => {
              setEditedData((prevDetails) => ({
                ...prevDetails,
                bio: text,
              }));
            }}
            theme={isEditing ? "snow" : "bubble"}
          />
        </motion.div>
        {isEditing ? (
          <div className=" mt-4 w-full flex justify-center">
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
                value={editedData.education}
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
          </div>
        ) : (
          <motion.div className="self-center w-fit rounded-lg p-2 mt-4 flex flex-row gap-4 items-center justify-center">
            <p> Education: </p>
            <p className="font-bold font-mono text-xl">{userinfo.education}</p>
          </motion.div>
        )}
        {/* Work on skills */}
        <div className="self-center flex flex-col my-6 gap-5">
          <div className="flex flex-row items-center justify-between mx-2">
            <p>Skills</p>
            <p>Level</p>
          </div>
          {editedData.skills.map((ski, index) => {
            const handleDelete = () => {
              setEditedData((prev) => {
                const updatedSkills = [...prev.skills];
                updatedSkills.splice(index, 1);
                console.log(updatedSkills);
                return {
                  ...prev,
                  skills: updatedSkills,
                };
              });
            };
            return isEditing ? (
              <div key={index} className="flex flex-row gap-4 p-2">
                <FormControl
                  sx={{ m: 1, minWidth: 120 }}
                  size="small"
                  required
                  className="w-[30%]"
                >
                  <InputLabel id={`skill-label-${index}`}>Skill</InputLabel>
                  <Select
                    labelId={`skill-label-${index}`}
                    id={`skill-select-${index}`}
                    name={`skill`}
                    value={ski.skill ?? ""}
                    label="Skill"
                    onChange={(event) =>
                      handleSkillChange(index, "skill", event.target.value)
                    }
                  >
                    {categories.map((category, categoryIndex) => (
                      <MenuItem key={categoryIndex} value={category}>
                        {category}
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
                  <InputLabel id={`level-label-${index}`}>Level</InputLabel>
                  <Select
                    name={`level`}
                    title={`level`}
                    value={ski.level ?? ""}
                    label="level"
                    onChange={(event) =>
                      handleSkillChange(index, "level", event.target.value)
                    }
                  >
                    <MenuItem value="No Experience">No Experience</MenuItem>
                    <MenuItem value="Beginner">Beginner</MenuItem>
                    <MenuItem value="Intermediate">Intermediate</MenuItem>
                    <MenuItem value="Expert">Expert</MenuItem>
                  </Select>
                </FormControl>
                {editedData.skills.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete();
                    }}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    -
                  </button>
                )}
              </div>
            ) : (
              <div
                key={`level-${index}`}
                className="flex flex-row justify-between gap-8 items-center"
              >
                <p className="text-lg font-mono font-bold">{ski.skill}</p>
                <p className="text-lg font-sans font-semibold">{ski.level}</p>
              </div>
            );
          })}
          {isEditing && (
            <button
              onClick={(e) => {
                e.preventDefault();
                setEditedData((prev) => ({
                  ...prev,
                  skills: [...prev.skills, {}],
                }));
              }}
              className="bg-blue-500 text-white px-2 py-1 rounded"
            >
              Add Skill
            </button>
          )}
        </div>
        {isEditing && (
          <img
            title="Save changes"
            onClick={handlesave}
            src="https://www.svgrepo.com/show/458873/save.svg"
            className="fixed right-2 bottom-0 w-10 cursor-pointer hover:scale-105 transition-all"
          />
        )}

        {/* {isEditing ? (
          <motion.div className="flex flex-row self-center items-center ">
            <FormControl
              sx={{ m: 1, minWidth: 120 }}
              size="small"
              required
              className="w-[30%]"
            >
              <InputLabel id="demo-select-small-label">Skill</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                name="skills"
                value={editedData.skills ?? userinfo.skills}
                label="Skills"
                onChange={handleChange}
              >
                {categories.map((edu, index) => (
                  <MenuItem key={index} value={edu}>
                    {edu}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <motion.input
              placeholder="level"
              title="level"
              name="level"
              onChange={handleChange}
              value={editedData.skills ?? userinfo.education}
              className="self-center w-fit border-2 rounded-lg focus:border-blue-500 p-2 mt-4 text-center transition-all"
            />
          </motion.div>
        ) : (
          <motion.div className="self-center w-fit rounded-lg p-2 mt-4 flex flex-row gap-4 items-center justify-center">
            <p> Education: </p>
            <p className="font-bold font-mono text-xl">{userinfo.education}</p>
          </motion.div>
        )} */}
      </motion.div>
    </>
  );
}
