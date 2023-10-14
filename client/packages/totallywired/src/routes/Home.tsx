import { Link } from "react-router-dom";
import { useUser } from "../lib/users/hooks";
import Header from "../components/shell/Header";

export default function Home() {
  const user = useUser();

  return (
    <>
      <Header />

      <main>
        <section className="welcome">
          <h3>Hey {user?.name},</h3>
          <p>
            Visit your <Link to="/lib/tracks">library</Link>&hellip;
          </p>
        </section>
      </main>
    </>
  );
}
