import { Suspense, useMemo } from "react";
import { Await, useParams, useSearchParams } from "react-router-dom";
import { getTrackByArtist, getTracks, getTracksByAlbum } from "../lib/webapi";
import { getValidSearchParams } from "../lib/utils";
import TrackList, { TrackDataProps } from "../components/TrackList";

const loader = (
  { albumId, artistId }: { albumId?: string; artistId?: string },
  searchParams?: URLSearchParams
) => {
  const validSearchParams = getValidSearchParams(searchParams);
  return albumId
    ? getTracksByAlbum(albumId, validSearchParams)
    : artistId
    ? getTrackByArtist(artistId, validSearchParams)
    : getTracks(validSearchParams);
};

export default function Tracks() {
  const params = useParams();
  const [searchParams] = useSearchParams();

  const promise = useMemo(async () => {
    const { data } = await loader(params, searchParams);
    return data?.map<TrackDataProps>((t) => ({ ...t, height: 42 })) ?? [];
  }, [params, searchParams]);

  return (
    <Suspense>
      <Await resolve={promise}>
        <TrackList />
      </Await>
    </Suspense>
  );
}
