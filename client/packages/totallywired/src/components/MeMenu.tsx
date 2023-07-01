import { useRef, useState } from "react";
import { Popover } from "@totallywired/ui-components";
import { useUser } from "../providers/GenericProviders";

export default function MeMenu() {
  const subject = useRef<HTMLButtonElement>(null);
  const [show, setShow] = useState(false);
  const user = useUser();

  return user?.isAuthenticated ? (
    <div className="me-menu">
      <span>{user.name}</span>
      <button
        ref={subject}
        className="avatar round md"
        onClick={() => setShow(!show)}
        onBlur={() => setShow(false)}
      >
        <img
          src={`/avatars/${user.userId}.jpg`}
          alt="The current users avatar"
        />
      </button>

      <Popover
        subject={subject}
        orientation="southwest"
        arrowWidth={14}
        borderRadius={3}
        arrowOffset={0.86}
        show={show}
      >
        <nav>
          <menu>
            <li>
              <a href="#">My Profile</a>
            </li>
            <li>
              <a href="#">Settings</a>
            </li>
            <hr />
            <li>
              <a href="#">Sign out</a>
            </li>
          </menu>
        </nav>
      </Popover>
    </div>
  ) : null;
}
