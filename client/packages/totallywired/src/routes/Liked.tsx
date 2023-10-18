import { Suspense } from "react";
import { useLoaderData, Await } from "react-router-dom";
import { useAsyncTracks } from "../lib/tracks/hooks";
import TrackList from "../components/library/TrackList";

function TrackListView() {
  const tracks = useAsyncTracks();
  return <TrackList tracks={tracks} />;
}

export default function Liked() {
  const data = useLoaderData();

  return (
    <Suspense>
      <Await resolve={data}>
        <TrackListView />
      </Await>
    </Suspense>
  );
}
