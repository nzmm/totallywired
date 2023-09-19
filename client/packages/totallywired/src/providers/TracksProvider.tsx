import { createContext, useContext, useReducer } from "react";
import { commonReducer, createDispatchContext } from "../lib/reducer";
import { Track } from "../lib/types";

type Tracks = Track[];

const TracksContext = createContext<Tracks>([]);
const TracksDispatchContext = createDispatchContext<Tracks>();
const Reducer = commonReducer<Tracks>();

export const useTracks = () => {
  return useContext(TracksContext);
};

export const tracksDisptach = () => {
  return useContext(TracksDispatchContext);
};

export default function TracksProvider({ children }: React.PropsWithChildren) {
  const [tracks, dispatch] = useReducer(Reducer, []);
  return (
    <TracksDispatchContext.Provider value={dispatch}>
      <TracksContext.Provider value={tracks}>{children}</TracksContext.Provider>
    </TracksDispatchContext.Provider>
  );
}
