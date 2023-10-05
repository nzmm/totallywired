import { useCallback, useContext, useEffect } from "react";
import { useAsyncValue } from "react-router-dom";
import { update } from "../reducer";
import { Res } from "../requests";
import { AlbumCollection, ReactionType, Track } from "../types";
import { getTracksByAlbum, setTrackReaction } from "../api";
import { updateLikedTrackCount } from "./actions";
import { CollectionContext, CollectionDispatchContext } from "./context";
import { usePlaylistDispatch } from "../player/hooks";

export const useCollectionContext = () => useContext(CollectionContext);

export const useCollection = (releaseId: string) => {
  const dispatch = useCollectionDisptach();
  const context = useContext(CollectionContext);

  useEffect(() => {
    if (releaseId in context.collection) {
      return;
    }

    getTracksByAlbum(releaseId).then((res) => {
      dispatch(
        update((state) => {
          if (!res.data) {
            return state;
          }
          const newState = { ...state };
          newState.collection[releaseId] = res.data;
          return newState;
        }),
      );
    });
  }, [dispatch, context, releaseId]);

  return context.collection[releaseId];
};

export const useCollectionDisptach = () => {
  return useContext(CollectionDispatchContext);
};

/**
 * Provides declarative access to the available tracks
 */
export const useAsyncTracks = (): Track[] => {
  const { data: tracks = [] } = useAsyncValue() as Res<Track[]>;
  return tracks;
};

/**
 * Provides declarative access to the available album collection data
 */
export const useAsyncCollections = (): AlbumCollection[] => {
  const { data: collections = [] } = useAsyncValue() as Res<AlbumCollection[]>;
  return collections;
};

/**
 * Provides declarative access to track reaction toggling.
 */
export const useToggleTrackReaction = () => {
  // const trDispatch = useTracksDisptach();
  const plDispatch = usePlaylistDispatch();

  return useCallback(
    async (track?: Track) => {
      if (!track) {
        return;
      }

      const { data: reaction } = await setTrackReaction(
        track.id,
        track.liked ? ReactionType.None : ReactionType.Liked,
      );

      // trDispatch(updateTrackReaction(track.id, reaction));
      plDispatch(updateLikedTrackCount(reaction));
    },
    [plDispatch],
  );
};
