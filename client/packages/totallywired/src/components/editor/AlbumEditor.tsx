import * as Dialog from "@radix-ui/react-dialog";
import { Splitter } from "@totallywired/ui-components";
import { MBReleaseSearchItem } from "../../lib/musicbrainz/types";
import { AlbumChangeProposal } from "../../lib/editor/types";
import { updateProposal } from "../../lib/editor/proposals";
import EditorProvider, {
  editorDisptach,
  useEditor,
} from "../../providers/EditorProvider";
import Header from "../nav/Header";
import Loading from "../display/Loading";
import AlbumMetadataSearch from "./AlbumSearch";
import AlbumMetadataComparison from "./AlbumComparison";
import "./AlbumEditor.css";
import { setProposal } from "../../lib/editor/actions";

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
    <Dialog.Root open>
      <Dialog.Portal>
        <Dialog.Content className="DialogContent editor fullscreen">
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
