import { Link } from "react-router-dom";
import { useUser } from "../../providers/UserProvider";
import MeMenu from "./MeMenu";
import SearchInput from "../inputs/SearchInput";
import "./Header.css";

type HeaderProps = {
  withSearch?: boolean;
};

export default function Header({ withSearch }: HeaderProps) {
  const user = useUser();
  return (
    <header className="d-flex row">
      <h1 className="brand" title="TotallyWired!">
        <Link to="/">TotallyWired</Link>
      </h1>

      {user ? (
        <>
          {withSearch ? <SearchInput /> : null}
          <MeMenu user={user} />
        </>
      ) : null}
    </header>
  );
}
