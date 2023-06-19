import { useRef, useState } from "react";
import { Popover } from "@totallywired/ui-components";

const MeMenu = () => {
  const subject = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  return (
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
          <ul>
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
          </ul>
        </nav>
      </Popover>
    </div>
  );
};

export { MeMenu };
