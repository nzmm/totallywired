import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { userStore } from "../providers/GenericProviders";
import { whoami } from "../lib/webapi";
import Loading from "../components/Loading";

export default function Root() {
  const store = userStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    whoami().then((data) => {
      store.set(data);
      setLoading(false);  
    });
  }, [store]);

  return loading ? <Loading /> : <Outlet />;
}
