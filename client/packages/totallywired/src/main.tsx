import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { AppRouter } from "./routing";
import { UserProvider } from "./providers/UserProvider";

import "@totallywired/ui-components/dist/cjs/totallywired.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <UserProvider>
      <RouterProvider router={AppRouter} />
    </UserProvider>
  </React.StrictMode>
);
