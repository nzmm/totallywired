import { usePlayer, useQueue } from "../lib/player/hooks";
import PlaylistHeader from "../components/library/PlaylistHeader";
import Playlist from "../components/library/Playlist";

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
