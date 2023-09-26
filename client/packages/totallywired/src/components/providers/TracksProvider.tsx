import { useReducer } from "react";
import {
  Reducer,
  INIT_TRACKS,
  TracksDispatchContext,
  TracksContext,
} from "../../lib/tracks/context";

export default function TracksProvider({ children }: React.PropsWithChildren) {
  const [tracks, dispatch] = useReducer(Reducer, INIT_TRACKS);
  return (
    <TracksDispatchContext.Provider value={dispatch}>
      <TracksContext.Provider value={tracks}>{children}</TracksContext.Provider>
    </TracksDispatchContext.Provider>
  );
}
