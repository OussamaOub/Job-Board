import React, { useState } from "react";
import { login } from "../config/supabase";
import { useUser } from "../components/UserProvider";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { CircularProgress } from "@mui/material";
import { motion } from "framer-motion";

export default function Login() {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [togglepass, settogglepass] = useState(true);
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleerror = (err) => {
    switch (err.message) {
      case "AuthApiError: Unable to validate email address: invalid format" ||
        "Invalid email address":
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Invalid Email Format!",
        });
        break;
      case "Failed to log in: Failed to fetch":
        Swal.fire({
          icon: "question",
          title: "Oops...",
          text: "No Connection. Try again after connecting to the internet",
        });
        break;
      case "Failed to log in: Invalid login credentials":
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Invalid Login credentials",
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

  const handleLogin = async () => {
    setloading(true);
    const res = await login(email, password);
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
      <motion.main
        className="LoginFormContainer"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.1 }}
      >
        <header className="Login-form-header">
          <h1 className="text-3xl font-mono font-bold">Log in</h1>
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
              onChange={(e) => {
                setpassword(e.target.value);
              }}
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "transparent",
                borderRadius: 10,
                marginLeft: 10,
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleLogin();
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
        <footer className="LoginButtonContainer">
          <motion.div
            className="LoginButton"
            onClick={() => {
              handleLogin();
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95, opacity: 0.8 }}
          >
            Login
          </motion.div>
        </footer>
        <hr className="Divider mt-8" />
        <a href="/Register">
          <section className="text-center mt-8 text-purple-700 font-bold cursor-pointer underline">
            Don't have an account? Sign Up
          </section>
        </a>
      </motion.main>
    </div>
  );
}
