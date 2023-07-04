import { Suspense, useMemo } from "react";
import { Await } from "react-router-dom";
import { useTracks } from "../providers/TracksProvider";
import TrackList from "../components/TrackList";

export default function Tracks() {
  const promise = useTracks();

  return (
    <Suspense>
      <Await resolve={promise}>
        <TrackList />
      </Await>
    </Suspense>
  );
}
