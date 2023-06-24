import { Link } from "react-router-dom";
import { useUser } from "../lib/providers/UserProvider";
import Header from "../lib/components/Header";

export default function Home() {
  const user = useUser();

  return (
    <>
      <Header />

      <main className="home">
        {user.isAuthenticated ? (
          <>
            <p>Hey {user.name},</p>
            <p>
              Visit your <Link to="/lib/tracks">library</Link>&hellip;
            </p>
          </>
        ) : (
          <p>
            <a href="/accounts/sign-in">Login</a>
          </p>
        )}
      </main>
    </>
  );
}
