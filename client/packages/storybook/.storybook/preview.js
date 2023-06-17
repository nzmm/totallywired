/** @type { import('@storybook/react').Preview } */

import "@totallywired/ui-components/dist/cjs/totallywired.css";

const preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/
      }
    }
  }
};

export default preview;
