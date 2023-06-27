import { usePlayer } from "../providers/AudioProvider";

export default function PlaybackControls() {
  const player = usePlayer();
  return (
    <div className="playback-ctrl panel d-flex col">
      <div className="actions d-flex row">
        <button className="round md" onClick={() => player.prev()}>prev</button>
        <button className="round lg" onClick={() => player.playPause()}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 24">
            <path fill="currentColor" d="M1 1 L25 12 L1 23Z" />
          </svg>
        </button>
        <button className="round md" onClick={() => player.next()}>next</button>
      </div>

      <div className="progressbar">
        <div className="progress"></div>
      </div>
    </div>
  );
}
