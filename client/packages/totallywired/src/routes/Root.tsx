import { Suspense, useMemo } from "react";
import { Await, Outlet } from "react-router-dom";
import { whoami } from "../lib/api";
import { set } from "../lib/reducer";
import { useUserDispatch } from "../lib/users/hooks";
import Loading from "../components/common/Loading";
import AudioProvider from "../components/providers/AudioProvider";

export default function Root() {
  const dispatch = useUserDispatch();

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
              return (
                <AudioProvider>
                  <Outlet />
                </AudioProvider>
              );
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
