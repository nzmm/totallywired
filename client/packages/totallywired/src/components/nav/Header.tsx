import { Link } from "react-router-dom";
import { useUser } from "../../providers/UserProvider";
import MeMenu from "./MeMenu";
import SearchInput from "../inputs/SearchInput";
import "./Header.css";

export default function Header() {
  const user = useUser();
  return (
    <header className="d-flex row">
      <h1>
        <Link to="/">TotallyWired</Link>
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
