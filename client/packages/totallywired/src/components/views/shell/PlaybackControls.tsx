import { useEffect, useRef, useState } from "react";
import { AudioPlayer, TrackState } from "../../../lib/player";
import Progressbar from "../../common/Progressbar";
import { getRandomTracks } from "../../../lib/api/v1";
import {
  PauseIcon,
  PlayIcon,
  TrackNextIcon,
  TrackPreviousIcon,
  UpdateIcon,
} from "@radix-ui/react-icons";
import { Track } from "../../../lib/types";
import { displayLength } from "../../../lib/utils";
import "./PlaybackControls.css";

type PlaybackControlsProps = {
  player: AudioPlayer;
  currentTrack: Track;
  currentState: TrackState;
};

function TimeRemaining({ length, progress }: { length?: number; progress: number; }) {
  if (length == null) {
    return null;
  }

  const timeRemaining = length - (length * progress);
  return (
    <span>-{displayLength(timeRemaining)}</span>
  )
}

function TrackProgress({ player, currentTrack, currentState }: PlaybackControlsProps) {
  const interval = useRef(0);
  const [progress, setProgress] = useState(player.getProgress());

  useEffect(() => {
    if (!(currentState & TrackState.Playing)) {
      return;
    }

    interval.current = window.setInterval(() => {
      const percent = player.getProgress();
      setProgress(percent);
    }, 500);

    return () => clearInterval(interval.current);
  }, [currentState, player]);

  return (
    <div className="track-progress">
      <TimeRemaining length={currentTrack?.length} progress={progress} />
      <Progressbar progress={progress * 100} label="Playback progress" />
      <span>{currentTrack?.displayLength ?? ""}</span>
    </div>
  );
}

export default function PlaybackControls({
  player,
  currentTrack,
  currentState,
}: PlaybackControlsProps) {
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

      <TrackProgress player={player} currentTrack={currentTrack} currentState={currentState} />
    </div>
  );
}
