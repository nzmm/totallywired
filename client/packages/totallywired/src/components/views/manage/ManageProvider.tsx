import { Await, useAsyncValue, useLoaderData } from "react-router-dom";
import { getProviderDefaultName } from "./metadata";
import { syncProvider } from "../../../lib/api/v1";
import { Provider } from "../../../lib/types";
import { Res } from "../../../lib/requests";
import { Suspense, useState } from "react";
import Loading from "../../common/Loading";
import ToggleInput from "../../common/ToggleInput";

const handleClick = async (
  e: React.MouseEvent<HTMLButtonElement>,
  sourceId: string,
) => {
  e.preventDefault();
  await syncProvider(sourceId);
};

function ManageProviderView() {
  const { data: provider } = useAsyncValue() as Res<Provider>;
  const [title, setTitle] = useState(
    provider?.name || getProviderDefaultName(provider),
  );

  if (!provider) {
    return null;
  }

  return (
    <div className="provider">
      <ToggleInput name="provider-name" value={title} onSubmit={setTitle} />

      <dl>
        <dt>Indexed Tracks</dt>
        <dd>{provider.trackCount}</dd>
        <dt>Created</dt>
        <dd>{provider.createdOn}</dd>
        <dt>Modified</dt>
        <dd>{provider.modifiedOn}</dd>
      </dl>

      <hr></hr>

      <div className="actions">
        <button onClick={(e) => handleClick(e, provider.id)}>Sync</button>
        <button>Remove</button>
      </div>
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
