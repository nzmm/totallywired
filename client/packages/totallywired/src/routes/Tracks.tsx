import { Suspense, useEffect } from "react";
import {
  Await,
  LoaderFunctionArgs,
  useAsyncValue,
  useLoaderData,
} from "react-router-dom";
import { getTracks } from "../lib/webapi";
import { Res, requestSearchParams } from "../lib/requests";
import { Track } from "../lib/types";
import { tracksDisptach } from "../providers/TracksProvider";
import { set } from "../lib/reducer";
import TrackList from "../components/TrackList";

export function tracksLoader({ request }: LoaderFunctionArgs) {
  const searchParams = requestSearchParams(request);
  return getTracks(searchParams);
}

function TrackListView() {
  const { data: tracks = [] } = useAsyncValue() as Res<Track[]>;
  const dispatch = tracksDisptach();

  useEffect(() => {
    dispatch(set(tracks));
  }, [dispatch, tracks]);

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
