import React, { Suspense } from "react";
import Loading from "../../components/common/Loading";

const LazyManageProviders = React.lazy(
  () => import("../../components/manage/ManageProviders"),
);

export default function Providers() {
  return (
    <Suspense fallback={<Loading />}>
      <LazyManageProviders />
    </Suspense>
  );
}
