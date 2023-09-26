import { usePlayer, useQueue } from "../lib/player/hooks";
import PlaylistHeader from "../components/lists/PlaylistHeader";
import Playlist from "../components/lists/Playlist";

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
