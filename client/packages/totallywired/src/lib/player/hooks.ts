import { useContext, useEffect, useState } from "react";
import { AudioPlayer, IS_QUEUED, PlayerTrack, TrackState } from "../player";
import {
  PlayerContext,
  PlaylistsContext,
  PlaylistsDispatchContext,
  QueueContext,
} from "./context";
import { Track } from "../types";

export const usePlayer = () => {
  return useContext(PlayerContext);
};

export const useQueue = () => {
  return useContext(QueueContext);
};

export const useAwaitingQueue = () => {
  return useContext(QueueContext).filter((qi) => qi.state & IS_QUEUED);
};

export const usePlaylists = () => {
  return useContext(PlaylistsContext);
};

export const usePlaylistDispatch = () => {
  return useContext(PlaylistsDispatchContext);
};

export const useCurrentTrackState = (
  player: AudioPlayer,
): [Track | undefined, TrackState] => {
  const [currentState, setCurrentState] = useState<TrackState>(
    TrackState.Unknown,
  );
  const [currentTrack, setCurrentTrack] = useState<Track | undefined>(
    undefined,
  );

  useEffect(() => {
    const stateChangeHandler = ({ state, track }: PlayerTrack) => {
      setCurrentState(state);
      setCurrentTrack(track);
    };

    player.addEventHandler("current-state-change", stateChangeHandler);
    return () => {
      player.removeEventHandler("current-state-change", stateChangeHandler);
    };
  }, [player]);

  return [currentTrack, currentState];
};
