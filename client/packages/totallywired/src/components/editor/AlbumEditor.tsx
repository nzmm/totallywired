import { useNavigate } from "react-router-dom";
import { Splitter } from "@totallywired/ui-components";
import { MBReleaseSearchResult } from "../../lib/musicbrainz/types";
import { updateProposal } from "../../lib/editor/proposals";
import { commitAllChanges, setProposal } from "../../lib/editor/actions";
import { useEditor, useEditorDisptach } from "../../lib/editor/hooks";
import { createReleaseUpdateCommand } from "../../lib/editor/command";
import { setAlbumMetadata } from "../../lib/api/v1";
import { useToastNotifications } from "../vendor/radix-ui/context";
import Header from "../shell/Header";
import EditorProvider from "../providers/EditorProvider";
import AlbumMetadataSearch from "./AlbumSearch";
import AlbumMetadataComparison from "./AlbumComparison";
import "./MetadataTable.css";
import "./AlbumEditor.css";

type AlbumMetadataEditorProps = {
  releaseId: string;
};

function AlbumMetadataEditorModal() {
  const navigate = useNavigate();
  const dispatch = useEditorDisptach();
  const toast = useToastNotifications();
  const { loading, proposal, candidateMedia, artCollection } = useEditor();

  const onSelect = async (candidate: MBReleaseSearchResult) => {
    if (!proposal || !proposal.id) {
      return;
    }
    if (proposal.mbid === candidate.id) {
      return;
    }

    const updated = await updateProposal(artCollection, proposal, candidate);

    dispatch(setProposal(updated.proposal, updated.candidateMedia));
  };

  const onSave = async () => {
    if (!proposal) {
      return;
    }

    const command = createReleaseUpdateCommand(proposal);
    const res = await setAlbumMetadata(proposal.id, command);
    const releaseId = res.data?.releaseId;
    const success = releaseId != null;

    if (!res.ok || !success) {
      toast({
        title: "Save failed",
        description: "No changes were saved",
        state: "danger",
      });
      return;
    }

    toast({
      title: "Saved",
      description: `${proposal.name.newValue} saved successfully`,
      state: "success",
    });

    dispatch(commitAllChanges());

    // releaseId's may be updated in some cases, so we will need to update the url
    if (proposal.id !== releaseId) {
      navigate(`/lib/albums/${releaseId}/editor`, { replace: true });
    }
  };

  const onClose = () => navigate(-1);

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
        <p className="kudos">
          Metadata provided by&nbsp;
          <a href="https://musicbrainz.org/">
            <img src="/musicbrainz.svg" alt="Musicbrainz logo" height="16" />
          </a>
        </p>

        <div className="actions">
          <button onClick={onClose}>Close</button>
          <button onClick={onSave}>Save changes</button>
        </div>
      </div>
    </>
  );
}

export default function AlbumMetadataEditor({
  releaseId,
}: AlbumMetadataEditorProps) {
  return (
    <EditorProvider releaseId={releaseId}>
      <AlbumMetadataEditorModal />
    </EditorProvider>
  );
}
