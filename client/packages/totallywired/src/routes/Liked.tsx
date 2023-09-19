import { Suspense } from "react";
import { LoaderFunctionArgs, useLoaderData, Await } from "react-router-dom";
import TrackList from "../components/TrackList";
import { getTracks } from "../lib/api";
import { useAsyncTracks } from "../lib/hooks/tracks";
import { requestSearchParams } from "../lib/requests";
import { ReactionType } from "../lib/types";

export function likedLoader({ request }: LoaderFunctionArgs) {
  const searchParams = requestSearchParams(request);
  searchParams.append("reaction", ReactionType.Liked.toString());
  return getTracks(searchParams);
}

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
