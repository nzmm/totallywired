import React, { useContext } from "react";
import { createContext } from "react";

type RestorationContextProps = {
  add: (key: string, offset: number) => void;
  get: (key: string) => number;
  complete: (key: string) => void;
};

const NOOP_STORE: RestorationContextProps = {
  get: (key: string) => 0,
  add: () => null,
  complete: (key: string) => null,
};

const getKey = (key: string) => `tw:scrollY:${key}`;

const SESSION_STORE: RestorationContextProps = {
  get: (key: string) => {
    const val = window.sessionStorage.getItem(getKey(key));
    return val ? parseInt(val) : 0;
  },
  add: (key: string, offset: number) => {
    window.sessionStorage.setItem(getKey(key), offset.toString());
  },
  complete: (key: string) => {
    window.sessionStorage.removeItem(getKey(key));
  },
};

const ScrollRestorationContext =
  createContext<RestorationContextProps>(NOOP_STORE);

export const useScrollRestoration = () => useContext(ScrollRestorationContext);

export function ScrollRestorationProvider({
  children,
}: React.PropsWithChildren) {
  return (
    <ScrollRestorationContext.Provider value={SESSION_STORE}>
      {children}
    </ScrollRestorationContext.Provider>
  );
}
