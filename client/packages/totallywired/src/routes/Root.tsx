import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useUser, userDispatch } from "../providers/UserProvider";
import { whoami } from "../lib/requests";
import Loading from "../components/Loading";

export default function Root() {
  const user = useUser();
  const dispatch = userDispatch();
  const [loading, setLoading] = useState(!user.isAuthenticated);

  useEffect(() => {
    if (user.isAuthenticated || !dispatch) {
      return;
    }

    const t0 = Date.now();

    whoami().then((data) => {
      dispatch({ type: "set", object: data });
      setTimeout(() => setLoading(false), 1000 - (Date.now() - t0));
    });
  }, [user, dispatch]);

  return loading ? <Loading /> : <Outlet />;
}
