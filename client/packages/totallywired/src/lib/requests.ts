import { sendQuery, sendCommand } from "./requests.common";
import { ProviderCollection, Track, User } from "./types";

const API = "/api/v1";

export const whoami = () => sendQuery<User>(`${API}/whoami`);

export const getTracks = () => sendQuery<Track[]>(`${API}/tracks`);

export const getDownloadUrl = (trackId: string) =>
  sendQuery<string>(`${API}/tracks/${trackId}/downloadUrl`);

export const getProviders = () =>
  sendQuery<ProviderCollection[]>(`${API}/providers`);

export const syncProvider = async (sourceId: string) =>
  sendCommand(`${API}/providers/${sourceId}/sync`);
