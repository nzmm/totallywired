import { useEffect, useState } from "react";
import { AudioPlayer, TrackState } from "../lib/player";
import Progressbar from "./Progressbar";

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
  }, [currentState]);

  return (
    <div className="playback-ctrl panel d-flex col">
      <div className="actions d-flex row">
        <button className="round md" onClick={() => player.prev()}>
          prev
        </button>
        <button
          className="round lg"
          onClick={() => player.playPause()}
          disabled={(currentState & TrackState.PlaybackRequested) > 0}
        >
          {(currentState & TrackState.Playing) > 0 ? (
            <>Pause</>
          ) : (currentState & TrackState.Paused) > 0 ? (
            <>Play</>
          ) : (currentState & TrackState.PlaybackRequested) > 0 ? (
            <>Loading</>
          ) : (
            <>?</>
          )}
          {currentState}
        </button>
        <button className="round md" onClick={() => player.next()}>
          next
        </button>
      </div>

      <Progressbar progress={progress} />
    </div>
  );
}
