import { Link } from "react-router-dom";
import { useUser } from "../providers/UserProvider";
import MeMenu from "./MeMenu";
import SearchInput from "./SearchInput";

export default function Header() {
  const user = useUser();
  return (
    <header className="d-flex row">
      <h1>
        <Link to="/">Totallywired</Link>
      </h1>

      {user ? (
        <>
          <SearchInput />
          <MeMenu user={user} />
        </>
      ) : null}
    </header>
  );
}
