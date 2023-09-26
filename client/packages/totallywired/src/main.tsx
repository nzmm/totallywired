import "@totallywired/ui-components/dist/cjs/totallywired.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { AppRouter } from "./router";
import UserProvider from "./components/providers/UserProvider";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <UserProvider>
      <RouterProvider router={AppRouter} />
    </UserProvider>
  </React.StrictMode>,
);
