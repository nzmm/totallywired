import { sendQuery } from "../requests";
import { CAResponse } from "./types";

export function getMbz<T>(request: string, params: URLSearchParams) {
  return sendQuery<T>(`https://musicbrainz.org/ws/2/${request}`, params);
}

export function getArt(request: string) {
  return sendQuery<CAResponse>(`https://coverartarchive.org/${request}`);
}