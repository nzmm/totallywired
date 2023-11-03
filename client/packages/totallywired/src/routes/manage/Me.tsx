import React, { Suspense } from "react";
import Loading from "../../components/common/Loading";

const LazyManageProfile = React.lazy(
  () => import("../../components/views/manage/ManageProfile"),
);

export default function Me() {
  return (
    <Suspense fallback={<Loading />}>
      <LazyManageProfile />
    </Suspense>
  );
}
