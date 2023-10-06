import "@totallywired/ui-components/dist/cjs/totallywired.css";
import { createBrowserRouter } from "react-router-dom";
import {
  albumsLoader,
  albumTracksLoader,
  artistsLoader,
  artistTracksLoader,
  likedLoader,
  collectionLoader,
} from "./lib/loaders";
import AlbumTracks from "./routes/AlbumTracks";
import Albums from "./routes/Albums";
import ArtistTracks from "./routes/ArtistTracks";
import Artists from "./routes/Artists";
import ErrorPage from "./routes/Error";
import Home from "./routes/Home";
import Library from "./routes/Library";
import Providers from "./routes/Providers";
import Queue from "./routes/Queue";
import Root from "./routes/Root";
import MusicCollection from "./routes/MusicCollection";
import Liked from "./routes/Liked";
import AlbumEditor from "./routes/AlbumEdit";

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
            element: <MusicCollection />,
            loader: collectionLoader,
          },
          {
            path: "albums",
            element: <Albums />,
            loader: albumsLoader,
          },
          {
            path: "albums/:releaseId",
            element: <AlbumTracks />,
            loader: albumTracksLoader,
          },
          {
            path: "albums/:releaseId/editor",
            element: <AlbumEditor />,
          },
          {
            path: "artists",
            element: <Artists />,
            loader: artistsLoader,
          },
          {
            path: "artists/:artistId",
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
