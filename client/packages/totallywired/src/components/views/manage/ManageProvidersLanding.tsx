import { useAsyncValue } from "react-router-dom";
import { Res } from "../../../lib/requests";
import { ProviderGroup } from "../../../lib/types";
import { METADATA } from "./metadata";
import "./ManageProvidersLanding.css";

export default function ManageProvidersLanding() {
  const { data: providers = [] } = useAsyncValue() as Res<ProviderGroup[]>;
  return (
    <div id="manage-providers-landing">
      <h1>Manage your content providers</h1>
      <p>Add remove or resync your content providers.</p>

      <ul>
        {providers.map((p) => {
          return (
            <li key={p.groupName}>
              <a href={`/providers/auth-request/${p.groupName}`}>
                Add a {METADATA[p.groupName].name} provider&hellip;
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
