import { useRef, useState } from "react";
import { Popover, PopoverProps } from "@totallywired/ui-components";

const BG_STYLE = {
  width: "60%",
  height: "300px",
  borderRadius: 4,
  border: "1px solid gray",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#ddd"
};

const BTN_STYLE = {
  padding: "10px 15px",
  borderRadius: 6
};

export default {
  title: "React/Popover",
  component: Popover,
  argTypes: {
    ref: {
      table: {
        disable: true
      }
    },
    key: {
      table: {
        disable: true
      }
    }
  }
};

export const Resizable = {
  args: {},
  render: () => {
    return (
      <div style={BG_STYLE}>
        <Popover arrowOffset={0.75} show>
          <textarea
            rows={10}
            cols={25}
            defaultValue={
              "Some interesting text in a popover...\n\n" +
              "😀 😃 😄 😁 😆 😅 😂 🤣 🥲 🥹 😊 😇 🙂 🙃 😉 😌 😍" +
              "🥰 😘 😗 😙 😚 😋 😛 😝 😜 🤪 🤨 🧐 🤓 😎 🥸 🤩 🥳" +
              "\n\n... and a bunch of emoji."
            }
          ></textarea>
        </Popover>
      </div>
    );
  }
};

export const Anchored = {
  args: {},
  render: () => {
    const anchor = useRef<HTMLButtonElement>(null);
    return (
      <div style={BG_STYLE}>
        <Popover subject={anchor} show>
          Some popover content further explaining things...
        </Popover>

        <div>
          A span element to{" "}
          <span ref={anchor}>
            <u>anchor things</u>
          </span>{" "}
          by.
        </div>
      </div>
    );
  }
};

export const Orientation = {
  args: {
    orientation: "south"
  },
  render: (args: Partial<PopoverProps>) => {
    const anchor = useRef<HTMLButtonElement>(null);
    return (
      <div style={BG_STYLE}>
        <Popover subject={anchor} orientation={args.orientation} show>
          Some popover content further explaining things...
        </Popover>

        <div>
          A span element to{" "}
          <span ref={anchor}>
            <u>anchor things</u>
          </span>{" "}
          by.
        </div>
      </div>
    );
  }
};

export const Toggle = {
  args: {},
  render: () => {
    const [show, setShow] = useState(false);
    const anchor = useRef<HTMLButtonElement>(null);
    return (
      <div style={BG_STYLE}>
        <Popover subject={anchor} show={show}>
          Some popover content
        </Popover>

        <button
          ref={anchor}
          style={BTN_STYLE}
          onClick={() => setShow(!show)}
          onBlur={() => setShow(false)}
        >
          Popover toggle
        </button>
      </div>
    );
  }
};
