import { Link } from "react-router-dom";
import { useUser } from "../providers/UserProvider";

export default function Home() {
  const user = useUser();

  return (
    <>
      <main>
        <section className="welcome">
          <p>Hey {user?.name},</p>
          <p>
            Visit your <Link to="/lib/tracks">library</Link>&hellip;
          </p>
        </section>
      </main>
    </>
  );
}
