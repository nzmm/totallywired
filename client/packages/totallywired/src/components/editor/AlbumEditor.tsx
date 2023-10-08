import { Splitter } from "@totallywired/ui-components";
import { MBReleaseSearchItem } from "../../lib/musicbrainz/types";
import { AlbumChangeProposal } from "../../lib/editor/types";
import { updateProposal } from "../../lib/editor/proposals";
import { setProposal } from "../../lib/editor/actions";
import { useEditor, useEditorDisptach } from "../../lib/editor/hooks";
import Header from "../shell/Header";
import EditorProvider from "../providers/EditorProvider";
import AlbumMetadataSearch from "./AlbumSearch";
import AlbumMetadataComparison from "./AlbumComparison";
import "./MetadataTable.css";
import "./AlbumEditor.css";

type AlbumMetadataEditorProps = {
  releaseId: string;
  onSave: (proposal?: AlbumChangeProposal) => void;
  onClose: () => void;
};

function AlbumMetadataEditorModal({
  onSave,
  onClose,
}: Omit<AlbumMetadataEditorProps, "releaseId">) {
  const dispatch = useEditorDisptach();
  const editor = useEditor();

  const { loading, proposal, candidateMedia, artCollection } = editor;

  const onSelect = async (candidate: MBReleaseSearchItem) => {
    if (!proposal || !proposal.id) {
      return;
    }
    if (proposal.mbid === candidate.id) {
      return;
    }

    const updated = await updateProposal(artCollection, proposal, candidate);

    dispatch(setProposal(updated.proposal, updated.candidateMedia));
  };

  return (
    <>
      <Header />

      {proposal ? (
        <Splitter
          orientation="horizontal"
          initialPosition="300px"
          minSize="200px"
        >
          <AlbumMetadataSearch
            proposal={proposal}
            disabled={loading}
            onSelect={onSelect}
          />

          <AlbumMetadataComparison
            proposal={proposal}
            artCollection={artCollection}
            candidateMedia={candidateMedia}
          />
        </Splitter>
      ) : null}

      <div className="toolbar">
        <button onClick={onClose}>Close</button>
        <button onClick={() => onSave(editor.proposal)}>Save changes</button>
        <div />
      </div>
    </>
  );
}

export default function AlbumMetadataEditor({
  releaseId,
  onSave,
  onClose,
}: AlbumMetadataEditorProps) {
  return (
    <EditorProvider releaseId={releaseId}>
      <AlbumMetadataEditorModal onSave={onSave} onClose={onClose} />
    </EditorProvider>
  );
}
