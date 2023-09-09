import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { User } from "../lib/types";
import "./styles/common/Dropdown.css";
import "./styles/MeMenu.css";

export default function MeMenu({ user }: { user: User }) {
  return user ? (
    <div className="me-menu">
      <span>{user.name}</span>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="avatar round md">
            <img
              src={`/avatars/${user.userId}.jpg`}
              alt="The current users avatar"
            />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content className="DropdownMenuContent" sideOffset={5}>
            <DropdownMenu.Item className="DropdownMenuItem">
              <a href="#">My Profile</a>
            </DropdownMenu.Item>

            <DropdownMenu.Item className="DropdownMenuItem">
              <a href="#">Settings</a>
            </DropdownMenu.Item>

            <DropdownMenu.DropdownMenuSeparator className="DropdownMenuSeparator" />

            <DropdownMenu.Item className="DropdownMenuItem">
              <a href="#">Sign out</a>
            </DropdownMenu.Item>

            <DropdownMenu.Arrow className="DropdownMenuArrow" />
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  ) : null;
}
