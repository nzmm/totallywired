import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { Splitter } from "@totallywired/ui-components";
import { MBReleaseSearchItem } from "../../lib/musicbrainz/types";
import { AlbumChangeProposal } from "../../lib/editor/types";
import { buildProposal } from "../../lib/editor/proposals";
import { update } from "../../lib/reducer";
import EditorProvider, {
  editorDisptach,
  useEditor,
} from "../../providers/EditorProvider";
import Header from "../nav/Header";
import AlbumMetadataSearch from "./AlbumSearch";
import AlbumMetadataComparison from "./AlbumComparison";
import "./AlbumEditor.css";

type AlbumMetadataEditorProps = {
  releaseId: string;
  onSave: (proposal?: AlbumChangeProposal) => void;
  onDiscard: () => void;
};

function AlbumMetadataEditorModal({
  onSave,
  onDiscard,
}: Omit<AlbumMetadataEditorProps, "releaseId">) {
  const [selectedId, setSelectedId] = useState("");

  const dispatch = editorDisptach();
  const editor = useEditor();

  const { loading, current, proposal, candidateTracks } = editor;

  const onSelect = async (candidate: MBReleaseSearchItem) => {
    if (!current?.id) {
      return;
    }
    if (selectedId === candidate.id) {
      return;
    }

    setSelectedId(candidate.id);

    const { proposal: newProposal, candidateTracks } = await buildProposal(
      current,
      candidate,
    );

    dispatch(
      update((state) => ({
        ...state,
        candidateTracks,
        proposal: newProposal,
      })),
    );
  };

  return (
    <Dialog.Root open>
      <Dialog.Portal>
        <Dialog.Content className="DialogContent editor fullscreen">
          <Header />

          <Splitter
            orientation="horizontal"
            initialPosition="300px"
            minSize="200px"
          >
            <AlbumMetadataSearch
              release={current}
              selectedId={selectedId}
              disabled={loading}
              onSelect={onSelect}
            />

            <AlbumMetadataComparison
              current={current}
              proposal={proposal}
              candidateTracks={candidateTracks}
            />
          </Splitter>

          <div className="toolbar">
            <Dialog.Close asChild onClick={onDiscard}>
              <button className="Button">Discard</button>
            </Dialog.Close>

            <Dialog.Close asChild onClick={() => onSave(editor.proposal)}>
              <button className="Button green">Save changes</button>
            </Dialog.Close>
            <div />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default function AlbumMetadataEditor({
  releaseId,
  onSave,
  onDiscard,
}: AlbumMetadataEditorProps) {
  return (
    <EditorProvider releaseId={releaseId}>
      <AlbumMetadataEditorModal onSave={onSave} onDiscard={onDiscard} />
    </EditorProvider>
  );
}
