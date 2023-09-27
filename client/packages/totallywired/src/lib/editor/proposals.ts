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
import { getMBRelease } from "../musicbrainz/api";

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
    length: match?.length ?? track.length,
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
  const defaultCoverArt = album.coverArt ?? `/api/v1/releases/${album.id}/art`;
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
    type: attrCR("type", album.type ?? "", album.type ?? ""),
    coverArt: attrCR("coverArt", defaultCoverArt, defaultCoverArt),
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
  artCollection: Record<string, string>,
  proposal: AlbumChangeProposal,
  candidate: MBReleaseSearchItem,
) => {
  const { id, artistId } = proposal;
  const res = await getMBRelease(candidate.id);
  const candidateTracks = getMediaTracks(res.data?.media ?? []);
  console.log(res.data);

  const mbid = candidate.id;
  const artistMbid = res.data?.["artist-credit"][0]?.artist.id ?? "";
  const coverArtSrc =
    artCollection[candidate.id] ?? `/api/v1/releases/${id}/art`;
  const artistName = candidate["artist-credit"][0]?.name ?? "";
  const recordLabel = candidate["label-info"]?.[0]?.label.name ?? "";
  const type = res.data?.media[0]?.title ?? "";
  const year = getYear(candidate.date) ?? 0;

  const updatedProposal: AlbumChangeProposal = {
    id,
    artistId,
    mbid,
    artistMbid,
    name: attrCR("name", proposal.name.oldValue, candidate.title),
    year: attrCR("year", proposal.year.oldValue, year),
    artistName: attrCR("artistName", proposal.artistName.oldValue, artistName),
    recordLabel: attrCR(
      "recordLabel",
      proposal.recordLabel.oldValue,
      recordLabel,
    ),
    country: attrCR("country", proposal.country.oldValue, candidate.country),
    type: attrCR("type", proposal.type.oldValue, type),
    coverArt: attrCR("coverArt", proposal.coverArt.oldValue, coverArtSrc),
    tracks: bestMatchTracks(
      proposal.tracks.map((t) => t.track),
      candidateTracks,
    ).map((m) => trackCR(m)),
  };

  return { proposal: updatedProposal, candidateTracks };
};
