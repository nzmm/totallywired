import { createContext, useContext, useEffect, useState } from "react";
import { AudioPlayer, PlayerTrack, PlaylistItem } from "../lib/player";

const Player = new AudioPlayer();
const PlayerContext = createContext(Player);
const QueueContext = createContext<PlaylistItem<PlayerTrack>[]>([]);

export const usePlayer = () => {
  return useContext(PlayerContext);
};

export const useQueue = () => {
  return useContext(QueueContext);
};

export function AudioProvider({ children }: React.PropsWithChildren) {
  const [queue, setQueue] = useState<PlaylistItem<PlayerTrack>[]>([]);

  useEffect(() => {
    const updateHandler = () => {
      const q = Player.getPlaylistItems();
      setQueue(q);
    };

    Player.addEventHandler("tracks-changed", updateHandler);
    Player.addEventHandler("state-change", updateHandler);

    return () => {
      Player.removeEventHandler("tracks-changed", updateHandler);
      Player.removeEventHandler("state-change", updateHandler);
    };
  }, [Player]);

  return (
    <PlayerContext.Provider value={Player}>
      <QueueContext.Provider value={queue}>{children}</QueueContext.Provider>
    </PlayerContext.Provider>
  );
}
