import React, { Suspense } from "react";
import Loading from "../../components/common/Loading";

const LazyContentProviders = React.lazy(
  () => import("../../components/manage/ContentProviders"),
);

export default function Providers() {
  return (
    <Suspense fallback={<Loading />}>
      <LazyContentProviders />
    </Suspense>
  );
}
