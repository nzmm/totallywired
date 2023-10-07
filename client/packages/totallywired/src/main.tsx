import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ScrollRestorationProvider } from "@totallywired/ui-components";
import UserProvider from "./components/providers/UserProvider";
import AudioProvider from "./components/providers/AudioProvider";
import AppRouter from "./router";

import "@totallywired/ui-components/dist/cjs/totallywired.css";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ScrollRestorationProvider>
      <AudioProvider>
        <UserProvider>
          <RouterProvider router={AppRouter} />
        </UserProvider>
      </AudioProvider>
    </ScrollRestorationProvider>
  </React.StrictMode>,
);
