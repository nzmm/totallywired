import { Suspense } from "react";
import { Await, useLoaderData } from "react-router-dom";
import { useAsyncCollections } from "../lib/tracks/hooks";
import AlbumTrackList from "../components/views/library/AlbumTrackList";

function AlbumTracksView() {
  const collections = useAsyncCollections();
  return <AlbumTrackList collections={collections} />;
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
