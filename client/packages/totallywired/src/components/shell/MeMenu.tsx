import { User } from "../../lib/types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../vendor/radix-ui/Popover";
import { Avatar } from "../vendor/radix-ui/Avatar";
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
        <menu id="me-menu">
          <li>
            <a href="#">My Profile</a>
          </li>
          <li>
            <a href="#">Settings</a>
          </li>
          <li>
            <a href="#">Sign out</a>
          </li>
        </menu>
      </PopoverContent>
    </Popover>
  ) : null;
}
