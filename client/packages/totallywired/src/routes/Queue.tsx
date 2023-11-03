import { usePlayer, useQueue } from "../lib/player/hooks";
import PlaylistHeader from "../components/views/library/PlaylistHeader";
import Playlist from "../components/views/library/Playlist";

export default function Queue() {
  const queue = useQueue();
  const player = usePlayer();
  return (
    <>
      <PlaylistHeader player={player} queue={queue} />
      <Playlist player={player} items={queue} />
    </>
  );
}
