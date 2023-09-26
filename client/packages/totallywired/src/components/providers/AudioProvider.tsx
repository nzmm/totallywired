import { useEffect, useState } from "react";
import { PlayerTrack } from "../../lib/player";
import {
  INIT_QUEUE,
  Player,
  PlayerContext,
  QueueContext,
} from "../../lib/player/context";
import { PlaylistItem } from "../../lib/playlist";

export default function AudioProvider({ children }: React.PropsWithChildren) {
  const [queue, setQueue] = useState<PlaylistItem<PlayerTrack>[]>(INIT_QUEUE);

  useEffect(() => {
    const updateHandler = () => {
      const items = Player.getPlaylistItems();
      setQueue(items);
    };

    Player.addEventHandler("tracks-changed", updateHandler);
    Player.addEventHandler("state-change", updateHandler);

    return () => {
      Player.removeEventHandler("tracks-changed", updateHandler);
      Player.removeEventHandler("state-change", updateHandler);
    };
  }, []);

  return (
    <PlayerContext.Provider value={Player}>
      <QueueContext.Provider value={queue}>{children}</QueueContext.Provider>
    </PlayerContext.Provider>
  );
}
