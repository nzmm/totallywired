import "@totallywired/ui-components/dist/cjs/totallywired.css";
import { createBrowserRouter } from "react-router-dom";
import {
  albumsLoader,
  albumTracksLoader,
  artistsLoader,
  artistTracksLoader,
  likedLoader,
  collectionLoader,
  providersLoader,
  providerLoader,
} from "./lib/loaders";
import Manage from "./routes/manage/Manage";
import Me from "./routes/manage/Me";
import AlbumTracks from "./routes/AlbumTracks";
import Albums from "./routes/Albums";
import ArtistTracks from "./routes/ArtistTracks";
import Artists from "./routes/Artists";
import ErrorPage from "./routes/Error";
import Home from "./routes/Home";
import Library from "./routes/Library";
import Providers from "./routes/manage/Providers";
import Queue from "./routes/Queue";
import Root from "./routes/Root";
import MusicCollection from "./routes/MusicCollection";
import Liked from "./routes/Liked";
import AlbumEditor from "./routes/AlbumEdit";
import ManageProvider from "./components/manage/ManageProvider";
import ManageProvidersLanding from "./components/manage/ManageProvidersLanding";

import "./styles.css";

const AppRouter = createBrowserRouter([
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
        path: "manage/",
        element: <Manage />,
        children: [
          {
            path: "me",
            element: <Me />,
          },
          {
            path: "providers",
            element: <Providers />,
            loader: providersLoader,
            children: [
              {
                path: ":sourceId",
                element: <ManageProvider />,
                loader: providerLoader,
              },
              {
                path: "",
                element: <ManageProvidersLanding />,
              },
            ],
          },
        ],
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
        ],
      },
    ],
  },
]);

export default AppRouter;
