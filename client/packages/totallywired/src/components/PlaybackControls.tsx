import { useEffect, useState } from "react";
import { usePlayer } from "../providers/AudioProvider";
import { TrackState } from "../lib/player";

export default function PlaybackControls() {
  const player = usePlayer();
  const [progress, setProgress] = useState<string>("0");
  const [playbackState, setPlaybackState] = useState<TrackState>(
    TrackState.Unknown
  );

  useEffect(() => {
    let i = 0;

    const stateChangeHandler = () => {
      const currentState = player.getCurrentState();
      if (!currentState) {
        return;
      }

      setPlaybackState(currentState.state);

      if (currentState.state & TrackState.Playing) {
        i = window.setInterval(() => {
          const prog = player.getProgress();
          setProgress(`${Math.min(100, prog * 100)}%`);
        }, 500);
      } else {
        clearInterval(i);
      }
    };

    player.addEventHandler("state-change", stateChangeHandler);

    return () => {
      clearInterval(i);
      player.removeEventHandler("state-change", stateChangeHandler);
    };
  }, [player]);

  return (
    <div className="playback-ctrl panel d-flex col">
      <div className="actions d-flex row">
        <button className="round md" onClick={() => player.prev()}>
          prev
        </button>
        <button className="round lg" onClick={() => player.playPause()}>
          {(playbackState & TrackState.Playing) > 0 ? (
            <>Pause</>
          ) : (
            <>Play</>
          )}
        </button>
        <button className="round md" onClick={() => player.next()}>
          next
        </button>
      </div>

      <div className="progressbar">
        <div className="progress" style={{ width: progress }}></div>
      </div>
    </div>
  );
}
