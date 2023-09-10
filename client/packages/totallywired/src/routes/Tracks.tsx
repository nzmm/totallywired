import { Suspense, useEffect } from "react";
import {
  Await,
  LoaderFunctionArgs,
  useAsyncValue,
  useLoaderData,
} from "react-router-dom";
import TrackList from "../components/TrackList";
import { set } from "../lib/reducer";
import { Res, requestSearchParams } from "../lib/requests";
import { Track } from "../lib/types";
import { getTracks } from "../lib/webapi";
import { tracksDisptach } from "../providers/TracksProvider";

export function tracksLoader({ request }: LoaderFunctionArgs) {
  const searchParams = requestSearchParams(request);
  return getTracks(searchParams);
}

function TrackListView() {
  const dispatch = tracksDisptach();
  const { data: tracks = [] } = useAsyncValue() as Res<Track[]>;

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
