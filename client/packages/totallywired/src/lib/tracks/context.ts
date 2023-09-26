import { createContext } from "react";
import { createDispatchContext, commonReducer } from "../reducer";
import { Track } from "../types";

export const INIT_TRACKS: Track[] = [];
export const TracksContext = createContext<Track[]>(INIT_TRACKS);
export const TracksDispatchContext = createDispatchContext<Track[]>();
export const Reducer = commonReducer<Track[]>();
