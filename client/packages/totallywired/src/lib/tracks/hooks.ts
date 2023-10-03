import { useCallback, useContext, useEffect } from "react";
import { useAsyncValue } from "react-router-dom";
import { set, update } from "../reducer";
import { Res } from "../requests";
import {
  AlbumCollection,
  AlbumDetail,
  ArtistDetail,
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
 * Provides declarative access to the available tracks
 */
export const useAsyncCollection = (): AlbumCollection[] => {
  const { data = [] } = useAsyncValue() as Res<AlbumCollection[]>;
  return data;
};

/**
 * Provides declarative access to the available album details and the associated tracks
 */
export const useAsyncAlbumTracks = (): [AlbumDetail, Track[]] => {
  const [{ data: album }, { data: trackData = [] }] = useAsyncValue() as [
    Res<AlbumDetail>,
    Res<Track[]>,
  ];

  if (!album) {
    throw new Error("album not found");
  }

  const dispatch = useTracksDisptach();
  const tracks = useTracks();

  useEffect(() => {
    dispatch(set(trackData));
  }, [dispatch, trackData]);

  return [album, tracks];
};

/**
 * Provides declarative access to the available artist details and the associated tracks
 */
export const useAsyncArtistTracks = (): [ArtistDetail, Track[]] => {
  const [{ data: artist }, { data: trackData = [] }] = useAsyncValue() as [
    Res<ArtistDetail>,
    Res<Track[]>,
  ];

  if (!artist) {
    throw new Error("artist not found");
  }

  const dispatch = useTracksDisptach();
  const tracks = useTracks();

  useEffect(() => {
    dispatch(set(trackData));
  }, [dispatch, trackData]);

  return [artist, tracks];
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
