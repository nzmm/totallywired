import { useEffect, useState } from "react";
import { AudioPlayer, TrackState } from "../../lib/player";
import Progressbar from "../common/Progressbar";
import "./PlaybackControls.css";
import { getRandomTracks } from "../../lib/api/v1";
import {
  PauseIcon,
  PlayIcon,
  TrackNextIcon,
  TrackPreviousIcon,
  UpdateIcon,
} from "@radix-ui/react-icons";

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
          <TrackPreviousIcon />
        </button>

        <button
          id="play-pause"
          className="round lg"
          onClick={handlePlayPause}
          disabled={(currentState & TrackState.Loading) > 0}
        >
          {(currentState & TrackState.Playing) > 0 ? (
            <PauseIcon />
          ) : (currentState & TrackState.Paused) > 0 ? (
            <PlayIcon />
          ) : (currentState & TrackState.Loading) > 0 ? (
            <UpdateIcon />
          ) : (
            <PlayIcon />
          )}
        </button>

        <button className="round md" onClick={() => player.next()}>
          <TrackNextIcon />
        </button>
      </div>

      <Progressbar progress={progress} label="Playback progress" />
    </div>
  );
}
