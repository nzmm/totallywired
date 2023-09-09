import { Suspense } from "react";
import {
  Await,
  LoaderFunctionArgs,
  useAsyncValue,
  useLoaderData,
} from "react-router-dom";
import { Res, requestSearchParams } from "../lib/requests";
import { AlbumDetail, Track } from "../lib/types";
import { getAlbum, getTracksByAlbum } from "../lib/webapi";
import AlbumTracksList from "../components/AlbumTrackList";

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
  const [{ data: album }, { data: tracks = [] }] = useAsyncValue() as [
    Res<AlbumDetail>,
    Res<Track[]>
  ];
  return <AlbumTracksList album={album!} tracks={tracks} />;
}

export default function AlbumTracks() {
  const data = useLoaderData();

  return (
    <Suspense>
      <Await resolve={data}>
        <AlbumTracksView />
      </Await>
    </Suspense>
  );
}
