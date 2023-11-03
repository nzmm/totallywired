import { useContext, useEffect, useState } from "react";
import { AudioPlayer, IS_QUEUED, PlayerTrack } from "../player";
import {
  PlayerContext,
  PlaylistsContext,
  PlaylistsDispatchContext,
  QueueContext,
} from "./context";

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

export const useCurrentTrackState = (player: AudioPlayer): PlayerTrack => {
  const [currentTrack, setCurrentTrack] = useState<PlayerTrack>(() => {
    const { track, state } = player.getCurrentTrack();
    return { track, state };
  });

  useEffect(() => {
    const stateChangeHandler = ({ track, state }: PlayerTrack) => {
      setCurrentTrack({ track, state });
    };

    player.addEventHandler("current-state-change", stateChangeHandler);
    return () => {
      player.removeEventHandler("current-state-change", stateChangeHandler);
    };
  }, [setCurrentTrack, player]);

  return currentTrack;
};
