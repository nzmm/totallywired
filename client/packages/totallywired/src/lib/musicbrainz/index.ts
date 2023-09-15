import { getArt, getMbz } from "./api";
import { MBReleaseQueryResponse, MBReleaseResponse } from "./types";

const DEFAULT_COVERART_URL = "/default-art.svg";

/**
 * Performs a MusicBrainz `release` query using artist and release names. Returns the top 25 results.
 */
export const queryReleases = (artistName: string, releaseName: string) => {
  return getMbz<MBReleaseQueryResponse>(
    "/release",
    new URLSearchParams({
      query: `artist:"${artistName}"+release:"${releaseName}"`,
      limit: "25",
      fmt: "json",
    })
  );
};

/**
 * Performs a MusicBrainz `release` lookup by release id.
 */
export const getRelease = (
  releaseId: string,
  inc = "recordings+artist-credits+labels"
) => {
  return getMbz<MBReleaseResponse>(
    `/release/${releaseId}`,
    new URLSearchParams({
      inc,
      fmt: "json",
    })
  );
};

/**
 * Queries for any front coverart marching the release id. Returns a url if coverart exists.
 * If no art exists or any error is encountered then `DEFAULT_COVERART_URL` is returned.
 */
export const getCoverArtUrl = (
  releaseId: string,
  size: 250 | 500 | 1200 = 250
) => {
  return getArt(`/release/${releaseId}/front-${size}`)
    .then((r) =>
      r.ok ? r.data?.url ?? DEFAULT_COVERART_URL : DEFAULT_COVERART_URL
    )
    .catch(() => DEFAULT_COVERART_URL);
};
