import { Await, Outlet, useAsyncValue, useLoaderData } from "react-router-dom";
import { ProviderGroup } from "../../lib/types";
import { Suspense } from "react";
import { Res } from "../../lib/requests";
import {
  Sidebar,
  SidebarJube,
  SidebarLink,
  SidebarSection,
} from "../common/Sidebar";
import { Splitter } from "@totallywired/ui-components";
import Loading from "../common/Loading";
import "./ManageProviders.css";

type ProviderMetadata = {
  name: string;
};

const METADATA: Record<string, ProviderMetadata> = {
  microsoft: {
    name: "Microsoft OneDrive",
  },
  google: {
    name: "Google Drive",
  },
};

function ProviderList() {
  const { data: providers = [] } = useAsyncValue() as Res<ProviderGroup[]>;
  return (
    <Splitter orientation="horizontal" initialPosition="250px">
      <Sidebar>
        {providers.map((p) => {
          return (
            <SidebarSection key={p.groupName}>
              <div className="provider-title">{METADATA[p.groupName]?.name ?? "?"}</div>

              {p.contentProviders.map((cp) => (
                <SidebarLink key={cp.id} to={cp.id}>
                  <span>{cp.id}</span>
                  <SidebarJube>{cp.trackCount}</SidebarJube>
                </SidebarLink>
              ))}
            </SidebarSection>
          );
        })}
      </Sidebar>

      <Outlet />
    </Splitter>
  );
}

export default function ContentProviders() {
  const data = useLoaderData();
  return (
    <section id="my-content-providers">
      <Suspense fallback={<Loading />}>
        <Await resolve={data}>
          <ProviderList />
        </Await>
      </Suspense>
    </section>
  );
}
