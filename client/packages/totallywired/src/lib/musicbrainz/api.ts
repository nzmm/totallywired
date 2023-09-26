import { sendQuery } from "../requests";
import { MBReleaseSearchResponse, MBReleaseResponse } from "./types";

function getMbz<T>(request: string, params: URLSearchParams) {
  return sendQuery<T>(`https://musicbrainz.org/ws/2/${request}`, params);
}

function getArtUrl(request: string) {
  return sendQuery(`https://coverartarchive.org/${request}`, undefined, {
    method: "HEAD",
  });
}

/**
 * Performs a MusicBrainz `release` query using artist and/or release names.
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
      limit: "15",
      fmt: "json",
    }),
  );
};

/**
 * Performs a MusicBrainz `release` lookup by release id.
 */
export const getMBRelease = (
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
 * Queries for any front coverart for the specified release id.
 * If any HTTP error is encountered then `null` is returned as the art url.
 */
export const getCAFrontArtUrl = async (
  releaseId: string,
  size: 250 | 500 | 1200 = 250,
) => {
  if (!releaseId) {
    throw new Error("releaseId is required");
  }
  const { ok, url } = await getArtUrl(`release/${releaseId}/front-${size}`);
  return { url, exists: ok };
};
