import { Res, sendQuery } from "../requests";
import {
  CAResponse,
  MBReleaseSearchResponse,
  MBReleaseResponse,
} from "./types";

const DEFAULT_COVERART_URL = "/default-art.svg";

function getMbz<T>(request: string, params: URLSearchParams) {
  return sendQuery<T>(`https://musicbrainz.org/ws/2/${request}`, params);
}

function getArt(request: string) {
  return sendQuery<CAResponse>(`https://coverartarchive.org/${request}/front`);
}

/**
 * Performs a MusicBrainz `release` query using artist and/or release names. Returns the top 25 results.
 */
export const searchReleases = (releaseName: string, artistName: string) => {
  if (!releaseName && !artistName) {
    throw new Error("releaseName or artistName required");
  }

  return getMbz<MBReleaseSearchResponse>(
    "release",
    new URLSearchParams({
      query:
        releaseName && artistName
          ? `release:"${releaseName}" AND artist:"${artistName}"`
          : releaseName
          ? `release:"${releaseName}"`
          : `artist:"${artistName}"`,
      limit: "25",
      fmt: "json",
    }),
  );
};

/**
 * Performs a MusicBrainz `release` lookup by release id.
 */
export const getRelease = (
  releaseId: string,
  inc = "recordings+artist-credits+labels",
) => {
  if (!releaseId) {
    throw new Error("releaseId is required");
  }
  return getMbz<MBReleaseResponse>(
    `release/${releaseId}`,
    new URLSearchParams({
      inc,
      fmt: "json",
    }),
  );
};

/**
 * Queries for any front coverart marching the release id. Returns a url if coverart exists.
 * If no art exists or any error is encountered then `DEFAULT_COVERART_URL` is returned.
 */
export const getCoverArtUrl = async (
  releaseId: string,
  size: 250 | 500 | 1200 = 250,
) => {
  if (!releaseId) {
    throw new Error("releaseId is required");
  }

  let r: Res<CAResponse>;

  try {
    r = await getArt(`release/${releaseId}/front-${size}`);
  } catch {
    return DEFAULT_COVERART_URL;
  }

  return r.ok ? r.data?.url ?? DEFAULT_COVERART_URL : DEFAULT_COVERART_URL;
};
