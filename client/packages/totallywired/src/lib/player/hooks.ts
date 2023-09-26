import { useContext } from "react";
import { IS_QUEUED } from "../player";
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
