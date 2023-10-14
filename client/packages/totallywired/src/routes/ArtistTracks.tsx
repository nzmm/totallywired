import { Suspense } from "react";
import { Await, useLoaderData } from "react-router-dom";
import { useAsyncCollections } from "../lib/tracks/hooks";
import MusicCollectionList from "../components/lib/MusicCollectionList";

function ArtistTracksView() {
  const collections = useAsyncCollections();
  return <MusicCollectionList scope="artist" collections={collections} />;
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
