import { createContext } from "react";
import { commonReducer, createDispatchContext } from "../reducer";
import { User } from "../types";

export const INIT_USER = null;
export const UserContext = createContext<User | null>(INIT_USER);
export const UserDispatchContext = createDispatchContext<User | null>();
export const Reducer = commonReducer<User | null>();
