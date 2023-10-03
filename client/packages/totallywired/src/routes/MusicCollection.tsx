import { Suspense } from "react";
import { Await, useLoaderData } from "react-router-dom";
import { useAsyncCollection } from "../lib/tracks/hooks";
import MusicCollectionList from "../components/lists/MusicCollectionList";

function MusicCollectionView() {
  const collection = useAsyncCollection();
  return <MusicCollectionList collection={collection} />;
}

export default function MusicCollection() {
  const data = useLoaderData();

  return (
    <Suspense>
      <Await resolve={data}>
        <MusicCollectionView />
      </Await>
    </Suspense>
  );
}
