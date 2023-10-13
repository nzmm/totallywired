import { useEffect, useReducer } from "react";
import { getPlaylists } from "../../lib/api/v1";
import {
  INIT_PLAYLISTS,
  PlaylistsDispatchContext,
  PlaylistsContext,
} from "../../lib/player/context";
import { set } from "../../lib/reducer";
import { Reducer } from "../../lib/player/context";

export default function PlaylistsProvider({
  children,
}: React.PropsWithChildren) {
  const [playlists, dispatch] = useReducer(Reducer, INIT_PLAYLISTS);

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
