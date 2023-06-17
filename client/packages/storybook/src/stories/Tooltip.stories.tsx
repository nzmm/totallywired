import { Tooltip as Tip } from "@totallywired/ui-components";

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

export default {
  title: "React/Popover",
  component: Tip,
  argTypes: {}
};

export const Tooltip = {
  args: {},
  render: () => {
    return (
      <div style={BG_STYLE}>
        <Tip
          id="tip"
          as="p"
          text="A very elaborate explanation about an important thing!"
        >
          Some text with a tooltip to make things clearer. Just hover me.
        </Tip>
      </div>
    );
  }
};
