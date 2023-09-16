import { useEffect } from "react";
import { useAsyncValue } from "react-router-dom";
import { tracksDisptach, useTracks } from "../../providers/TracksProvider";
import { set } from "../reducer";
import { Res } from "../requests";
import { AlbumDetail, ArtistDetail, Track } from "../types";

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
