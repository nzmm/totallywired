import { Suspense, useMemo } from "react";
import { useSearchParams, useParams, Await } from "react-router-dom";
import { usePlayer } from "../providers/AudioProvider";
import { getValidSearchParams } from "../lib/utils";
import { getAlbums, getAlbumsByArtist } from "../lib/webapi";
import AlbumList, { AlbumDataProps } from "../components/AlbumList";

const loader = (
  { artistId }: { artistId?: string },
  searchParams?: URLSearchParams
) => {
  const validSearchParams = getValidSearchParams(searchParams);
  return artistId
    ? getAlbumsByArtist(artistId, validSearchParams)
    : getAlbums(validSearchParams);
};

export default function Albums() {
  const [searchParams] = useSearchParams();
  const params = useParams();
  const player = usePlayer();

  const promise = useMemo<Promise<AlbumDataProps[]>>(async () => {
    const { data } = await loader(params, searchParams);

    return (
      data?.map((x) => ({
        ...x,
        height: 42,
      })) ?? []
    );
  }, [player, params, searchParams]);

  return (
    <Suspense>
      <Await resolve={promise}>
        <AlbumList />
      </Await>
    </Suspense>
  );
}
