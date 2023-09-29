import React, { Suspense } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlbumChangeProposal } from "../lib/editor/types";
import { createReleaseUpdateCommand } from "../lib/editor/command";
import { setAlbumMetadata } from "../lib/api";
import Loading from "../components/common/Loading";

const LazyEditor = React.lazy(() => import("../components/editor/AlbumEditor"));

export default function AlbumEditor() {
  const params = useParams();
  const navigate = useNavigate();

  const onDiscard = () => navigate(-1);

  const onSave = async (proposal?: AlbumChangeProposal) => {
    console.log({ proposal });

    if (proposal) {
      const command = createReleaseUpdateCommand(proposal);
      const res = await setAlbumMetadata(proposal.id, command);
      const releaseId = res.data?.releaseId;
      console.log("success?", releaseId != null, releaseId);

      // releaseId's may be updated in some cases, so we will need to update the url
      if (releaseId && proposal.id !== releaseId) {
        navigate(`/lib/albums/${releaseId}/editor`, { replace: true });
      }
    }
  };

  if (!params.releaseId) {
    return null;
  }

  return (
    <Suspense fallback={<Loading />}>
      <LazyEditor
        releaseId={params.releaseId}
        onSave={onSave}
        onDiscard={onDiscard}
      />
    </Suspense>
  );
}
