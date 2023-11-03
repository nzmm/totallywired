import { Await, useAsyncValue, useLoaderData } from "react-router-dom";
import { syncProvider } from "../../../lib/api/v1";
import { Provider } from "../../../lib/types";
import { Res } from "../../../lib/requests";
import { Suspense } from "react";
import Loading from "../../common/Loading";

function ManageProviderView() {
  const { data: provider } = useAsyncValue() as Res<Provider>;

  if (!provider) {
    return null;
  }

  const handleClick = async (
    e: React.MouseEvent<HTMLButtonElement>,
    sourceId: string,
  ) => {
    e.preventDefault();
    await syncProvider(sourceId);
  };

  return (
    <div className="provider">
      <h2>{provider.id}</h2>

      <dl>
        <dt>Tracks</dt>
        <dd>{provider.trackCount}</dd>
        <dt>Created</dt>
        <dd>{provider.createdOn}</dd>
        <dt>Modified</dt>
        <dd>{provider.modifiedOn}</dd>
      </dl>

      <hr></hr>

      <button onClick={(e) => handleClick(e, provider.id)}>Sync</button>
    </div>
  );
}

export default function ManageProvider() {
  const data = useLoaderData();
  return (
    <Suspense fallback={<Loading />}>
      <Await resolve={data}>
        <ManageProviderView />
      </Await>
    </Suspense>
  );
}
