import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";
import { AlbumDetails } from "../lib/types";
import { commonReducer, createDispatchContext, set } from "../lib/reducer";
import {
  Params,
  useLocation,
  useParams
} from "react-router-dom";
import { getAlbum } from "../lib/webapi";

type ProviderType = Promise<AlbumDetails>;
const INIT_ALBUM = { id: "", name: "", artistId: "", artistName: "", year: 2000 }
const INIT_DATA: ProviderType = Promise.resolve(INIT_ALBUM);

const DataContext = createContext<ProviderType>(INIT_DATA);
const DispatchContext = createDispatchContext<ProviderType>();
const Reducer = commonReducer<ProviderType>();

export const useAlbum = () => {
  return useContext(DataContext);
};

export const albumDisptach = () => {
  return useContext(DispatchContext);
};

const loader = (
  { albumId }: Params<string>
) => {
  return getAlbum(albumId!);
};

export function AlbumProvider({ children }: React.PropsWithChildren) {
  const key = useRef<string>("");
  const location = useLocation();
  const params = useParams();
  const [promise, dispatch] = useReducer(Reducer, INIT_DATA);

  useEffect(() => {
    if (key.current !== location.key && location.pathname.includes("/albums")) {
      const p = loader(params).then((res) => {
        return res.data ?? INIT_ALBUM;
      });
      dispatch(set(p));
      key.current = location.key;
    }
  }, [location, params]);

  return (
    <DispatchContext.Provider value={dispatch}>
      <DataContext.Provider value={promise}>{children}</DataContext.Provider>
    </DispatchContext.Provider>
  );
}
