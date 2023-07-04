import { useEffect, useState } from "react";
import { getProviders, syncProvider } from "../lib/webapi";
import { ProviderCollection } from "../lib/types";
import { TabList } from "@totallywired/ui-components";

type ProviderMetadata = {
  name: string;
  enabled: boolean;
  sourceType: number;
};

const PROVIDERS: ProviderMetadata[] = [
  {
    name: "Microsoft OneDrive",
    enabled: true,
    sourceType: 1
  },
  {
    name: "Google Drive",
    enabled: false,
    sourceType: 2
  },
  {
    name: "Dropbox",
    enabled: false,
    sourceType: 3
  },
];

export default function Providers() {
  const [collections, setCollections] = useState<
    (ProviderCollection & ProviderMetadata)[]
  >([]);

  useEffect(() => {
    getProviders().then((data) => {
      const colls = PROVIDERS.map(meta => {
        const providers = data.find(x => x.sourceType === meta.sourceType) ?? { providers: [] };
        return {
          ...meta,
          ...providers
        }
      });
      setCollections(colls);
    });
  }, []);

  const handleClick = async (
    e: React.MouseEvent<HTMLButtonElement>,
    sourceId: string
  ) => {
    e.preventDefault();
    await syncProvider(sourceId);
  };

  return (
    <>
      <section className="manage-providers">
        <h2 id="providers-tablist-header">Content Providers</h2>
        <TabList
          ariaLabelledBy="providers-tablist-header"
          labels={collections.map((c) => `${c.name} (${c.providers.length})`)}
        >
          {collections.map((c) => {
            return (
              <div key={c.sourceType} className="provider tabpanel-content">
                <a href="/providers/begin-auth/msgraph">
                  Add a {c.name} provider&hellip;
                </a>
                <hr />
                <ul>
                  {c.providers.map((p) => {
                    return (
                      <li key={p.sourceId}>
                        <dl>
                          <dt>Tracks</dt>
                          <dd>{p.trackCount}</dd>
                          <dt>Created</dt>
                          <dd>{p.createdOn}</dd>
                          <dt>Modified</dt>
                          <dd>{p.modifiedOn}</dd>
                        </dl>

                        <button onClick={(e) => handleClick(e, p.sourceId)}>
                          Sync
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </TabList>
      </section>
    </>
  );
}
