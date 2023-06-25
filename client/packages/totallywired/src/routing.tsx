import { createBrowserRouter } from "react-router-dom";

import ErrorPage from "./routes/Error";
import Root from "./routes/Root";
import Home from "./routes/Home";
import Library from "./routes/Library";
import Tracks from "./routes/Tracks";
import Albums from "./routes/Albums";
import Artists from "./routes/Artists";
import ContentProviders from "./routes/Providers";
import Providers from "./routes/Providers";

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
            path: "providers",
            element: <Providers />,
          },
        ],
      },
    ],
  },
]);
