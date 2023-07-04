import { Suspense, useMemo } from "react";
import { Await, Outlet } from "react-router-dom";
import { userStore } from "../providers/GenericProviders";
import { whoami } from "../lib/webapi";
import Loading from "../components/Loading";

export default function Root() {
  const store = userStore();

  const promise = useMemo(async () => {
    const user = await whoami();
    if (user.ok && user.data) {
      store.set(user.data);
    }
    return user;
  }, [store]);

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
