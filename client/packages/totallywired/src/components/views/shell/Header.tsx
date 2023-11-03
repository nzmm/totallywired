import { Link } from "react-router-dom";
import { useUser } from "../../../lib/users/hooks";
import MeMenu from "./MeMenu";
import "./Header.css";

type HeaderProps = React.PropsWithChildren;

export default function Header({ children }: HeaderProps) {
  const user = useUser();
  return (
    <header>
      <div>
        <h1 className="brand" title="TotallyWired!">
          <Link to="/">TotallyWired</Link>
        </h1>
      </div>

      <div>{children}</div>

      <div>{user ? <MeMenu user={user} /> : null}</div>
    </header>
  );
}
