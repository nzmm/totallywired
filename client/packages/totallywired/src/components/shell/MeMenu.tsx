import { Link } from "react-router-dom";
import { User } from "../../lib/types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../vendor/radix-ui/Popover";
import { Avatar } from "../vendor/radix-ui/Avatar";
import Separator from "../common/Separator";
import "./MeMenu.css";

export default function MeMenu({ user }: { user: User }) {
  return user ? (
    <Popover>
      <PopoverTrigger asChild>
        <button id="me-btn">
          <Avatar src={`/avatars/${user.id}.jpg`} name={user.name} />
        </button>
      </PopoverTrigger>

      <PopoverContent>
        <nav id="me-menu">
          <menu>
            <li>
              <Link to="/lib/tracks">My Library</Link>
            </li>
          </menu>
          <Separator />
          <menu>
            <li>
              <Link to="/manage/me">My Profile</Link>
            </li>
            <li>
              <Link to="/manage/providers">My Providers</Link>
            </li>
          </menu>
          <Separator />
          <menu>
            <li>
              <a href="/accounts/signout">Sign out</a>
            </li>
          </menu>
        </nav>
      </PopoverContent>
    </Popover>
  ) : null;
}
