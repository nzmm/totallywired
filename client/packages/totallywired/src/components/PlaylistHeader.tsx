import { useMemo } from "react";
import { PlaylistItem } from "../lib/playlist";
import { AudioPlayer, PlayerTrack, TrackState } from "../lib/player";
import { duration } from "../lib/utils";
import './PlaylistHeader.css';

type PlaylistHeaderProps = {
  player: AudioPlayer;
  queue: PlaylistItem<PlayerTrack>[];
}

export default function PlaylistHeader({ player, queue }: PlaylistHeaderProps) {

  const [d, l] = useMemo(() => {
    const [ms, l] = queue.reduce(([ms, l], cur) => {
      if (cur.state & TrackState.Finished) {
        return [ms, l];
      }
      return [ms + cur.track.length, l + 1];
    }, [0, 0]);
    
    return [duration(ms), l];
  }, [queue]);

  return (
    <div className="playlist-header">
      Remaining tracks: {l} &middot; {d}
      <button onClick={() => player.removeAll()} disabled={!l}>Clear Playlist</button>
    </div>
  )
}