import { Suspense, useMemo } from "react";
import { Await, Outlet } from "react-router-dom";
import { whoami } from "../lib/webapi";
import { userDispatch } from "../providers/UserProvider";
import Loading from "../components/Loading";
import { set } from "../lib/reducer";

export default function Root() {
  const dispatch = userDispatch();

  const promise = useMemo(async () => {
    const user = await whoami();
    if (user.ok && user.data) {
      dispatch(set(user.data));
    }
    return user;
  }, [dispatch]);

  return (
    <Suspense fallback={<Loading />}>
      <Await
        resolve={promise}
        children={(res) => {
          switch (res.status) {
            case 200: {
              return <Outlet />;
            }
            case 401: {
              return (
                <p>
                  <a href="/accounts/login/Microsoft">Microsoft Login</a>
                </p>
              );
            }
            default: {
              return <p>Error: {res.status}</p>;
            }
          }
        }}
      />
    </Suspense>
  );
}
