import { getTrackUrl } from "./webapi";
import { Track } from "../lib/types";

type PlayerEvent = "tracks-changed" | "state-change" | "current-state-change";

export enum TrackState {
  Unknown = 0,
  Queued = 1 << 0,
  Loading = 1 << 1,
  Loaded = 1 << 2,
  Playing = 1 << 3,
  Paused = 1 << 4,
  Finished = 1 << 5,
  Error = 1 << 6,
}

export type QueuedTrack = {
  track: Track;
  state: TrackState;
  src: string;
  id: number;
  ta: Date;
  i: number;
};

type Queue = number[];
type History = Record<number, QueuedTrack>;
type Handlers = Record<string, ((state: QueuedTrack) => void)[]>;

export const TRACK_STATE_ARRAY = [
  TrackState.Unknown,
  TrackState.Queued,
  TrackState.Loading,
  TrackState.Loaded,
  TrackState.Playing,
  TrackState.Paused,
  TrackState.Finished,
  TrackState.Error,
];

export class AudioPlayer {
  player0!: HTMLAudioElement;
  player1!: HTMLAudioElement;

  private _queue: Queue = [];
  private _history: History = {};
  private _handlers: Handlers = {};

  private _timeout = -1;
  private _currentId: number = 0;

  init() {
    if (this.player0 && this.player1) {
      return;
    }

    this.player0 = new Audio();
    this.player1 = new Audio();

    this.player0.preload = "auto";
    this.player1.preload = "auto";

    this.player0.onloadstart = this._handleLoadStart.bind(this);
    this.player1.onloadstart = this._handleLoadStart.bind(this);

    this.player0.oncanplay = this._handleCanPlay.bind(this);
    this.player1.oncanplay = this._handleCanPlay.bind(this);

    this.player0.onplay = this._handlePlay.bind(this);
    this.player1.onplay = this._handlePlay.bind(this);

    this.player0.onplaying = this._handlePlaying.bind(this);
    this.player1.onplaying = this._handlePlaying.bind(this);

    this.player0.onpause = this._handlePause.bind(this);
    this.player1.onpause = this._handlePause.bind(this);

    this.player0.onended = this._handleEnded.bind(this);
    this.player1.onended = this._handleEnded.bind(this);
  }

  private _playerFromEvent(e: Event) {
    return e.target as HTMLAudioElement;
  }

  private _setupPreload(player: HTMLAudioElement) {
    clearTimeout(this._timeout);

    const remaining = player.duration - player.currentTime;
    const preloadDelayMs = Math.max(remaining / 2, remaining - 10) * 1000;

    console.log({ preloadDelayMs });

    this._timeout = window.setTimeout(() => {
      const qt = this._history[parseInt(player.id)];
      const nextId = this._queue[qt.i + 1];

      if (!nextId) {
        return;
      }

      const { track } = this._history[nextId];
      console.log(`${track.name}: preloading...`);

      const altPlayer = this._getNextPlayer();
      altPlayer.id = nextId.toString();
      altPlayer.src = this._history[nextId].src;
    }, preloadDelayMs);
  }

  private _emitStateChange(_: string, qt: QueuedTrack) {
    this._handlers["state-change"]?.forEach((fn) => fn(qt));
    if (this._currentId === qt.id) {
      this._handlers["current-state-change"]?.forEach((fn) => fn(qt));
    }
  }

  private _handlePlay(e: Event) {
    const player = this._playerFromEvent(e);
    this._currentId = parseInt(player.id);

    const qt = this._history[this._currentId];
    qt.state &= ~TrackState.Queued;
    qt.state &= ~TrackState.Paused;
    qt.state |= TrackState.Playing;
    this._emitStateChange("play", qt);
  }

  private _handlePlaying(e: Event) {
    const player = this._playerFromEvent(e);
    this._setupPreload(player);
  }

  private _handlePause(e: Event) {
    clearTimeout(this._timeout);

    const player = this._playerFromEvent(e);
    if (!player.src) {
      return;
    }

    const qt = this._history[parseInt(player.id)];
    qt.state &= ~TrackState.Playing;
    qt.state |= TrackState.Paused;
    this._emitStateChange("pause", qt);
  }

  private async _handleEnded(e: Event) {
    const player = this._playerFromEvent(e);
    this._playNext(player);
  }

  private _handleLoadStart(e: Event) {
    const player = this._playerFromEvent(e);
    const qt = this._history[parseInt(player.id)];
    qt.state |= TrackState.Loading;
    this._emitStateChange("loadstart", qt);
  }

  private _handleCanPlay(e: Event) {
    const player = this._playerFromEvent(e);
    const qt = this._history[parseInt(player.id)];
    qt.state &= ~TrackState.Loading;
    qt.state |= TrackState.Loaded;
    this._emitStateChange("canplay", qt);
  }

  // private _handlePrev(fromUrl: string, toUrl: string) {
  //   const h = this._history[fromUrl];
  //   h.tf = Date.now();
  //   h.state &= ~TrackState.PlaybackRequested;
  //   h.state &= ~TrackState.Playing;
  //   h.state &= ~TrackState.Paused;
  //   h.state |= TrackState.Skipped;
  //   this._emitStateChange("skip", fromUrl, h);
  //   this._currentUrl = toUrl;
  // }

  // private _handleNext(fromUrl: string, toUrl: string) {
  //   const h = this._history[fromUrl];
  //   h.state = TrackState.Finished;
  //   this._emitStateChange("next", fromUrl, h);
  //   this._currentUrl = toUrl;
  // }

  private async _getUrl(track: Track, ts: number) {
    let url = await getTrackUrl(track.id);
    return `${url}#${ts}`;
  }

  private _getPlayer() {
    return this._currentId.toString() === this.player0.id
      ? this.player0
      : this.player1;
  }

  private _getNextPlayer() {
    return this._currentId.toString() === this.player0.id
      ? this.player1
      : this.player0;
  }

  private async _play(player: HTMLAudioElement, id: number) {
    this._currentId = id;

    const { src } = this._history[id];
    const idStr = id.toString();

    if (player.id !== idStr) {
      player.id = idStr;
    }
    if (player.src !== src) {
      player.src = src;
    }

    await player.play();
  }

  private async _playNext(currentPlayer: HTMLAudioElement) {
    const qt = this.getCurrentState();

    if (qt.i >= 0) {
      currentPlayer.pause();
      currentPlayer.removeAttribute("src");

      qt.state = TrackState.Finished;
      this._emitStateChange("ended", qt);
    }

    const nextId = this._queue[qt.i + 1];
    if (!nextId) {
      // finished all
      return;
    }

    const nextPlayer = this._getNextPlayer();
    await this._play(nextPlayer, nextId);
  }

  async addTrack(track: Track) {
    this.init();

    const i = this._queue.length;
    const ta = new Date();
    const id = ta.getTime();
    const src = await this._getUrl(track, id);

    this._queue.push(id);

    const qt = (this._history[id] = {
      state: TrackState.Queued,
      track,
      src,
      id,
      ta,
      i,
    });

    this._handlers["tracks-changed"]?.forEach((fn) => fn(qt));

    if (i === 0) {
      const player = this._getPlayer();
      await this._play(player, id);
    }

    return src;
  }

  async playNow(track: Track) {
    this.init();

    const { i } = this.getCurrentState();
    const ta = new Date();
    const id = ta.getTime();
    const src = await this._getUrl(track, id);

    this._queue.splice(i + 1, 0, id);

    const qt = (this._history[id] = {
      state: TrackState.Queued,
      track,
      src,
      ta,
      id,
      i: i + 1,
    });

    this._handlers["tracks-changed"]?.forEach((fn) => fn(qt));

    const player = this._getPlayer();
    await this._playNext(player);

    return src;
  }

  async playPause() {
    const player = this._getPlayer();
    if (!player) {
      console.warn("Player not initialised");
      return;
    }

    const { state } = this.getCurrentState();

    if (state & TrackState.Unknown) {
      return;
    }
    if (state & TrackState.Playing) {
      player.pause();
    } else {
      await player.play();
    }
  }

  async prev() {
    const player = this._getPlayer();
    if (!player) {
      console.warn("Player not initialised");
      return;
    }

    //await this._playPrev(player);
  }

  async next() {
    const player = this._getPlayer();
    if (!player) {
      console.warn("Player not initialised");
      return;
    }

    await this._playNext(player);
  }

  swap(fromIndex: number, toIndex: number) {
    // if (!this.player) {
    //   return;
    // }
    // this._handlers["tracks-changed"]?.forEach((fn) =>
    //   fn(url, this._history[url])
    // );
  }

  getCurrentState(): QueuedTrack {
    return (
      this._history[this._currentId] ?? { i: -1, state: TrackState.Unknown }
    );
  }

  getProgress() {
    const player = this._getPlayer();
    return player.currentTime / player.duration;
  }

  getQueue() {
    const history = this._history;
    return this._queue.map((src) => history[src]);
  }

  addEventHandler(event: PlayerEvent, handler: (qt: QueuedTrack) => void) {
    const handlers = this._handlers[event];
    if (!handlers?.length) {
      this._handlers[event] = [handler];
    } else {
      handlers.push(handler);
    }
  }

  removeEventHandler(event: PlayerEvent, handler: (qt: QueuedTrack) => void) {
    const handlers = this._handlers[event];
    if (!handlers?.length) {
      return;
    } else {
      this._handlers[event] = handlers.filter((h) => h !== handler);
    }
  }
}
