import { Suspense } from "react";
import { Await, Outlet, useLoaderData } from "react-router-dom";
import { useAsyncCollections } from "../lib/tracks/hooks";
import MusicCollectionList from "../components/lists/MusicCollectionList";

function AlbumTracksView() {
  const collections = useAsyncCollections();
  return <MusicCollectionList scope="release" collections={collections} />;
}

export default function AlbumTracks() {
  const data = useLoaderData();
  return (
    <>
      <Suspense>
        <Await resolve={data}>
          <AlbumTracksView />
        </Await>
      </Suspense>
      <Outlet />
    </>
  );
}
