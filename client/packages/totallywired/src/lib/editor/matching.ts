import { Track } from "../types";
import { MatchedTrack } from "./types";
import { MBTrack } from "../musicbrainz/types";
import { calculateSimilarity, isSimilar } from "./similarity";

const createMatch = (track: Track): MatchedTrack => {
  return {
    track,
    match: undefined,
    similarity: 0,
  };
};

/**
 * Matches tracks with a counterpart within the `candidateTracks` collection.
 * Matching is performed by calculating the trigram similarity of their respective track names.
 */
export function bestMatchTracks(
  tracks: Track[],
  candidateTracks: MBTrack[],
): MatchedTrack[] {
  let l = candidateTracks.length;
  if (!l) {
    return tracks.map((t) => createMatch(t));
  }

  const matches: MatchedTrack[] = [];
  const remaining: MBTrack[] = [...candidateTracks];
  let i: number, match: MatchedTrack;

  for (const track of tracks) {
    match = createMatch(track);

    if (!l) {
      matches.push(match);
      continue;
    }

    for (i = 0; i < l; i++) {
      const result = remaining[i];

      if (track.name === result.title) {
        match.match = result;
        match.similarity = 1;
        remaining.splice(i, 1);
        l -= 1;
        break;
      }

      const similarity = calculateSimilarity(track.name, result.title);

      if (isSimilar(similarity)) {
        match.match = result;
        match.similarity = similarity;
        remaining.splice(i, 1);
        l -= 1;
        break;
      }
    }

    matches.push(match);
  }

  return matches;
}
