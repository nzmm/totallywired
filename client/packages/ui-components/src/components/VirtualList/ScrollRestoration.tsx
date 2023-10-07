import React, { useContext, createContext } from "react";
import {
  NOOP_STORE,
  SESSION_STORE,
  ScrollRestoration,
} from "./ScrollRestoration.library";

type ScrollRestorationProviderProps = React.PropsWithChildren & {
  getKey?: () => string;
};

const ScrollRestorationContext = createContext<ScrollRestoration>(NOOP_STORE);

export const useScrollRestoration = () => useContext(ScrollRestorationContext);

export function ScrollRestorationProvider({
  children,
}: ScrollRestorationProviderProps) {
  return (
    <ScrollRestorationContext.Provider value={SESSION_STORE}>
      {children}
    </ScrollRestorationContext.Provider>
  );
}

export { ScrollRestoration };
