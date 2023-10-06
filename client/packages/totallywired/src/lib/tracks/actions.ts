import { update } from "../reducer";
import { Track, ReactionType, Playlist } from "../types";
import { MusicCollection } from "./context";

export const updateTrackReaction = (
  track: Track,
  reaction: ReactionType | undefined,
) => {
  return update<MusicCollection>((state) => {
    if (reaction == null) {
      return state;
    }

    const releaseId = track.releaseId;
    if (!(releaseId in state.collection)) {
      return state;
    }

    const trackId = track.id;
    const tracks = state.collection[releaseId].map((t) =>
      trackId !== t.id ? t : { ...t, liked: reaction === ReactionType.Liked },
    );

    return {
      collection: {
        ...state.collection,
        [releaseId]: tracks,
      },
    };
  });
};

export const updateLikedTrackCount = (reaction: ReactionType | undefined) => {
  return update<Playlist[]>((playlists) => {
    if (reaction == null) {
      return playlists;
    }

    const [liked, ...rest] = playlists;

    if (!liked) {
      return playlists;
    }

    const trackCount =
      liked.trackCount + (reaction === ReactionType.Liked ? 1 : -1);

    return [{ ...liked, trackCount }, ...rest];
  });
};
