import React, { useEffect, useState } from "react";
import { useUser } from "./UserProvider";
import { fetchuser } from "../config/supabase";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function AuthUser() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [alertShown, setAlertShown] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(
      localStorage.getItem("sb-atexjhmmpysyfrsphzfa-auth-token")
    );

    const initializeUser = async () => {
      if (storedUser && !user) {
        const temp = await fetchuser();
        setUser(temp);
      } else if (!storedUser && !user) {
        navigate("/", { replace: true });
      }
    };

    const verifyDataAndNavigate = () => {
      if (
        user &&
        (user?.user_metadata.name === undefined ||
          user?.user_metadata.pfp === undefined) &&
        !alertShown
      ) {
        Swal.fire(
          "First time",
          "You need to set up your account first with a name and picture",
          "info"
        );
        setAlertShown(true);
        navigate("/Profile");
      }
    };

    initializeUser();
    verifyDataAndNavigate();
  }, [navigate, setUser, user, alertShown]);

  return { user };
}
