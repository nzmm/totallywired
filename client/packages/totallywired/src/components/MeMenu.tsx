import { useRef, useState } from "react";
import { Popover } from "@totallywired/ui-components";
import { useUser } from "../providers/UserProvider";

export default function MeMenu() {
  const subject = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  const user = useUser();

  return user?.isAuthenticated ? (
    <>
      <span>{user.name}</span>
      <div className="me-menu" ref={subject}>
        <button
          className="avatar"
          onClick={() => setShow(!show)}
          onBlur={() => setShow(false)}
        ></button>
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
    </>
  ) : null;
}
