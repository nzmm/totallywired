import { useEffect, useState } from "react";
import { PlaybackState, TrackState } from "../lib/player";
import { usePlayer } from "../providers/AudioProvider";
import NowPlaying from "./NowPlaying";
import OutputControls from "./OutputControls";
import PlaybackControls from "./PlaybackControls";
import { Track } from "../lib/types";

export default function Footer() {
  const player = usePlayer();
  const [currentState, setCurrentState] = useState<TrackState>(
    TrackState.Unknown
  );
  const [currentTrack, setCurrentTrack] = useState<Track | undefined>(
    undefined
  );

  useEffect(() => {
    const stateChangeHandler = (_: string, { state, track }: PlaybackState) => {
      setCurrentState(state);
      setCurrentTrack(track);
    };

    player.addEventHandler("current-state-change", stateChangeHandler);
    return () => {
      player.removeEventHandler("current-state-change", stateChangeHandler);
    };
  }, [player]);

  return (
    <footer className="d-flex row">
      <NowPlaying currentTrack={currentTrack} />

      <PlaybackControls player={player} currentState={currentState} />

      <OutputControls />
    </footer>
  );
}
