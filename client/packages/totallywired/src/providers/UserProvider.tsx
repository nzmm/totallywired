import { createContext, useContext, useReducer } from "react";
import { commonReducer, createDispatchContext } from "../lib/reducer";
import { User } from "../lib/types";

const UserContext = createContext<User | null>(null);
const UserDispatchContext = createDispatchContext<User | null>();
const Reducer = commonReducer<User | null>();

export const useUser = () => {
  return useContext(UserContext);
};

export const userDispatch = () => {
  return useContext(UserDispatchContext);
};

export function UserProvider({ children }: React.PropsWithChildren) {
  const [user, dispatch] = useReducer(Reducer, null);
  return (
    <UserDispatchContext.Provider value={dispatch}>
      <UserContext.Provider value={user}>{children}</UserContext.Provider>
    </UserDispatchContext.Provider>
  );
}
