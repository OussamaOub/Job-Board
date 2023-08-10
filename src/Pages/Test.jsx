import React from "react";
import AuthUser from "../components/AuthUser";
import { CircularProgress } from "@mui/material";

export default function Test() {
  const { user } = AuthUser();

  if (!user) {
    return (
      <div className="w-screen h-screen items-center justify-center flex">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="w-screen h-screen items-center justify-center flex">
      {user.user_metadata.type}
    </div>
  );
}
