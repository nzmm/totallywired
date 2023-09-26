import { createContext } from "react";
import { commonReducer, createDispatchContext } from "../reducer";
import { PlayerTrack, AudioPlayer } from "../player";
import { PlaylistItem } from "../playlist";
import { Playlist } from "../types";

export const INIT_QUEUE: PlaylistItem<PlayerTrack>[] = [];
export const Player = new AudioPlayer();
export const PlayerContext = createContext(Player);
export const QueueContext =
  createContext<PlaylistItem<PlayerTrack>[]>(INIT_QUEUE);

export const INIT_PLAYLISTS: Playlist[] = [];
export const PlaylistsContext = createContext<Playlist[]>(INIT_PLAYLISTS);
export const PlaylistsDispatchContext = createDispatchContext<Playlist[]>();
export const Reducer = commonReducer<Playlist[]>();
