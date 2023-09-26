import { Suspense } from "react";
import { Await, Outlet, useLoaderData } from "react-router-dom";
import { useAsyncAlbumTracks } from "../lib/tracks/hooks";
import AlbumTracksList from "../components/lists/AlbumTrackList";

function AlbumTracksView() {
  const [album, tracks] = useAsyncAlbumTracks();
  if (!album) {
    return null;
  }
  return <AlbumTracksList album={album} tracks={tracks} />;
}

export default function AlbumTracks() {
  const data = useLoaderData();

  return (
    <>
      <Suspense>
        <Await resolve={data}>
          <AlbumTracksView />
        </Await>
      </Suspense>
      <Outlet />
    </>
  );
}
