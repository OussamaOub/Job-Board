import React, { useState } from "react";
import { register } from "../config/supabase";
import { useNavigate } from "react-router-dom";
import { useUser } from "../components/UserProvider";
import Swal from "sweetalert2";
import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

export default function Register() {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [togglepass, settogglepass] = useState(true);
  const [type, settype] = useState("");
  const [loading, setloading] = useState(false);
  const { setUser } = useUser();

  const navigate = useNavigate();

  const handleerror = (err) => {
    switch (err.message) {
      case "Failed to register user: User already registered":
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "User already registered",
        });
        break;
      case "Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number.":
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number!",
        });
        break;
      case "AuthApiError: Unable to validate email address: invalid format" ||
        "Invalid email address":
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Invalid Email Format!",
        });
        break;
      case "AuthRetryableFetchError: Failed to fetch":
        Swal.fire({
          icon: "question",
          title: "Oops...",
          text: "No Connection. Try again after connecting to the internet",
        });
        break;
      default:
        Swal.fire({
          icon: "question",
          title: "Oops...",
          text: `${err.message}`,
        });
    }
  };

  const handlesignup = async () => {
    if (email.trim() === "" || password === "" || type.trim() === "") {
      Swal.fire("Error", "Please Fill all fields", "error");
      return;
    }
    setloading(true);

    const res = await register(email, password, type);
    if (res.message) {
      handleerror(res);
      setloading(false);
    }
    if (res.user) {
      setUser(res.user);
      setloading(false);
      res.user.user_metadata.type === "employer"
        ? navigate("/Homer")
        : navigate("/Homee");
    }
  };

  if (loading === true)
    return (
      <div className="Main-Login">
        <main className="LoginFormContainer flex justify-center items-center">
          <CircularProgress />
        </main>
      </div>
    );

  return (
    <div className="Main-Login">
      <main className="LoginFormContainer">
        <header className="Login-form-header">
          <h1 className="text-3xl font-mono font-bold">Register</h1>
          <img
            src="https://www.svgrepo.com/show/468324/clipboard-edit-left-2.svg"
            className="w-14"
          />
        </header>
        <hr className="Divider" />
        <main className="InputContainer">
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            className="InputField"
          />
          <div className="passfield">
            <input
              placeholder="Password"
              value={password}
              type={togglepass ? "password" : "text"}
              onChange={(e) => setpassword(e.target.value)}
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "transparent",
                borderRadius: 10,
                marginLeft: 10,
              }}
            />
            <img
              src={
                togglepass
                  ? "https://www.svgrepo.com/show/532493/eye.svg"
                  : "https://www.svgrepo.com/show/532465/eye-slash.svg"
              }
              className="cursor-pointer w-8 mr-4"
              onClick={() => settogglepass(!togglepass)}
            />
          </div>
        </main>
        <footer className="LoginButtonContainer" onClick={() => handlesignup()}>
          <div className="LoginButton">Create an Account</div>
        </footer>
        <div className="w-full flex items-center justify-center mt-8">
          <FormControl className="w-40 mt-20">
            <InputLabel id="demo-simple-select-label">You are</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={type}
              label="You are"
              onChange={(e) => settype(e.target.value)}
            >
              <MenuItem value={"employee"}>Looking for a job</MenuItem>
              <MenuItem value={"employer"}>Looking for people</MenuItem>
            </Select>
          </FormControl>
        </div>
        <hr className="Divider mt-2" />
        <a href="/" className="flex items-center justify-center">
          <section className="text-center text-purple-700 font-bold cursor-pointer underline">
            Already have an account? Log in
          </section>
        </a>
      </main>
    </div>
  );
}
