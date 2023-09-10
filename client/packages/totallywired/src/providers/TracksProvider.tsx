import { createContext, useContext, useEffect, useReducer } from "react";
import { commonReducer, createDispatchContext, set } from "../lib/reducer";
import { Track } from "../lib/types";

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

export const syncTracks = (tracks: Tracks) => {
  const dispatch = tracksDisptach();

  useEffect(() => {
    const action = set(tracks);
    dispatch(action);
  }, [dispatch, tracks]);
};

export default function TracksProvider({ children }: React.PropsWithChildren) {
  const [promise, dispatch] = useReducer(Reducer, []);
  return (
    <DispatchContext.Provider value={dispatch}>
      <DataContext.Provider value={promise}>{children}</DataContext.Provider>
    </DispatchContext.Provider>
  );
}
