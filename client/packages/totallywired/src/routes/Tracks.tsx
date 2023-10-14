import { Suspense } from "react";
import { Await, useLoaderData } from "react-router-dom";
import { useAsyncTracks } from "../lib/tracks/hooks";
import TrackList from "../components/lib/TrackList";

function TrackListView() {
  const tracks = useAsyncTracks();
  return <TrackList tracks={tracks} />;
}

export default function Tracks() {
  const data = useLoaderData();

  return (
    <Suspense>
      <Await resolve={data}>
        <TrackListView />
      </Await>
    </Suspense>
  );
}
