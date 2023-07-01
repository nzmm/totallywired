import { Suspense, useMemo } from "react";
import { Await, Link, useParams, useSearchParams } from "react-router-dom";
import { VirtualList } from "@totallywired/ui-components";
import { getTracks, getTracksByAlbum } from "../lib/requests";
import { usePlayer } from "../providers/AudioProvider";
import { Track } from "../lib/types";
import TrackItem, { TrackItemProps } from "../components/TrackItem";

function TrackList({ tracks }: { tracks: TrackItemProps[] }) {
  return (
    tracks.length ? (
      <VirtualList items={tracks} renderer={TrackItem} />
    ) : (
      <section>
        <p>You have no tracks in your library.</p>
        <p>
          Get started by setting up a{" "}
          <Link to="/lib/providers">content provider</Link>.
        </p>
      </section>
    )
  );
}

export default function Tracks() {
  const [searchParams,] = useSearchParams();
  const params = useParams();
  const player = usePlayer();

  const promise = useMemo(async () => {
    const data = await (params.albumId ? getTracksByAlbum(params.albumId, searchParams) : getTracks(searchParams));

    const onAction = async (_: React.MouseEvent, action: string, track: Track) => {
      switch(action) {
        case "play": {
          player.addTrack(track);
          break;
        }
      }
    };
  
    return data.map<TrackItemProps>((x) => ({
      ...x,
      height: 42,
      onAction
    }));
  }, [player, params]);

  return (
    <Suspense>
      <Await resolve={promise} children={tracks => (
        <TrackList tracks={tracks} />
      )} />
    </Suspense>
  );
}
