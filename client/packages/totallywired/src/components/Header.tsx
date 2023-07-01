import { Link } from "react-router-dom";
import MeMenu from "./MeMenu";
import SearchInput from "./SearchInput";

export default function Header() {
  return (
    <header className="d-flex row">
      <h1>
        <Link to="/">Totallywired</Link>
      </h1>

      <SearchInput />

      <MeMenu />
    </header>
  );
}
