import { Reducer, createContext, useContext, useReducer } from "react";
import { User } from "../lib/types";

type UserActions =
  | { type: "update"; object: User }
  | { type: "set"; object: User };

type UserReducer = Reducer<User, UserActions>;

const INITIAL_USER: User = {
  userId: "",
  username: "",
  name: "",
  isAuthenticated: false,
};

const UserContext = createContext(INITIAL_USER);
const UserDispatchContext = createContext<React.Dispatch<UserActions> | null>(
  null
);

const userReducer: UserReducer = (user, action) => {
  switch (action.type) {
    case "update": {
      return { ...(user ?? {}), ...action.object };
    }
    case "set": {
      return action.object;
    }
    default: {
      throw Error("Unknown action");
    }
  }
};

export const useUser = () => {
  return useContext(UserContext);
};

export const userDispatch = () => {
  return useContext(UserDispatchContext);
};

export function UserProvider({ children }: React.PropsWithChildren) {
  const [user, userDispatch] = useReducer(userReducer, INITIAL_USER);
  return (
    <UserContext.Provider value={user}>
      <UserDispatchContext.Provider value={userDispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  );
}
