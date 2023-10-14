import { Suspense } from "react";
import { Await, useLoaderData } from "react-router-dom";
import { useAsyncCollections } from "../lib/tracks/hooks";
import MusicCollectionList from "../components/lib/MusicCollectionList";

function MusicCollectionView() {
  const collections = useAsyncCollections();
  return <MusicCollectionList collections={collections} />;
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
