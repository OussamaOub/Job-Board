import React, { useState } from "react";
import Header from "../components/Header";
import AuthUser from "../components/AuthUser";
import { updatedata } from "../config/supabase";
import Swal from "sweetalert2";
import { uploadimage } from "../config/firebase";
import { CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";

export default function Profile() {
  const { user } = AuthUser();
  const [companyName, setCompanyName] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setloading] = useState(false);

  const handleCompanyProfileSave = async () => {
    if (
      (!user?.user_metadata?.pfp && !profilePicture) ||
      (!user?.user_metadata?.name && !companyName)
    ) {
      Swal.fire("Error", "All fields must be filled", "error");
      return;
    }
    try {
      setloading(true);
      const value = await uploadimage(profilePicture, user?.id);
      await updatedata({
        name:
          companyName.trim() === "" ? user?.user_metadata?.name : companyName,
        pfp: value,
      });
      setloading(false);
    } catch (error) {
      Swal.fire("Error", error.message, "error");
      setloading(false);
    }
  };

  if (loading)
    return (
      <div className="Main-Login">
        <CircularProgress />
      </div>
    );
  else if (user)
    return (
      <div className="max-w-screen-2xl">
        <Header />

        <div className="container mx-auto py-10">
          <div className="bg-white shadow-lg rounded-lg px-8 py-6 border">
            <h2 className="text-2xl font-bold mb-6">
              {user.user_metadata.type.charAt(0).toUpperCase() +
                user.user_metadata.type.slice(1)}{" "}
              Profile
            </h2>
            <div className="mb-4">
              <label
                htmlFor="companyName"
                className="block text-sm font-medium mb-2"
              >
                {user.user_metadata.type === "employee" ? "User" : "Company"}{" "}
                Name: {user?.user_metadata?.name}
              </label>
              <input
                type="text"
                id="companyName"
                className="w-full px-3 py-2 rounded border focus:outline-none focus:ring focus:border-blue-300"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="profilePicture"
                className="block text-sm font-medium mb-2"
              >
                Profile Picture:
              </label>
              <input
                type="file"
                accept=".png, .jpg, .jpeg"
                id="profilePicture"
                className="w-full px-3 py-2 rounded border focus:outline-none focus:ring focus:border-blue-300"
                onChange={(e) => {
                  setProfilePicture(e.target.files[0]);
                }}
              />
              {/* <img
              alt="pfp"
              src={
                user?.user_metadata?.pfp
                  ? user?.user_metadata?.pfp
                  : profilePicture
              }
              className="w-40"
            /> */}
            </div>
            <button
              onClick={handleCompanyProfileSave}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Save Employer Profile
            </button>
          </div>
          {/* <div className="my-10">
            <div className="bg-white shadow-lg rounded-lg px-8 py-6">
              <h2 className="text-2xl font-bold mb-6">Add New Job Listing</h2>
              <div className="mb-4">
                <label
                  htmlFor="newJobListing"
                  className="block text-sm font-medium mb-2"
                >
                  Job Title:
                </label>
                <input
                  type="text"
                  id="newJobListing"
                  className="w-full px-3 py-2 rounded border focus:outline-none focus:ring focus:border-blue-300"
                  value={newJobListing}
                  onChange={(e) => setNewJobListing(e.target.value)}
                />
              </div>
              <button
                onClick={handleAddNewJobListing}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Add Job Listing
              </button>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-lg px-8 py-6">
            <h2 className="text-2xl font-bold mb-6">Previous Job Listings</h2>
            <ul>
              {previousJobListings.map((listing, index) => (
                <li key={index} className="mb-2">
                  {listing}
                </li>
              ))}
            </ul>
          </div> */}
          <Link to={`/ViewPerson/${user.id}`}>View your personal Page</Link>
        </div>
      </div>
    );
}
