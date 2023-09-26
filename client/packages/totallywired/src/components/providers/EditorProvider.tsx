import { useEffect, useReducer } from "react";
import { getAlbum, getTracksByAlbum } from "../../lib/api";
import { setLoading, setProposal } from "../../lib/editor/actions";
import {
  INIT_EDITOR,
  EditorDispatchContext,
  EditorContext,
} from "../../lib/editor/context";
import { createDefaultProposal } from "../../lib/editor/proposals";
import { Reducer } from "../../lib/editor/context";

type EditorProviderProps = React.PropsWithChildren & {
  releaseId: string;
};

export default function EditorProvider({
  releaseId,
  children,
}: EditorProviderProps) {
  const [editor, dispatch] = useReducer(Reducer, INIT_EDITOR);
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
