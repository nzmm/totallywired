import { useContext } from "react";
import { UserContext, UserDispatchContext } from "./context";

export const useUser = () => {
  return useContext(UserContext);
};

export const useUserDispatch = () => {
  return useContext(UserDispatchContext);
};
