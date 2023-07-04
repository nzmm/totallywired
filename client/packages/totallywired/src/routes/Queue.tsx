import { usePlayer, useQueue } from "../providers/AudioProvider";
import Playlist from "../components/Playlist";

export default function Queue() {
  const queue = useQueue();
  const player = usePlayer();
  return <Playlist player={player} items={queue} />;
}
