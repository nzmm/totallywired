import { update } from "../reducer";
import { Track, ReactionType, Playlist } from "../types";

export const updateTrackReaction = (
  trackId: string,
  reaction: ReactionType | undefined,
) => {
  return update<Track[]>((tracks) => {
    if (reaction == null) {
      return tracks;
    }
    return tracks.map((t) =>
      t.id !== trackId ? t : { ...t, liked: reaction === ReactionType.Liked },
    );
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
