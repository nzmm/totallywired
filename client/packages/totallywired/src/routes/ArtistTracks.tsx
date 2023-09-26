import { Suspense } from "react";
import { Await, useLoaderData } from "react-router-dom";
import { useAsyncArtistTracks } from "../lib/tracks/hooks";
import { ArtistTrackList } from "../components/lists/ArtistTrackList";

function ArtistTracksView() {
  const [artist, tracks] = useAsyncArtistTracks();
  return <ArtistTrackList artist={artist} tracks={tracks} />;
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
