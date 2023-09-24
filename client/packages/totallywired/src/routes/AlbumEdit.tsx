import { LoaderFunctionArgs, useNavigate, useParams } from "react-router-dom";
import React, { Suspense, useCallback } from "react";
import Loading from "../components/display/Loading";

const LazyEditor = React.lazy(() => import("../components/editor/AlbumEditor"));

export function albumEditorLoader({}: LoaderFunctionArgs) {
  return Promise.resolve({});
}

export default function AlbumEditor() {
  const params = useParams();
  const navigate = useNavigate();
  const goBack = useCallback(() => navigate(-1), []);

  if (!params.releaseId) {
    return null;
  }

  return (
    <Suspense fallback={<Loading />}>
      <LazyEditor
        releaseId={params.releaseId}
        onSave={goBack}
        onDiscard={goBack}
      />
    </Suspense>
  );
}
