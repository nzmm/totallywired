import { Suspense } from "react";
import {
  Await,
  LoaderFunctionArgs,
  useAsyncValue,
  useLoaderData,
} from "react-router-dom";
import { Res, requestSearchParams } from "../lib/requests";
import { ArtistDetail, Track } from "../lib/types";
import { getArtist, getTrackByArtist } from "../lib/api";
import { ArtistTrackList } from "../components/ArtistTrackList";

export function artistTracksLoader({ request, params }: LoaderFunctionArgs) {
  const artistId = params["artistId"];

  if (!artistId) {
    throw new Error("artistId required");
  }

  const searchParams = requestSearchParams(request);
  return Promise.all([
    getArtist(artistId),
    getTrackByArtist(artistId, searchParams),
  ]);
}

function ArtistTracksView() {
  const [{ data: artist }, { data: tracks = [] }] = useAsyncValue() as [
    Res<ArtistDetail>,
    Res<Track[]>
  ];
  return <ArtistTrackList artist={artist!} tracks={tracks} />;
}

export default function ArtistTracks() {
  const data = useLoaderData();
  return (
    <Suspense>
      <Await resolve={data}>
        <ArtistTracksView />
      </Await>
    </Suspense>
  );
}
