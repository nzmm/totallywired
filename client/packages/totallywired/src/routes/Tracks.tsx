import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { VirtualList } from "@totallywired/ui-components";
import { Track } from "../lib/types";
import { getTracks } from "../lib/requests";
import { usePlayer } from "../providers/AudioProvider";
import Loading from "../components/Loading";

type TrackItemProps = Track & {
  onPlay(e: React.MouseEvent): void;
  onQueue(e: React.MouseEvent): void;
};

function PlayButton({
  number,
  className,
  onClick,
}: {
  number: string;
  className: string;
  onClick(e: React.MouseEvent): void;
}) {
  return (
    <button
      className={className}
      title="Play now"
      onClick={onClick}
    >{`${number}.`}</button>
  );
}

function TrackItem(track: TrackItemProps) {
  return (
    <>
      <PlayButton
        number={track.number}
        className="track num"
        onClick={track.onPlay}
      />
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
    getTracks().then((data) => {
      const tracks = data.map((x) => ({ ...x, height: 42 }));
      setTracks(tracks);
      setLoading(false);
    });
  }, []);

  const WiredTrackItem = useMemo(() => {
    const handlePlay = async (_: React.MouseEvent, track: Track) => {
      player.addTrack(track);
    };

    const handleQueue = (_: React.MouseEvent) => {};

    return (track: Track) => {
      return <TrackItem {...track} onPlay={e => handlePlay(e, track)} onQueue={handleQueue} />;
    };
  }, [player]);

  return loading ? (
    <Loading />
  ) : tracks.length ? (
    <VirtualList items={tracks} renderer={WiredTrackItem} />
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
