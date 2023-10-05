import { useReducer } from "react";
import {
  CollectionReducer,
  INIT_COLLECTION,
  CollectionDispatchContext,
  CollectionContext,
} from "../../lib/tracks/context";

export default function CollectionProvider({
  children,
}: React.PropsWithChildren) {
  const [collection, dispatch] = useReducer(CollectionReducer, INIT_COLLECTION);
  return (
    <CollectionDispatchContext.Provider value={dispatch}>
      <CollectionContext.Provider value={collection}>
        {children}
      </CollectionContext.Provider>
    </CollectionDispatchContext.Provider>
  );
}
