import { Splitter } from "../components/Splitter";

const SPLIT_STYLE = { height: 300, border: "1px solid gray", borderRadius: 4 };
const SIDE_STYLE = {
  display: "flex",
  height: "100%",
  width: "100%",
  justifyContent: "center",
  alignItems: "center"
};

const Panel = ({ label = "" }) => {
  return <div style={SIDE_STYLE}>{label}</div>;
};

export default {
  title: "React/Splitter",
  component: Splitter,
  argTypes: {}
};

export const Vertical = {
  args: {},
  render: () => {
    return (
      <div style={SPLIT_STYLE}>
        <Splitter orientation="vertical">
          <Panel label="Upper panel" />
          <Panel label="Lower panel" />
        </Splitter>
      </div>
    );
  }
};

export const Horizontal = {
  args: {},
  render: () => {
    return (
      <div style={SPLIT_STYLE}>
        <Splitter orientation="horizontal">
          <Panel label="Left panel" />
          <Panel label="Right panel" />
        </Splitter>
      </div>
    );
  }
};

export const Nested = {
  args: {},
  render: () => {
    return (
      <div style={SPLIT_STYLE}>
        <Splitter orientation="vertical" initialPosition="30%">
          <Splitter orientation="horizontal" initialPosition="30%">
            <Panel label="Upper left panel" />
            <Panel label="Upper right panel" />
          </Splitter>

          <Splitter orientation="horizontal" initialPosition="60%">
            <Panel label="Lower left panel" />
            <Panel label="Lower right panel" />
          </Splitter>
        </Splitter>
      </div>
    );
  }
};
