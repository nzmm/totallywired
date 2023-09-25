import { Splitter } from "@totallywired/ui-components";
import { MBReleaseSearchItem } from "../../lib/musicbrainz/types";
import { AlbumChangeProposal } from "../../lib/editor/types";
import { updateProposal } from "../../lib/editor/proposals";
import EditorProvider, {
  editorDisptach,
  useEditor,
} from "../../providers/EditorProvider";
import { setProposal } from "../../lib/editor/actions";
import { Dialog } from "../vendor/radix-ui/Dialog";
import Header from "../nav/Header";
import Loading from "../display/Loading";
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
  const dispatch = editorDisptach();
  const editor = useEditor();

  const { loading, proposal, candidateTracks } = editor;

  const onSelect = async (candidate: MBReleaseSearchItem) => {
    if (!proposal?.id) {
      return;
    }
    if (proposal.mbid === candidate.id) {
      return;
    }

    const updates = await updateProposal(proposal, candidate);

    dispatch(setProposal(updates.proposal, updates.candidateTracks));
  };

  return (
    <Dialog open className="editor fullscreen">
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
            candidateTracks={candidateTracks}
          />
        </Splitter>
      ) : (
        <Loading />
      )}

      <div className="toolbar">
        <button className="Button" onClick={onDiscard}>
          Discard
        </button>
        <button
          className="Button green"
          onClick={() => onSave(editor.proposal)}
        >
          Save changes
        </button>
        <div />
      </div>
    </Dialog>
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
