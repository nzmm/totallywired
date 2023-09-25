import { createContext, useContext, useEffect, useReducer } from "react";
import { commonReducer, createDispatchContext } from "../lib/reducer";
import { EditorContextState } from "../lib/editor/types";
import { getAlbum, getTracksByAlbum } from "../lib/api";
import { setLoading, setProposal } from "../lib/editor/actions";
import { createDefaultProposal } from "../lib/editor/proposals";

type EditorProviderProps = React.PropsWithChildren & {
  releaseId: string;
};

const INITIAL_STATE: EditorContextState = {
  loading: false,
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
  const { loading, proposal } = editor;

  useEffect(() => {
    if (loading || !releaseId || releaseId === proposal?.id) {
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
        const proposal = createDefaultProposal(album, tracks);
        console.log(proposal);
        dispatch(setProposal(proposal));
      })
      .finally(() => dispatch(setLoading(false)));
  }, [dispatch, releaseId, loading, proposal]);

  return (
    <EditorDispatchContext.Provider value={dispatch}>
      <EditorContext.Provider value={editor}>{children}</EditorContext.Provider>
    </EditorDispatchContext.Provider>
  );
}
