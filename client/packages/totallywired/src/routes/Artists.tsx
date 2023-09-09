import { Suspense } from "react";
import { Await, LoaderFunctionArgs, useAsyncValue, useLoaderData } from "react-router-dom";
import { getArtists } from "../lib/webapi";
import { Res, requestSearchParams } from "../lib/requests";
import { Artist } from "../lib/types";
import ArtistList from "../components/ArtistList";

export function artistsLoader({ request }: LoaderFunctionArgs) {
  const searchParams = requestSearchParams(request);
  return getArtists(searchParams);
};

function ArtistsView() {
  const { data: artists = [] } = useAsyncValue() as Res<Artist[]>;
  return <ArtistList artists={artists} />;
}

export default function Artists() {
  const data = useLoaderData();
  return (
    <Suspense>
      <Await resolve={data}>
        <ArtistsView />
      </Await>
    </Suspense>
  );
}
