import { sendQuery } from "../requests";
import { DEFAULT_COVERART_URL } from "./consts";
import {
  MBRelease,
  CAImageSize,
  MBReleaseGroupSearchCollection,
  MBReleaseSearchCollection,
} from "./types";

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

  return getMbz<MBReleaseSearchCollection>(
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
  return getMbz<MBRelease>(
    `release/${releaseId}`,
    new URLSearchParams({
      inc,
      fmt: "json",
    }),
  );
};

export const getMBReleaseGroup = (releaseId: string, inc = "url-rels") => {
  if (!releaseId) {
    throw new Error("releaseId is required");
  }
  return getMbz<MBReleaseGroupSearchCollection>(
    `release-group`,
    new URLSearchParams({
      release: releaseId,
      inc,
      fmt: "json",
    }),
  );
};

/**
 * Queries for any front coverart for the specified release id.
 *
 * If any HTTP error or an unhandled exception is encountered then `DEFAULT_COVERART_URL` is returned as the art url.
 *
 * Default thumbnail size is 250px.
 */
export const getCAFrontArtUrl = async (
  releaseId: string,
  size: CAImageSize = 250,
) => {
  if (!releaseId) {
    throw new Error("releaseId is required");
  }
  try {
    const { ok, url } = await getArtUrl(`release/${releaseId}/front-${size}`);
    return { url: ok ? url : DEFAULT_COVERART_URL, exists: ok };
  } catch {
    return { url: DEFAULT_COVERART_URL, exists: false };
  }
};
