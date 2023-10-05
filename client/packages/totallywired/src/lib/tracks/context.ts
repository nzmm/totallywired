import { createContext } from "react";
import { createDispatchContext, commonReducer } from "../reducer";
import { Track } from "../types";

type MusicCollection = {
  collection: Record<string, Track[]>;
};

export const INIT_COLLECTION: MusicCollection = {
  collection: {},
};

export const CollectionContext =
  createContext<MusicCollection>(INIT_COLLECTION);
export const CollectionDispatchContext =
  createDispatchContext<MusicCollection>();
export const CollectionReducer = commonReducer<MusicCollection>();
