import { createContext, useContext, useEffect, useState } from "react";
import { AudioPlayer, QueuedTrack } from "../lib/player";

const Player = new AudioPlayer();
const PlayerContext = createContext(Player);
const QueueContext = createContext<QueuedTrack[]>([]);

export const usePlayer = () => {
  return useContext(PlayerContext);
};

export const useQueue = () => {
  return useContext(QueueContext);
};

export function AudioProvider({ children }: React.PropsWithChildren) {
  const [queue, setQueue] = useState<QueuedTrack[]>([]);

  useEffect(() => {
    const updateHandler = () => {
      const q = Player.getQueue();
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
