import { Suspense } from "react";
import { Await, LoaderFunctionArgs, useLoaderData } from "react-router-dom";
import { getArtist, getTrackByArtist } from "../lib/api";
import { useAsyncArtistTracks } from "../lib/hooks/tracks";
import { requestSearchParams } from "../lib/requests";
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
  const [artist, tracks] = useAsyncArtistTracks();
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
