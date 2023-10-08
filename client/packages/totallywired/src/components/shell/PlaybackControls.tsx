import { useEffect, useState } from "react";
import { AudioPlayer, TrackState } from "../../lib/player";
import Progressbar from "../common/Progressbar";
import "./PlaybackControls.css";
import { getRandomTracks } from "../../lib/api";

type PlaybackControlsProps = {
  player: AudioPlayer;
  currentState: TrackState;
};

export default function PlaybackControls({
  player,
  currentState,
}: PlaybackControlsProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!(currentState & TrackState.Playing)) {
      return;
    }

    const i = window.setInterval(() => {
      const prog = player.getProgress();
      const percent = Math.round(Math.min(100, prog * 100) * 2) / 2;
      setProgress(percent);
    }, 500);

    return () => clearInterval(i);
  }, [currentState, player]);

  const handlePlayPause = async () => {
    if (player.getPlaylistCount()) {
      player.playPause();
    } else {
      const res = await getRandomTracks();
      player.addTracks(res.data ?? []);
    }
  };

  return (
    <div id="playback-controls">
      <div className="actions">
        <button className="round md" onClick={() => player.prev()}>
          prev
        </button>
        <button
          className="round lg"
          onClick={handlePlayPause}
          disabled={(currentState & TrackState.Loading) > 0}
        >
          {(currentState & TrackState.Playing) > 0 ? (
            <>Pause</>
          ) : (currentState & TrackState.Paused) > 0 ? (
            <>Play</>
          ) : (currentState & TrackState.Loading) > 0 ? (
            <>Loading</>
          ) : (
            <>Play</>
          )}
          <br />
          {currentState}
        </button>
        <button className="round md" onClick={() => player.next()}>
          next
        </button>
      </div>

      <Progressbar progress={progress} label="Playback progress" />
    </div>
  );
}
