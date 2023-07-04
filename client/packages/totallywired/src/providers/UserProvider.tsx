import { createContext, useContext, useReducer } from "react";
import { User } from "../lib/types";
import { commonReducer, createDispatchContext } from "../lib/reducer";

const DataContext = createContext<User | null>(null);
const DispatchContext = createDispatchContext<User | null>();

export const useUser = () => {
  return useContext(DataContext);
};

export const userDispatch = () => {
  return useContext(DispatchContext);
};

const reducer = commonReducer<User | null>();

export function UserProvider({ children }: React.PropsWithChildren) {
  const [user, dispatch] = useReducer(reducer, null);
  return (
    <DispatchContext.Provider value={dispatch}>
      <DataContext.Provider value={user}>{children}</DataContext.Provider>
    </DispatchContext.Provider>
  );
}
