import { useMemo } from "react";
import { AudioPlayer } from "../../lib/player";
import { duration, shuffle } from "../../lib/utils";
import { Track } from "../../lib/types";
import "./TrackListHeader.css";

type TrackListHeaderProps = {
  player: AudioPlayer;
  tracks: Track[];
};

export default function TrackListHeader({
  player,
  tracks,
}: TrackListHeaderProps) {
  const [d, l] = useMemo(() => {
    const [ms, l] = tracks.reduce(
      ([ms, l], cur) => {
        return [ms + cur.length, l + 1];
      },
      [0, 0],
    );
    return [duration(ms), l];
  }, [tracks]);

  return (
    <div className="tracklist-header">
      {l} tracks, {d}
      <div className="actions">
        <button onClick={() => player.addTracks(tracks)} disabled={!l}>
          Play all
        </button>
        <button onClick={() => player.addTracks(shuffle(tracks))} disabled={!l}>
          Shuffle all
        </button>
      </div>
    </div>
  );
}
