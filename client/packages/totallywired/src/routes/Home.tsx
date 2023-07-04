import { Link } from "react-router-dom";
import { useUser } from "../providers/GenericProviders";
import Header from "../components/Header";

export default function Home() {
  const user = useUser();

  return (
    <>
      <Header />

      <main>
        <section className="welcome">
          {user.isAuthenticated ? (
            <>
              <p>Hey {user.name},</p>
              <p>
                Visit your <Link to="/lib/tracks">library</Link>&hellip;
              </p>
            </>
          ) : (
            <p>
              <a href="/accounts/login/Microsoft">Login</a>
            </p>
          )}
        </section>
      </main>
    </>
  );
}
