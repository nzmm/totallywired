import NowPlaying from "./NowPlaying";
import OutputControls from "./OutputControls";
import PlaybackControls from "./PlaybackControls";

export default function Footer() {
  return (
    <footer>
      <NowPlaying />
      <PlaybackControls />
      <OutputControls />
    </footer>
  );
}
