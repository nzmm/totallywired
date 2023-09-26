import React, { Suspense } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlbumChangeProposal } from "../lib/editor/types";
import Loading from "../components/display/Loading";

const LazyEditor = React.lazy(() => import("../components/editor/AlbumEditor"));

export default function AlbumEditor() {
  const params = useParams();
  const navigate = useNavigate();

  const onDiscard = () => navigate(-1);
  const onSave = (proposal?: AlbumChangeProposal) => {
    console.log(proposal);
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
