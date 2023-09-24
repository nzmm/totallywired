import { createContext, useContext, useEffect, useReducer } from "react";
import { commonReducer, createDispatchContext } from "../lib/reducer";
import { EditorContextState } from "../lib/editor/types";
import { getAlbum, getTracksByAlbum } from "../lib/api";
import { setCurrentRelease, setLoading } from "../lib/editor/actions";

type EditorProviderProps = React.PropsWithChildren & {
  releaseId: string;
};

const INITIAL_STATE: EditorContextState = {
  loading: false,
  current: undefined,
  proposal: undefined,
  candidateTracks: [],
  artCollection: {},
};

const EditorContext = createContext<EditorContextState>(INITIAL_STATE);
const EditorDispatchContext = createDispatchContext<EditorContextState>();
const Reducer = commonReducer<EditorContextState>();

export const useEditor = () => {
  return useContext(EditorContext);
};

export const editorDisptach = () => {
  return useContext(EditorDispatchContext);
};

export default function EditorProvider({
  releaseId,
  children,
}: EditorProviderProps) {
  const [editor, dispatch] = useReducer(Reducer, INITIAL_STATE);
  const { loading, current } = editor;

  useEffect(() => {
    if (loading || !releaseId || releaseId === current?.id) {
      return;
    }

    dispatch(setLoading(true));

    const albumPromise = getAlbum(releaseId).then((res) => res.data);
    const tracksPromise = getTracksByAlbum(releaseId).then(
      (res) => res.data ?? [],
    );

    Promise.all([albumPromise, tracksPromise])
      .then(([album, tracks]) => {
        if (!album) {
          return;
        }
        dispatch(setCurrentRelease({ ...album, tracks }));
      })
      .finally(() => dispatch(setLoading(false)));
  }, [dispatch, releaseId, loading, current]);

  return (
    <EditorDispatchContext.Provider value={dispatch}>
      <EditorContext.Provider value={editor}>{children}</EditorContext.Provider>
    </EditorDispatchContext.Provider>
  );
}
