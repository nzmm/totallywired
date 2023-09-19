import { useCallback, useEffect } from "react";
import { useAsyncValue } from "react-router-dom";
import { tracksDisptach, useTracks } from "../../providers/TracksProvider";
import { set, update } from "../reducer";
import { Res } from "../requests";
import {
  AlbumDetail,
  ArtistDetail,
  Playlist,
  ReactionType,
  Track,
} from "../types";
import { playlistsDispatch } from "../../providers/PlaylistProvider";
import { setTrackReaction } from "../api";

/**
 * Provides declarative access to the available tracks
 */
export const useAsyncTracks = (): Track[] => {
  const { data = [] } = useAsyncValue() as Res<Track[]>;
  const dispatch = tracksDisptach();
  const tracks = useTracks();

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

  const dispatch = tracksDisptach();
  const tracks = useTracks();

  useEffect(() => {
    dispatch(set(trackData));
  }, [dispatch, trackData]);

  return [album!, tracks];
};

/**
 * Provides declarative access to the available artist details and the associated tracks
 */
export const useAsyncArtistTracks = (): [ArtistDetail, Track[]] => {
  const [{ data: artist }, { data: trackData = [] }] = useAsyncValue() as [
    Res<ArtistDetail>,
    Res<Track[]>,
  ];

  const dispatch = tracksDisptach();
  const tracks = useTracks();

  useEffect(() => {
    dispatch(set(trackData));
  }, [dispatch, trackData]);

  return [artist!, tracks];
};

const trackReaction = (tracks: Track[], ...args: [string, ReactionType]) => {
  const [trackId, reaction] = args;
  return tracks.map((t) =>
    t.id !== trackId ? t : { ...t, liked: reaction === ReactionType.Liked },
  );
};

const adjustLikedTrackCount = (
  playlists: Playlist[],
  reaction: ReactionType,
) => {
  const [liked, ...rest] = playlists;

  if (!liked) {
    return playlists;
  }

  const trackCount =
    liked.trackCount + (reaction === ReactionType.Liked ? 1 : -1);
  return [{ ...liked, trackCount }, ...rest];
};

/**
 * Provides declarative access to track reaction toggling.
 */
export const useToggleTrackReaction = () => {
  const trDispatch = tracksDisptach();
  const plDispatch = playlistsDispatch();

  return useCallback(
    async (track?: Track) => {
      if (!track) {
        return;
      }

      const { data: reaction } = await setTrackReaction(
        track.id,
        track.liked ? ReactionType.None : ReactionType.Liked,
      );

      trDispatch(update(trackReaction, track.id, reaction));
      plDispatch(update(adjustLikedTrackCount, reaction));
    },
    [trDispatch, plDispatch],
  );
};
