import { Suspense, useMemo } from "react";
import { Await } from "react-router-dom";
import TrackList from "../components/TrackList";
import { useTracks } from "../providers/TracksProvider";

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
