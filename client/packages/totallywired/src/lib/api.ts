import { sendCommand, sendQuery } from "./requests";
import {
  Album,
  AlbumDetail,
  Artist,
  ProviderCollection,
  Track,
  User,
} from "./types";

const API = "/api/v1";

export function whoami() {
  return sendQuery<User>(`${API}/whoami`);
}

export function getTracks(searchParams?: URLSearchParams) {
  return sendQuery<Track[]>(`${API}/tracks`, searchParams);
}

export function getTracksByAlbum(
  releaseId: string,
  searchParams?: URLSearchParams
) {
  return sendQuery<Track[]>(
    `${API}/releases/${releaseId}/tracks`,
    searchParams
  );
}

export function getTrackByArtist(
  artistId: string,
  searchParams?: URLSearchParams
) {
  return sendQuery<Track[]>(`${API}/artists/${artistId}/tracks`, searchParams);
}

export function getTrackUrl(trackId: string) {
  return sendQuery<string>(`${API}/tracks/${trackId}/downloadUrl`);
}

export function getAlbums(searchParams?: URLSearchParams) {
  return sendQuery<Album[]>(`${API}/releases`, searchParams);
}

export function getAlbum(releaseId: string) {
  return sendQuery<AlbumDetail>(`${API}/releases/${releaseId}`);
}

export function getTracksByArtist(
  artistId: string,
  searchParams?: URLSearchParams
) {
  return sendQuery<Album[]>(`${API}/artists/${artistId}/tracks`, searchParams);
}

export function getArtists(searchParams?: URLSearchParams) {
  return sendQuery<Artist[]>(`${API}/artists`, searchParams);
}

export function getArtist(artistId: string) {
  return sendQuery<Artist>(`${API}/artists/${artistId}`);
}

export function getProviders() {
  return sendQuery<ProviderCollection[]>(`${API}/providers`);
}

export function syncProvider(sourceId: string) {
  return sendCommand(`${API}/providers/${sourceId}/sync`);
}