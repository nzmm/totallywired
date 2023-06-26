import { Gapless5 } from "@regosen/gapless-5";
import { createContext, useContext, useEffect, useState } from "react";
import { getDownloadUrl } from "../lib/requests";
import { Track } from "../lib/types";

type PlayerEvent = "track-added" | "state-change";

export enum TrackState {
  Unknown = 0,
  Queued = 1 << 0,
  PlaybackRequested = 1 << 1,
  Loading = 1 << 2,
  Loaded = 1 << 3,
  Playing = 1 << 4,
  Paused = 1 << 5,
  Stopped = 1 << 6,
  Finished = 1 << 7,
  Unloaded = 1 << 8,
  Error = 1 << 9,
}

export type PlaybackState = {
  track: Track;
  state: TrackState;
  ta?: number;
  ts?: number;
  tf?: number;
};

class AudioPlayer {
  // https://github.com/regosen/Gapless-5
  player = new Gapless5({ loadLimit: 5 });

  private history: Record<string, PlaybackState> = {};
  private handlers: Record<
    string,
    ((url: string, state: PlaybackState) => void)[]
  > = {};

  constructor() {
    const p = this.player;
    p.onloadstart = this.handleLoadStart.bind(this);
    p.onplayrequest = this.handlePlayRequest.bind(this);

    p.onload = this.handleLoad.bind(this);
    p.onunload = this.handleUnload.bind(this);
    p.onplay = this.handlePlay.bind(this);
    p.onpause = this.handlePause.bind(this);
    p.onstop = this.handleStop.bind(this);
    p.onfinishedtrack = this.handleFinishedTrack.bind(this);
  }

  private handleLoadStart(url: string) {
    const h = this.history[url];
    h.state = h.state &= ~TrackState.Unloaded;
    h.state = h.state | TrackState.Loading;
    this.handlers["state-change"]?.forEach((fn) => fn(url, h));
  }

  private handleLoad(url: string) {
    const h = this.history[url];
    h.state = h.state &= ~TrackState.Loading;
    h.state = h.state | TrackState.Loaded;
    this.handlers["state-change"]?.forEach((fn) => fn(url, h));
  }

  private handleUnload(url: string) {
    const h = this.history[url];
    h.state = h.state &= ~TrackState.Loading;
    h.state = h.state &= ~TrackState.Loaded;
    h.state = h.state | TrackState.Unloaded;
    this.handlers["state-change"]?.forEach((fn) => fn(url, h));
  }

  private handlePlayRequest(url: string) {
    const h = this.history[url];
    h.state = h.state &= ~TrackState.Stopped;
    h.state = h.state &= ~TrackState.Paused;
    h.state = h.state &= ~TrackState.Playing;
    h.state = h.state | TrackState.PlaybackRequested;
    this.handlers["state-change"]?.forEach((fn) => fn(url, h));
  }

  private handlePlay(url: string) {
    const h = this.history[url];
    h.ts = Date.now();
    h.state = h.state &= ~TrackState.PlaybackRequested;
    h.state = h.state &= ~TrackState.Paused;
    h.state = h.state &= ~TrackState.Stopped;
    h.state = h.state | TrackState.Playing;
    this.handlers["state-change"]?.forEach((fn) => fn(url, h));
  }

  private handlePause(url: string) {
    const h = this.history[url];
    h.state = h.state &= ~TrackState.PlaybackRequested;
    h.state = h.state &= ~TrackState.Playing;
    h.state = h.state | TrackState.Paused;
    this.handlers["state-change"]?.forEach((fn) => fn(url, h));
  }

  private handleStop(url: string) {
    const h = this.history[url];
    h.state = h.state &= ~TrackState.PlaybackRequested;
    h.state = h.state &= ~TrackState.Playing;
    h.state = h.state &= ~TrackState.Paused;
    h.state = h.state | TrackState.Stopped;
    this.handlers["state-change"]?.forEach((fn) => fn(url, h));
  }

  private handleFinishedTrack(url: string) {
    const h = this.history[url];
    h.tf = Date.now();
    h.state = h.state &= ~TrackState.PlaybackRequested;
    h.state = h.state &= ~TrackState.Playing;
    h.state = h.state &= ~TrackState.Paused;
    h.state = h.state &= ~TrackState.Stopped;
    h.state = h.state | TrackState.Finished;
    this.handlers["state-change"]?.forEach((fn) => fn(url, h));
  }

  addEventHandler(
    event: PlayerEvent,
    handler: (url: string, state: PlaybackState) => void
  ) {
    const handlers = this.handlers[event];
    if (!handlers?.length) {
      this.handlers[event] = [handler];
    } else {
      handlers.push(handler);
    }
  }

  removeEventHandler(
    event: PlayerEvent,
    handler: (url: string, state: PlaybackState) => void
  ) {
    const handlers = this.handlers[event];
    if (!handlers?.length) {
      return;
    } else {
      this.handlers[event] = handlers.filter((h) => h !== handler);
    }
  }

  async addTrack(track: Track) {
    if (!track?.id) {
      return;
    }

    let url = await getDownloadUrl(track.id);

    const ta = Date.now();
    url = `${url}#${ta}`;

    const h = {
      track,
      ta,
      state: TrackState.Queued,
    };

    this.history[url] = h;
    this.player.addTrack(url);
    this.handlers["track-added"]?.forEach((fn) => fn(url, h));

    this.player.play();
  }

  getQueue() {
    const h = this.history;
    const tracks = this.player.getTracks();
    return tracks.map((url) => {
      const { track, state } = h[url];
      return { track, state };
    });
  }
}

const Player = new AudioPlayer();
const PlayerContext = createContext(Player);
const QueueContext = createContext<PlaybackState[]>([]);

export const usePlayer = () => {
  return useContext(PlayerContext);
};

export const useQueue = () => {
  return useContext(QueueContext);
};

export function AudioProvider({ children }: React.PropsWithChildren) {
  const [queue, setQueue] = useState<PlaybackState[]>([]);

  useEffect(() => {
    const updateHandler = (url: string, state: PlaybackState) => {
      console.log(state);
      const q = Player.getQueue();
      setQueue(q);
    };

    Player.addEventHandler("track-added", updateHandler);
    Player.addEventHandler("state-change", updateHandler);

    return () => {
      Player.removeEventHandler("track-added", updateHandler);
      Player.removeEventHandler("state-change", updateHandler);
    };
  }, [Player]);

  return (
    <PlayerContext.Provider value={Player}>
      <QueueContext.Provider value={queue}>{children}</QueueContext.Provider>
    </PlayerContext.Provider>
  );
}
