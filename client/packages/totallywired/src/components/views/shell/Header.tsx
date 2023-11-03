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
        <Link to="/" className="brand">
          <img src="/totallywired.svg" alt="TotallyWired" height="30" />
        </Link>
      </div>

      <div>{children}</div>

      <div>{user ? <MeMenu user={user} /> : null}</div>
    </header>
  );
}
