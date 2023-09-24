import { createContext, useContext, useReducer } from "react";
import { commonReducer, createDispatchContext } from "../lib/reducer";
import { Track } from "../lib/types";

type Tracks = Track[];

const INITIAL_STATE: Tracks = [];

const TracksContext = createContext<Tracks>(INITIAL_STATE);
const TracksDispatchContext = createDispatchContext<Tracks>();
const Reducer = commonReducer<Tracks>();

export const useTracks = () => {
  return useContext(TracksContext);
};

export const tracksDisptach = () => {
  return useContext(TracksDispatchContext);
};

export default function TracksProvider({ children }: React.PropsWithChildren) {
  const [tracks, dispatch] = useReducer(Reducer, INITIAL_STATE);
  return (
    <TracksDispatchContext.Provider value={dispatch}>
      <TracksContext.Provider value={tracks}>{children}</TracksContext.Provider>
    </TracksDispatchContext.Provider>
  );
}
