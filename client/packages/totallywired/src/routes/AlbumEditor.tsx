import { LoaderFunctionArgs } from "react-router-dom";
import { getAlbum, getTracksByAlbum } from "../lib/api";
import { requestSearchParams } from "../lib/requests";

export function albumEditorLoader({ request, params }: LoaderFunctionArgs) {
  const releaseId = params["releaseId"];

  if (!releaseId) {
    throw new Error("releaseId required");
  }

  const searchParams = requestSearchParams(request);
  return Promise.all([
    getAlbum(releaseId),
    getTracksByAlbum(releaseId, searchParams),
  ]);
}

export default function AlbumEditor() {
  return null;
}
