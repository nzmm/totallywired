import { createContext, useContext, useReducer } from "react";
import { Track } from "../lib/types";
import { commonReducer, createDispatchContext } from "../lib/reducer";

type Tracks = Track[];

const DataContext = createContext<Tracks>([]);
const DispatchContext = createDispatchContext<Tracks>();
const Reducer = commonReducer<Tracks>();

export const useTracks = () => {
  return useContext(DataContext);
};

export const tracksDisptach = () => {
  return useContext(DispatchContext);
};

export function TracksProvider({ children }: React.PropsWithChildren) {
  const [promise, dispatch] = useReducer(Reducer, []);
  return (
    <DispatchContext.Provider value={dispatch}>
      <DataContext.Provider value={promise}>{children}</DataContext.Provider>
    </DispatchContext.Provider>
  );
}
