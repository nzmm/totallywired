import NowPlaying from "./NowPlaying";
import OutputControls from "./OutputControls";
import PlaybackControls from "./PlaybackControls";

export default function Footer() {
  return (
    <footer className="d-flex row">
      <NowPlaying />
      <PlaybackControls />
      <OutputControls />
    </footer>
  );
}
