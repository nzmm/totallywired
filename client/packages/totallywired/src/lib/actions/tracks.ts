import { setTrackReaction } from "../api";
import { GenericDispatch, update } from "../reducer";
import { Track, ReactionType } from "../types";

export async function toggleReaction(
  dispatch: GenericDispatch<Track[]>,
  track?: Track,
) {
  if (!track) {
    return;
  }

  const { data: reaction } = await setTrackReaction(
    track.id,
    track.liked ? ReactionType.None : ReactionType.Liked,
  );

  const action = (tracks: Track[]) =>
    tracks.map((t) =>
      t.id !== track.id ? t : { ...t, liked: reaction === ReactionType.Liked },
    );

  dispatch(update(action));
}
