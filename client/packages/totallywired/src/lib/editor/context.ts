import { createContext } from "react";
import { createDispatchContext, commonReducer } from "../reducer";
import { EditorContextState } from "./types";

export const INIT_EDITOR: EditorContextState = {
  loading: false,
  proposal: undefined,
  candidateTracks: [],
  artCollection: {},
};

export const EditorContext = createContext<EditorContextState>(INIT_EDITOR);
export const EditorDispatchContext =
  createDispatchContext<EditorContextState>();
export const Reducer = commonReducer<EditorContextState>();
