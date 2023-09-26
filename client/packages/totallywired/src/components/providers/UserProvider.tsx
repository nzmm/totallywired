import { useReducer } from "react";
import { Reducer } from "../../lib/users/context";
import {
  INIT_USER,
  UserDispatchContext,
  UserContext,
} from "../../lib/users/context";

export default function UserProvider({ children }: React.PropsWithChildren) {
  const [user, dispatch] = useReducer(Reducer, INIT_USER);
  return (
    <UserDispatchContext.Provider value={dispatch}>
      <UserContext.Provider value={user}>{children}</UserContext.Provider>
    </UserDispatchContext.Provider>
  );
}
