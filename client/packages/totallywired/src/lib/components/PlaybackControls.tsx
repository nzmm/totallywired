export default function PlaybackControls() {
  return (
    <div className="playback-ctrl panel">
      <div>
        <button>prev</button>
        <button>play / pause</button>
        <button>next</button>
      </div>

      <div className="progressbar">
        <div className="progress"></div>
      </div>
    </div>
  );
}
