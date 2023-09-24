import { MBMedia, MBTrack, MBReleaseSearchItem } from "../musicbrainz/types";
import { AlbumWithTracks } from "../types";
import { AlbumChangeProposal, MetadataChangeRequest } from "./types";
import { tryParseDate } from "../utils";
import { bestMatchTracks } from "./matching";
import { getRelease } from "../musicbrainz";

/**
 * Returns a flattened list of all tracks belonging to the provided media.
 */
export const getMediaTracks = (media: MBMedia[]) => {
  return media.reduce<MBTrack[]>((acc, m) => {
    acc.push(...m.tracks);
    return acc;
  }, []);
};

const requestChange = <T>(
  oldValue: T,
  newValue: T,
): MetadataChangeRequest<T> => {
  const approved = !!newValue;
  const active = oldValue !== newValue;
  return { value: newValue, approved, active };
};

/**
 * Builds a proposal, merging the current album & tracks with the MusicBrainz candidate.
 * Track matching is based on a best guess, using the trigram similarity of the track names.
 * Where metadata differs, the candidate value is always preferred.
 */
export const buildProposal = async (
  current: AlbumWithTracks,
  candidate: MBReleaseSearchItem,
) => {
  const { id, artistId, tracks } = current;
  const res = await getRelease(candidate.id);
  const candidateTracks = getMediaTracks(res.data?.media ?? []);

  const artistName = candidate["artist-credit"][0]?.name ?? "";
  const recordLabel = candidate["label-info"]?.[0]?.label.name ?? "";
  const year = tryParseDate(candidate.date)?.getFullYear() ?? current.year;

  const proposal: AlbumChangeProposal = {
    id,
    artistId,
    name: requestChange(current.name, candidate.title),
    year: requestChange(current.year, year),
    artistName: requestChange(current.artistName, artistName),
    recordLabel: requestChange(current.recordLabel, recordLabel),
    country: requestChange(current.country, candidate.country),
    coverArt: requestChange(current.coverArt, ""),
    tracks: bestMatchTracks(tracks, candidateTracks),
    releaseMbid: candidate.id,
    artistMbid: "", // todo
  };

  return { proposal, candidateTracks };
};
