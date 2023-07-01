import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";

import { AudioProvider } from "./providers/AudioProvider";
import { UserProvider } from "./providers/GenericProviders";

import "@totallywired/ui-components/dist/cjs/totallywired.css";
import "./styles.css";

import ErrorPage from "./routes/Error";
import Root from "./routes/Root";
import Home from "./routes/Home";
import Library from "./routes/Library";
import Tracks from "./routes/Tracks";
import Albums from "./routes/Albums";
import Artists from "./routes/Artists";
import Providers from "./routes/Providers";
import Queue from "./routes/Queue";

export const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "lib/",
        element: <Library />,
        children: [
          {
            path: "tracks",
            element: <Tracks />
          },
          {
            path: "albums/:albumId/tracks",
            element: <Tracks />,
          },
          {
            path: "albums",
            element: <Albums />,
          },
          {
            path: "artists",
            element: <Artists />,
          },
          {
            path: "queue",
            element: <Queue />,
          },
          {
            path: "providers",
            element: <Providers />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AudioProvider>
      <UserProvider>
        <RouterProvider router={AppRouter} />
      </UserProvider>
    </AudioProvider>
  </React.StrictMode>
);
