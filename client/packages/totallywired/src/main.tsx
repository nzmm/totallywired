import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ScrollRestorationProvider } from "@totallywired/ui-components";
import AppRouter from "./router";
import UserProvider from "./components/providers/UserProvider";

import "@totallywired/ui-components/dist/cjs/totallywired.css";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ScrollRestorationProvider>
      <UserProvider>
        <RouterProvider router={AppRouter} />
      </UserProvider>
    </ScrollRestorationProvider>
  </React.StrictMode>,
);
