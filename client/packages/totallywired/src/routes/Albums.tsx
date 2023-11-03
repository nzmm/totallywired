import { Suspense } from "react";
import { Await, useAsyncValue, useLoaderData } from "react-router-dom";
import { Res } from "../lib/requests";
import { Album } from "../lib/types";
import AlbumList from "../components/views/library/AlbumList";

function AlbumsView() {
  const { data: albums = [] } = useAsyncValue() as Res<Album[]>;
  return <AlbumList albums={albums} />;
}

export default function Albums() {
  const data = useLoaderData();
  return (
    <Suspense>
      <Await resolve={data}>
        <AlbumsView />
      </Await>
    </Suspense>
  );
}
