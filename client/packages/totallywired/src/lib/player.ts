import { Gapless5 } from "@regosen/gapless-5";
import { getTrackUrl } from "../lib/requests";
import { Track } from "../lib/types";

type PlayerEvent = "tracks-changed" | "state-change" | "current-state-change";

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

type History = Record<string, PlaybackState>;
type Handlers = Record<string, ((url: string, state: PlaybackState) => void)[]>;

export class AudioPlayer {
  /*
   *
   * https://github.com/regosen/Gapless-5
   *
   */
  player = new Gapless5({ loadLimit: 5 });

  private _history: History = {};
  private _handlers: Handlers = {};

  private _currentUrl: string = "";

  constructor() {
    const p = this.player;
    p.onloadstart = this._handleLoadStart.bind(this);
    p.onplayrequest = this._handlePlayRequest.bind(this);

    p.onload = this._handleLoad.bind(this);
    p.onunload = this._handleUnload.bind(this);
    p.onplay = this._handlePlay.bind(this);
    p.onpause = this._handlePause.bind(this);
    p.onstop = this._handleStop.bind(this);
    p.onfinishedtrack = this._handleFinishedTrack.bind(this);
  }

  private _emitStateChange(_: string, url: string, h: PlaybackState) {
    this._handlers["state-change"]?.forEach((fn) => fn(url, h));
    if (this._currentUrl === url) {
      this._handlers["current-state-change"]?.forEach((fn) => fn(url, h));
    }
  }

  private _handleLoadStart(url: string) {
    const h = this._history[url];
    h.state &= ~TrackState.Unloaded;
    h.state |= TrackState.Loading;
    this._emitStateChange("loadstart", url, h);
  }

  private _handleLoad(url: string) {
    const h = this._history[url];
    h.state &= ~TrackState.Unloaded;
    h.state &= ~TrackState.Loading;
    h.state |= TrackState.Loaded;
    this._emitStateChange("load", url, h);
  }

  private _handleUnload(url: string) {
    const h = this._history[url];
    h.state &= ~TrackState.Loading;
    h.state &= ~TrackState.Loaded;
    h.state |= TrackState.Unloaded;
    this._emitStateChange("unload", url, h);
  }

  private _handlePlayRequest(url: string) {
    this._currentUrl = url;
    const h = this._history[url];
    h.state &= ~TrackState.Queued;
    h.state &= ~TrackState.Stopped;
    h.state &= ~TrackState.Paused;
    h.state &= ~TrackState.Playing;
    h.state |= TrackState.PlaybackRequested;
    this._emitStateChange("playrequested", url, h);
  }

  private _handlePlay(url: string) {
    this._currentUrl = url;
    const h = this._history[url];
    h.ts = Date.now();
    h.state &= ~TrackState.PlaybackRequested;
    h.state &= ~TrackState.Queued;
    h.state &= ~TrackState.Paused;
    h.state &= ~TrackState.Stopped;
    h.state |= TrackState.Playing;
    this._emitStateChange("play", url, h);
  }

  private _handlePause(url: string) {
    const h = this._history[url];
    h.state &= ~TrackState.PlaybackRequested;
    h.state &= ~TrackState.Playing;
    h.state |= TrackState.Paused;
    this._emitStateChange("pause", url, h);
  }

  private _handleStop(url: string) {
    const h = this._history[url];
    h.state &= ~TrackState.PlaybackRequested;
    h.state &= ~TrackState.Playing;
    h.state &= ~TrackState.Paused;
    h.state |= TrackState.Stopped;
    this._emitStateChange("stop", url, h);
  }

  private _handleFinishedTrack(url: string) {
    const h = this._history[url];
    h.tf = Date.now();
    h.state &= ~TrackState.PlaybackRequested;
    h.state &= ~TrackState.Playing;
    h.state &= ~TrackState.Paused;
    h.state &= ~TrackState.Stopped;
    h.state |= TrackState.Finished;
    this._emitStateChange("trackfinished", url, h);
  }

  private async _add(track: Track) {
    if (!track?.id) {
      return { ok: true, url: "" };
    }

    let url = await getTrackUrl(track.id);

    const ta = Date.now();
    url = `${url}#${ta}`;

    const h = {
      track,
      ta,
      state: TrackState.Queued,
    };

    if (!this._currentUrl) {
      this._currentUrl = url;
    }

    this._history[url] = h;
    this.player.addTrack(url);
    this._handlers["tracks-changed"]?.forEach((fn) => fn(url, h));

    return { ok: true, url };
  }

  addEventHandler(
    event: PlayerEvent,
    handler: (url: string, state: PlaybackState) => void
  ) {
    const handlers = this._handlers[event];
    if (!handlers?.length) {
      this._handlers[event] = [handler];
    } else {
      handlers.push(handler);
    }
  }

  removeEventHandler(
    event: PlayerEvent,
    handler: (url: string, state: PlaybackState) => void
  ) {
    const handlers = this._handlers[event];
    if (!handlers?.length) {
      return;
    } else {
      this._handlers[event] = handlers.filter((h) => h !== handler);
    }
  }

  async addTrack(track: Track) {
    const { ok, url } = await this._add(track);

    if (!ok) {
      return;
    }

    const { state } = this.getCurrentState();

    if ((state & (TrackState.PlaybackRequested | TrackState.Playing | TrackState.Paused)) === 0) {
      if (this._currentUrl !== url) {
        this._currentUrl = url;
        this.player.gotoTrack(url);
      }
      this.player.play();
    }
  }

  async playNow(track: Track) {
    const { ok, url } = await this._add(track);

    if (!ok) {
      return;
    }

    if (!this._currentUrl) {
      this.player.play();
      return;
    }

    this.player.gotoTrack(url);
    this.player.play();
  }

  playPause() {
    this.player.playpause();
  }

  prev() {
    this.player.prev();
  }

  next() {
    this.player.next();
  }

  getCurrentState() {
    return this._history[this._currentUrl];
  }

  getPosition() {
    return this.player.getPosition();
  }

  getProgress() {
    return this.getPosition() / this.player.currentLength();
  }

  getQueue() {
    const h = this._history;
    const tracks = this.player.getTracks();
    return tracks.map((url) => {
      const { track, state } = h[url];
      return { track, state };
    });
  }
}
