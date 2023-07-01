import { Suspense, useEffect, useState } from "react";
import { Await, useParams, useSearchParams } from "react-router-dom";
import { getTrackByArtist, getTracks, getTracksByAlbum } from "../lib/webapi";
import { usePlayer } from "../providers/AudioProvider";
import { Track } from "../lib/types";
import { getValidSearchParams } from "../lib/utils";
import TrackList, { TrackItemProps } from "../components/TrackList";

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
  const [searchParams] = useSearchParams();
  const params = useParams();
  const player = usePlayer();
  const [promise, setPromise] = useState<Promise<TrackItemProps[]> | null>(
    null
  );

  useEffect(() => {
    const req = loader(params, searchParams).then((data) => {
      const onAction = (_: React.MouseEvent, action: string, track: Track) => {
        switch (action) {
          case "play": {
            player.addTrack(track);
            break;
          }
        }
      };

      return data.map<TrackItemProps>((x) => ({
        ...x,
        height: 42,
        onAction,
      }));
    });

    setPromise(req);
  }, [player, params, searchParams]);

  return (
    <Suspense>
      <Await resolve={promise}>
        <TrackList />
      </Await>
    </Suspense>
  );
}
