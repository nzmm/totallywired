import { useEffect, useState } from "react";
import { AudioPlayer, TrackState } from "../lib/player";
import { getTracks } from "../lib/webapi";
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

  const handlePlayPause = async () => {
    if (player.getQueueLength()) {
      player.playPause();
    } else {
      // todo
      const searchParams = new URLSearchParams({ q: "mint chicks" });
      const data = await getTracks(searchParams);
      player.addTracks(data.slice(0, 20), true);
    }
  };

  return (
    <div className="playback-ctrl panel d-flex col">
      <div className="actions d-flex row">
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

      <Progressbar progress={progress} />
    </div>
  );
}
