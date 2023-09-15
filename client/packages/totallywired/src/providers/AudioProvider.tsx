import { createContext, useContext, useEffect, useState } from "react";
import { AudioPlayer, PlayerTrack, PlaylistItem, IS_QUEUED } from "../lib/player";

const INIT_QUEUE: PlaylistItem<PlayerTrack>[] = [];

const Player = new AudioPlayer();
const PlayerContext = createContext(Player);
const QueueContext = createContext<PlaylistItem<PlayerTrack>[]>([]);

export const usePlayer = () => {
  return useContext(PlayerContext);
};

export const useQueue = () => {
  return useContext(QueueContext);
};

export const useAwaitingQueue = () => {
  return useContext(QueueContext).filter(qi => qi.state & IS_QUEUED);
};

export function AudioProvider({ children }: React.PropsWithChildren) {
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
  }, [Player]);

  return (
    <PlayerContext.Provider value={Player}>
      <QueueContext.Provider value={queue}>{children}</QueueContext.Provider>
    </PlayerContext.Provider>
  );
}
