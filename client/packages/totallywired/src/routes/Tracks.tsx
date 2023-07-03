import { Suspense, useEffect, useState } from "react";
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
  const [promise, setPromise] = useState<Promise<TrackDataProps[]> | null>(
    null
  );

  useEffect(() => {
    const req = loader(params, searchParams).then((data) => {
      return data.map((x) => ({
        ...x,
        height: 42,
      }));
    });

    setPromise(req);
  }, [params, searchParams]);

  return (
    <Suspense>
      <Await resolve={promise}>
        <TrackList />
      </Await>
    </Suspense>
  );
}
