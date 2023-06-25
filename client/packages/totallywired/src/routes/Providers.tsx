import { useEffect, useState } from "react";
import { getProviders, syncProvider } from "../lib/requests";
import { ProviderCollection } from "../lib/types";
import { TabList } from "@totallywired/ui-components";

type ProviderMetadata = {
  name: string;
  enabled: boolean;
};

const PROVIDER_METADATA: Record<number, ProviderMetadata> = {
  [1]: {
    name: "Microsoft OneDrive",
    enabled: true,
  },
  [2]: {
    name: "Google Drive",
    enabled: false,
  },
  [3]: {
    name: "Dropbox",
    enabled: false,
  },
};

export default function Providers() {
  const [collections, setCollections] = useState<
    (ProviderCollection & ProviderMetadata)[]
  >([]);

  useEffect(() => {
    getProviders().then((data) => {
      const collData = data.map((c) => {
        const meta = PROVIDER_METADATA[c.sourceType];
        return {
          ...c,
          ...meta,
        };
      });

      setCollections(collData);
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
                <a href="/begin-auth-msgraph">
                  Add a {c.name} provider&hellip;
                </a>
                <hr />
                <ul>
                  {c.providers.map((p) => {
                    return (
                      <li>
                        ({p.trackCount}){p.createdOn}
                        {p.modifiedOn}
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
