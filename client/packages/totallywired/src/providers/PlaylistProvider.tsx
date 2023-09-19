import { createContext, useContext, useEffect, useReducer } from "react";
import { commonReducer, createDispatchContext, set } from "../lib/reducer";
import { Playlist } from "../lib/types";
import { getPlaylists } from "../lib/api";

type Playlists = Playlist[];

const PlaylistsContext = createContext<Playlists>([]);
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
  const [playlists, dispatch] = useReducer(Reducer, []);

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
