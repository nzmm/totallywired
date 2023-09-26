import { useCallback, useContext, useEffect } from "react";
import { useAsyncValue } from "react-router-dom";
import { set } from "../reducer";
import { Res } from "../requests";
import { AlbumDetail, ArtistDetail, ReactionType, Track } from "../types";
import { setTrackReaction } from "../api";
import { updateLikedTrackCount, updateTrackReaction } from "./actions";
import { TracksContext, TracksDispatchContext } from "./context";
import { usePlaylistDispatch } from "../player/hooks";

export const useTracks = () => {
  return useContext(TracksContext);
};

export const useTracksDisptach = () => {
  return useContext(TracksDispatchContext);
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
