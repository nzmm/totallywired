import { useReducer } from "react";
import {
  Reducer,
  INIT_TRACKS,
  TracksDispatchContext,
  TracksContext,
  CollectionReducer,
  INIT_COLLECTION,
  CollectionDispatchContext,
  CollectionContext,
} from "../../lib/tracks/context";

export default function TracksProvider({ children }: React.PropsWithChildren) {
  const [tracks, dispatch] = useReducer(Reducer, INIT_TRACKS);
  return (
    <TracksDispatchContext.Provider value={dispatch}>
      <TracksContext.Provider value={tracks}>{children}</TracksContext.Provider>
    </TracksDispatchContext.Provider>
  );
}

export function CollectionProvider({ children }: React.PropsWithChildren) {
  const [collection, dispatch] = useReducer(CollectionReducer, INIT_COLLECTION);
  return (
    <CollectionDispatchContext.Provider value={dispatch}>
      <CollectionContext.Provider value={collection}>
        {children}
      </CollectionContext.Provider>
    </CollectionDispatchContext.Provider>
  );
}
