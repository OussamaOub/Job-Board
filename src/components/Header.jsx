import React, { useEffect, useState } from "react";
import AuthUser from "./AuthUser";
import { logout } from "../config/supabase";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Header() {
  const { user } = AuthUser();
  const navigate = useNavigate();

  const handlesignout = async () => {
    const res = await logout();
    if (!res) {
      navigate("/");
    }
  };

  return (
    <motion.div
      className="Header"
      initial={{ opacity: 0, y: -180 }}
      animate={{ opacity: 1, y: 0 }}
      // viewport={{ once: true }}
    >
      <motion.header
        onClick={handlesignout}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.3 }}
      >
        <img
          title="Sign Out"
          src="https://www.svgrepo.com/show/469796/sign-out.svg"
          className="w-12 rotate-180 cursor-pointer transition-all hover:scale-105"
        />
      </motion.header>
      <main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.3 }}
        className="flex flex-row justify-between items-center gap-4"
      >
        <Link to={"/Blog"}>
          <img
            title="Blog"
            src="https://www.svgrepo.com/show/433184/twitter.svg"
            className="w-10 transition-all hover:scale-105"
          />
        </Link>
        <Link
          to={user?.user_metadata.type === "employer" ? "/Homer" : "/Homee"}
          className=""
          onClick={() => {
            user.user_metadata.type === "employer"
              ? navigate("/Homer")
              : navigate("/Homee");
          }}
        >
          <img
            title="Home Screen"
            src="https://www.nicepng.com/png/detail/646-6467630_logo-random.png"
            className="w-40 mix-blend-multiply cursor-pointer transition-all hover:scale-105"
          />
        </Link>
        <Link to={"/Messages"}>
          <img
            title="Messages"
            src="https://www.svgrepo.com/show/498187/messages.svg"
            className="w-10 transition-all hover:scale-105"
          />
        </Link>
      </main>
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.3 }}
        onClick={() => {
          navigate("/Profile");
        }}
      >
        <img
          title="Profile"
          src={
            user?.user_metadata?.pfp ??
            "https://www.svgrepo.com/show/512729/profile-round-1342.svg"
          }
          className="w-10 cursor-pointer transition-all hover:scale-105"
        />
      </motion.footer>
    </motion.div>
  );
}
