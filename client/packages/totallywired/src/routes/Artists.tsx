import { useState, useEffect, Suspense } from "react";
import { useSearchParams, Await } from "react-router-dom";
import { usePlayer } from "../providers/AudioProvider";
import { getValidSearchParams } from "../lib/utils";
import { getArtists } from "../lib/webapi";
import ArtistList, { ArtistDataProps } from "../components/ArtistList";

const loader = (searchParams?: URLSearchParams) => {
  const validSearchParams = getValidSearchParams(searchParams);
  return getArtists(validSearchParams);
};

export default function Artists() {
  const [searchParams] = useSearchParams();
  const player = usePlayer();
  const [promise, setPromise] = useState<Promise<ArtistDataProps[]> | null>(
    null
  );

  useEffect(() => {
    const req = loader(searchParams).then((data) => {
      return data.map((x) => ({
        ...x,
        height: 42,
      }));
    });

    setPromise(req);
  }, [player, searchParams]);

  return (
    <Suspense>
      <Await resolve={promise}>
        <ArtistList />
      </Await>
    </Suspense>
  );
}
