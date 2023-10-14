import { Suspense } from "react";
import { Await, useAsyncValue, useLoaderData } from "react-router-dom";
import { Res } from "../lib/requests";
import { Artist } from "../lib/types";
import ArtistList from "../components/lib/ArtistList";

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
