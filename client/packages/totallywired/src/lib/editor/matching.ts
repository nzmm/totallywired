import { Track } from "../types";
import { MBTrack } from "../musicbrainz/types";
import { TrackChangeRequest } from "./types";
import { calculateSimilarity, isSimilar } from "./similarity";

const buildTrackProposal = ({
  id,
  number,
  name,
}: Track): TrackChangeRequest => {
  return {
    id,
    mbid: "",
    similarity: 1,
    number,
    name,
    active: false,
    approved: true,
  };
};

/**
 * Matches tracks with a counterpart within the `candidateTracks` collection.
 * Matching is performed by calculating the trigram similarity of their respective track names.
 */
export function bestMatchTracks(
  tracks: Track[],
  candidateTracks: MBTrack[],
): TrackChangeRequest[] {
  let l = candidateTracks.length;
  if (!l) {
    return tracks.map((t) => buildTrackProposal(t));
  }

  const matches: TrackChangeRequest[] = [];
  const remaining: MBTrack[] = [...candidateTracks];
  let i: number, match: TrackChangeRequest;

  for (const track of tracks) {
    match = buildTrackProposal(track);

    if (!l) {
      matches.push(match);
      continue;
    }

    for (i = 0; i < l; i++) {
      const result = remaining[i];

      if (track.name === result.title) {
        match.number = result.position.toString();
        match.active = track.number !== result.position.toString();
        match.mbid = result.id;
        remaining.splice(i, 1);
        l -= 1;
        break;
      }

      const similarity = calculateSimilarity(track.name, result.title);

      if (isSimilar(similarity)) {
        match.name = result.title;
        match.number = result.position.toString();
        match.similarity = similarity;
        match.approved = true;
        match.active = true;
        match.mbid = result.id;
        remaining.splice(i, 1);
        l -= 1;
        break;
      }
    }

    matches.push(match);
  }

  return matches;
}
