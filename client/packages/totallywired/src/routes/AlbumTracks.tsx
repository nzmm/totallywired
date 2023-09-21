import { Suspense } from "react";
import {
  Await,
  LoaderFunctionArgs,
  Outlet,
  useLoaderData,
} from "react-router-dom";
import { getAlbum, getTracksByAlbum } from "../lib/api";
import { useAsyncAlbumTracks } from "../lib/hooks/tracks";
import { requestSearchParams } from "../lib/requests";
import AlbumTracksList from "../components/lists/AlbumTrackList";

export function albumTracksLoader({ request, params }: LoaderFunctionArgs) {
  const releaseId = params["releaseId"];

  if (!releaseId) {
    throw new Error("releaseId required");
  }

  const searchParams = requestSearchParams(request);
  return Promise.all([
    getAlbum(releaseId),
    getTracksByAlbum(releaseId, searchParams),
  ]);
}

function AlbumTracksView() {
  const [album, tracks] = useAsyncAlbumTracks();
  return <AlbumTracksList album={album!} tracks={tracks} />;
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
