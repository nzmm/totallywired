import { usePlayer, useQueue } from "../providers/AudioProvider";
import Playlist from "../components/Playlist";
import PlaylistHeader from "../components/PlaylistHeader";

export default function Queue() {
  const queue = useQueue();
  const player = usePlayer();
  return (
  <>
    <PlaylistHeader queue={queue} />
    <Playlist player={player} items={queue} />
  </>)
}
