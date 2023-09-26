import { MBMedia, MBTrack, MBReleaseSearchItem } from "../musicbrainz/types";
import { AlbumDetail, Track } from "../types";
import {
  AlbumChangeProposal,
  MatchedTrack,
  AttributeChangeRequest,
  TrackChangeRequest,
} from "./types";
import { getYear } from "../utils";
import { bestMatchTracks } from "./matching";
import { getMBRelease } from "../musicbrainz";

const attrCR = <T>(
  key: string,
  oldValue: T,
  newValue: T,
): AttributeChangeRequest<T> => {
  const approved = !!newValue;
  const active = oldValue !== newValue;
  return { key, oldValue, newValue, approved, active };
};

const trackCR = ({
  track,
  match,
  similarity,
}: MatchedTrack): TrackChangeRequest => {
  const numVariance = track.number !== match?.position.toString();
  const nameVariance = !!track.name && track.name !== match?.title;
  return {
    id: track.id,
    mbid: match?.id ?? "",
    similarity: similarity,
    active: !!match && (numVariance || nameVariance),
    approved: true,
    track,
    number: {
      key: "number",
      oldValue: track.number,
      newValue: match?.position.toString() ?? track.number,
    },
    name: {
      key: "name",
      oldValue: track.name,
      newValue: match?.title ?? track.name,
    },
  };
};

/**
 * Builds a default proposal from the supplied Album and Track data
 */
export const createDefaultProposal = (
  album: AlbumDetail,
  tracks: Track[],
): AlbumChangeProposal => {
  return {
    id: album.id,
    artistId: album.artistId,
    mbid: "",
    artistMbid: "",
    name: attrCR("name", album.name, album.name),
    artistName: attrCR("artistName", album.artistName, album.artistName),
    year: attrCR("year", album.year, album.year),
    recordLabel: attrCR("recordLabel", album.recordLabel, album.recordLabel),
    country: attrCR("country", album.country, album.country),
    coverArt: attrCR("coverArt", album.coverArt, album.coverArt),
    tracks: tracks.map((track) =>
      trackCR({ track, match: undefined, similarity: 1 }),
    ),
  };
};

/**
 * Returns a flattened list of all tracks belonging to the provided media.
 */
export const getMediaTracks = (media: MBMedia[]) => {
  return media.reduce<MBTrack[]>((acc, m) => {
    acc.push(...m.tracks);
    return acc;
  }, []);
};

/**
 * Updates the provided a proposal, merging the current album & track metadata with the supplied MusicBrainz candidate.
 * Track matching is based on a best guess, using the trigram similarity of the track names.
 * Where metadata differs, the candidate value is always preferred.
 * Where no track exists to match against, the existing "oldValue" is used.
 */
export const updateProposal = async (
  proposal: AlbumChangeProposal,
  candidate: MBReleaseSearchItem,
) => {
  const { id, artistId } = proposal;
  const res = await getMBRelease(candidate.id);
  const candidateTracks = getMediaTracks(res.data?.media ?? []);

  const artistName = candidate["artist-credit"][0]?.name ?? "";
  const recordLabel = candidate["label-info"]?.[0]?.label.name ?? "";
  const year = getYear(candidate.date) ?? 0;

  const updatedProposal: AlbumChangeProposal = {
    id,
    artistId,
    mbid: candidate.id,
    artistMbid: "", // todo ?
    name: attrCR("name", proposal.name.oldValue, candidate.title),
    year: attrCR("year", proposal.year.oldValue, year),
    artistName: attrCR("artistName", proposal.artistName.oldValue, artistName),
    recordLabel: attrCR(
      "recordLabel",
      proposal.recordLabel.oldValue,
      recordLabel,
    ),
    country: attrCR("country", proposal.country.oldValue, candidate.country),
    coverArt: attrCR("coverArt", proposal.coverArt.oldValue, ""),
    tracks: bestMatchTracks(
      proposal.tracks.map((t) => t.track),
      candidateTracks,
    ).map((m) => trackCR(m)),
  };

  return { proposal: updatedProposal, candidateTracks };
};
