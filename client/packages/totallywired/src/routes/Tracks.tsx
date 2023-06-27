import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { VirtualList } from "@totallywired/ui-components";
import { Track } from "../lib/types";
import { getTracks } from "../lib/requests";
import { usePlayer } from "../providers/AudioProvider";
import Loading from "../components/Loading";

type TrackItemProps = Track & {
  onPlay(e: React.MouseEvent, track: Track): void;
  onQueue(e: React.MouseEvent, track: Track): void;
};

function TrackItem({ onPlay, onQueue, ...track }: TrackItemProps) {
  return (
    <>
      <button
        className="track num"
        title="Play now"
        onClick={(e) => onPlay(e, track)}
      >
        {`${track.number}.`}
      </button>
      <span className="track name">{`${track.name}`}</span>
      <a className="track album" href="#">{`${track.releaseName}`}</a>
      <a className="track artist" href="#">{`${track.artistName}`}</a>
      <a className="track liked" href="#">{`${track.liked}`}</a>
      <span className="track duration">{`${track.displayLength}`}</span>
    </>
  );
}

export default function Tracks() {
  const player = usePlayer();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const handlePlay = async (_: React.MouseEvent, track: Track) => {
      player.addTrack(track);
    };

    const handleQueue = (_: React.MouseEvent, __: Track) => {};

    getTracks().then((data) => {
      const tracks: TrackItemProps[] = data.map((x) => ({
        ...x,
        height: 42,
        onPlay: handlePlay,
        onQueue: handleQueue,
      }));
      setTracks(tracks);
      setLoading(false);
    });
  }, [player]);

  return loading ? (
    <Loading />
  ) : tracks.length ? (
    <VirtualList items={tracks} renderer={TrackItem} />
  ) : (
    <section>
      <p>You have no tracks in your library.</p>
      <p>
        Get started by setting up a{" "}
        <Link to="/lib/providers">content provider</Link>.
      </p>
    </section>
  );
}
