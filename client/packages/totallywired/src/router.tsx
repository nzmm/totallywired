import { createBrowserRouter } from "react-router-dom";

import "@totallywired/ui-components/dist/cjs/totallywired.css";
import "./styles.css";

import ErrorPage from "./routes/Error";
import Root from "./routes/Root";
import Home from "./routes/Home";
import Library from "./routes/Library";
import Tracks, { tracksLoader } from "./routes/Tracks";
import Albums, { albumsLoader } from "./routes/Albums";
import Artists, { artistsLoader } from "./routes/Artists";
import AlbumTracks, { albumTracksLoader } from "./routes/AlbumTracks";
import ArtistTracks, { artistTracksLoader } from "./routes/ArtistTracks";
import Queue from "./routes/Queue";
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
            loader: tracksLoader,
          },
          {
            path: "albums",
            element: <Albums />,
            loader: albumsLoader,
          },
          {
            path: "albums/:releaseId/tracks",
            element: <AlbumTracks />,
            loader: albumTracksLoader,
          },
          {
            path: "artists",
            element: <Artists />,
            loader: artistsLoader,
          },
          {
            path: "artists/:artistId/tracks",
            element: <ArtistTracks />,
            loader: artistTracksLoader,
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
