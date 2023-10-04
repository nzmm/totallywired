import { useCallback, useContext, useEffect } from "react";
import { useAsyncValue } from "react-router-dom";
import { set, update } from "../reducer";
import { Res } from "../requests";
import {
  AlbumCollection,
  ReactionType,
  Track,
} from "../types";
import { getTracksByAlbum, setTrackReaction } from "../api";
import { updateLikedTrackCount, updateTrackReaction } from "./actions";
import {
  CollectionContext,
  CollectionDispatchContext,
  TracksContext,
  TracksDispatchContext,
} from "./context";
import { usePlaylistDispatch } from "../player/hooks";

export const useTracks = () => {
  return useContext(TracksContext);
};

export const useTracksDisptach = () => {
  return useContext(TracksDispatchContext);
};

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
  const dispatch = useTracksDisptach();
  const tracks = useTracks();
  const { data = [] } = useAsyncValue() as Res<Track[]>;

  useEffect(() => {
    dispatch(set(data));
  }, [dispatch, data]);

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
  const trDispatch = useTracksDisptach();
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

      trDispatch(updateTrackReaction(track.id, reaction));
      plDispatch(updateLikedTrackCount(reaction));
    },
    [trDispatch, plDispatch],
  );
};
