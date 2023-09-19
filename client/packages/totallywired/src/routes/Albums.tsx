import { Suspense } from "react";
import {
  Await,
  LoaderFunctionArgs,
  useAsyncValue,
  useLoaderData,
} from "react-router-dom";
import { getAlbums } from "../lib/api";
import { Res, requestSearchParams } from "../lib/requests";
import { Album } from "../lib/types";
import AlbumList from "../components/lists/AlbumList";

export function albumsLoader({ request }: LoaderFunctionArgs) {
  const searchParams = requestSearchParams(request);
  return getAlbums(searchParams);
}

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
