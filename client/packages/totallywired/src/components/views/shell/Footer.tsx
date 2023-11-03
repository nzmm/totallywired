import { useCurrentTrackState, usePlayer } from "../../../lib/player/hooks";
import OutputControls from "./OutputControls";
import PlaybackControls from "./PlaybackControls";
import NowPlaying from "./NowPlaying";
import "./Footer.css";

export default function Footer() {
  const player = usePlayer();
  const [track, state] = useCurrentTrackState(player);

  return (
    <footer>
      <div>
        <NowPlaying currentTrack={track} />
      </div>

      <div>
        <PlaybackControls player={player} currentState={state} />
      </div>

      <div>
        <OutputControls player={player} />
      </div>
    </footer>
  );
}
