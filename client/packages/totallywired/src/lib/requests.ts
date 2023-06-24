import { Track, User } from "./types";

const API = "/api/v1";

type ApiResponse<T> = Promise<Response & { data?: T }>;

export const whoami = (): ApiResponse<User> => fetch(`${API}/whoami`);

export const getTracks = (): ApiResponse<Track> => fetch(`${API}/tracks`);
