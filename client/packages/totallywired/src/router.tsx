import "@totallywired/ui-components/dist/cjs/totallywired.css";
import { createBrowserRouter } from "react-router-dom";
import AlbumTracks, { albumTracksLoader } from "./routes/AlbumTracks";
import Albums, { albumsLoader } from "./routes/Albums";
import ArtistTracks, { artistTracksLoader } from "./routes/ArtistTracks";
import Artists, { artistsLoader } from "./routes/Artists";
import ErrorPage from "./routes/Error";
import Home from "./routes/Home";
import Library from "./routes/Library";
import Providers from "./routes/Providers";
import Queue from "./routes/Queue";
import Root from "./routes/Root";
import Tracks, { tracksLoader } from "./routes/Tracks";
import Liked, { likedLoader } from "./routes/Liked";
import AlbumEditor, { albumEditorLoader } from "./routes/AlbumEditor";

import "./styles.css";

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
            path: "albums/:releaseId/editor",
            element: <AlbumEditor />,
            loader: albumEditorLoader,
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
            path: "liked",
            element: <Liked />,
            loader: likedLoader,
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
