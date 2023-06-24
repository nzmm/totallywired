import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useUser, userDispatch } from "../lib/providers/UserProvider";
import { User } from "../lib/types";

export default function Root() {
  const user = useUser();
  const dispatch = userDispatch();
  const [loading, setLoading] = useState(!user.isAuthenticated);

  useEffect(() => {
    if (user.isAuthenticated || !dispatch) {
      return;
    }

    fetch("/api/v1/whoami").then(async (res) => {
      const userData: User = await res.json();
      dispatch({ type: "set", object: userData });
      setTimeout(() => setLoading(false), 1000);
    });

  }, [user, dispatch]);

  return loading ? "Loading..." : <Outlet />;
}
