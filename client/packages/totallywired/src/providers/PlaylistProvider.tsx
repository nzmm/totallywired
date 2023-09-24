import { createContext, useContext, useEffect, useReducer } from "react";
import { commonReducer, createDispatchContext, set } from "../lib/reducer";
import { Playlist } from "../lib/types";
import { getPlaylists } from "../lib/api";

type Playlists = Playlist[];

const INITIAL_STATE: Playlist[] = [];

const PlaylistsContext = createContext<Playlists>(INITIAL_STATE);
const PlaylistsDispatchContext = createDispatchContext<Playlists>();
const Reducer = commonReducer<Playlists>();

export const usePlaylists = () => {
  return useContext(PlaylistsContext);
};

export const playlistsDispatch = () => {
  return useContext(PlaylistsDispatchContext);
};

export default function PlaylistsProvider({
  children,
}: React.PropsWithChildren) {
  const [playlists, dispatch] = useReducer(Reducer, INITIAL_STATE);

  useEffect(() => {
    getPlaylists().then((res) => {
      if (res.data) {
        dispatch(set(res.data));
      }
    });
  }, [dispatch]);

  return (
    <PlaylistsDispatchContext.Provider value={dispatch}>
      <PlaylistsContext.Provider value={playlists}>
        {children}
      </PlaylistsContext.Provider>
    </PlaylistsDispatchContext.Provider>
  );
}
