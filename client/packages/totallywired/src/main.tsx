import "@totallywired/ui-components/dist/cjs/totallywired.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";
import { UserProvider } from "./providers/UserProvider";
import { AppRouter } from "./router";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <UserProvider>
      <RouterProvider router={AppRouter} />
    </UserProvider>
  </React.StrictMode>
);
