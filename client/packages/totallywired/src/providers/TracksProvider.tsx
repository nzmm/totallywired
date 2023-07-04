import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef
} from "react";
import { Track } from "../lib/types";
import { commonReducer, createDispatchContext, set } from "../lib/reducer";
import { Params, useLocation, useParams, useSearchParams } from "react-router-dom";
import { getTracksByAlbum, getTrackByArtist, getTracks } from "../lib/webapi";
import { getValidSearchParams } from "../lib/utils";

type ProviderType = Promise<Track[]>;
const INIT_DATA: ProviderType = Promise.resolve([]);

const DataContext = createContext<ProviderType>(INIT_DATA);
const DispatchContext = createDispatchContext<ProviderType>();
const Reducer = commonReducer<ProviderType>();

export const useTracks = () => {
  return useContext(DataContext);
};

export const tracksDisptach = () => {
  return useContext(DispatchContext);
};

const loader = (
  { albumId, artistId }: Params<string>,
  searchParams?: URLSearchParams
) => {
  const validSearchParams = getValidSearchParams(searchParams);
  return albumId
    ? getTracksByAlbum(albumId, validSearchParams)
    : artistId
    ? getTrackByArtist(artistId, validSearchParams)
    : getTracks(validSearchParams);
};

export function TracksProvider({ children }: React.PropsWithChildren) {
  const key = useRef<string>("");
  const location = useLocation();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const [promise, dispatch] = useReducer(Reducer, INIT_DATA);

  useEffect(() => {
    if (key.current !== location.key && location.pathname.includes("/tracks")) {
      const p = loader(params, searchParams).then((res) => res.data ?? []);
      dispatch(set(p));
      key.current = location.key;
    }
  }, [location, params, searchParams]);

  return (
    <DispatchContext.Provider value={dispatch}>
      <DataContext.Provider value={promise}>{children}</DataContext.Provider>
    </DispatchContext.Provider>
  );
}
