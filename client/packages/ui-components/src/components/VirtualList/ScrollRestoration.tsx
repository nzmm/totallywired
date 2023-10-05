import React, { useContext } from "react";
import { createContext } from "react";

declare global {
  interface Window {
    __offsetCache__: Record<string, number>;
  }
}

type RestorationContextProps = {
  add: (key: string, offset: number) => void;
  get: (key: string) => number;
  complete: (key: string) => void;
};

window.__offsetCache__ = {};

const INIT_STATE: RestorationContextProps = {
  get: (key: string) => {
    return window.__offsetCache__[key] ?? 0;
  },
  add: (key: string, offset: number) => {
    window.__offsetCache__[key] = offset;
  },
  complete: (key: string) => {
    delete window.__offsetCache__[key];
  },
};

const ScrollRestorationContext =
  createContext<RestorationContextProps>(INIT_STATE);

export const useScrollRestoration = () => useContext(ScrollRestorationContext);

export function ScrollRestorationProvider({
  children,
}: React.PropsWithChildren) {
  return (
    <ScrollRestorationContext.Provider value={INIT_STATE}>
      {children}
    </ScrollRestorationContext.Provider>
  );
}
