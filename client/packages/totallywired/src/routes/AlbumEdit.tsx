import React, { Suspense } from "react";
import { useParams } from "react-router-dom";
import { Dialog } from "../components/vendor/radix-ui/Dialog";
import Loading from "../components/common/Loading";

const LazyEditor = React.lazy(() => import("../components/views/editor/AlbumEditor"));

export default function AlbumEditor() {
  const params = useParams();

  if (!params.releaseId) {
    return null;
  }

  return (
    <Dialog open className="editor fullscreen">
      <Suspense fallback={<Loading />}>
        <LazyEditor releaseId={params.releaseId} />
      </Suspense>
    </Dialog>
  );
}
