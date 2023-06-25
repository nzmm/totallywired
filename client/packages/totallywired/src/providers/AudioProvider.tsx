import { createContext, useContext } from "react";
import { Gapless5 } from "@regosen/gapless-5";

// https://github.com/regosen/Gapless-5
const Player = new Gapless5({ loadLimit: 3 });



const PlayerContext = createContext(Player);

export const usePlayer = () => {
  return useContext(PlayerContext);
};

export function AudioProvider({ children }: React.PropsWithChildren) {
  return (
    <PlayerContext.Provider value={Player}>{children}</PlayerContext.Provider>
  );
}
