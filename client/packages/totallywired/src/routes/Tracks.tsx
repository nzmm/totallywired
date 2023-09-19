import { Suspense, useEffect } from "react";
import {
  Await,
  LoaderFunctionArgs,
  useAsyncValue,
  useLoaderData,
} from "react-router-dom";
import { getTracks } from "../lib/api";
import { useAsyncTracks } from "../lib/hooks/tracks";
import { requestSearchParams } from "../lib/requests";
import TrackList from "../components/lists/TrackList";

export function tracksLoader({ request }: LoaderFunctionArgs) {
  const searchParams = requestSearchParams(request);
  return getTracks(searchParams);
}

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
