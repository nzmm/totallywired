/// <reference types="vite/client" />

declare module "@regosen/gapless-5" {
  export class Gapless5 {
    constructor(opts: any);
    addTrack(url: string): void;
    play(): void;
  }
}