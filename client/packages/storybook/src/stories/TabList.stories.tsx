import { TabList } from "@totallywired/ui-components";

export default {
  title: "React/TabList",
  component: TabList,
  argTypes: {
  }
};

export const Horizontal = {
  args: {
  },
  render: () => {
    return (
      <>
        <TabList>
          <p>Content tab 1</p>
          <p>Content tab 2</p>
          <p>Content tab 3</p>
        </TabList>
      </>
    );
  }
};
