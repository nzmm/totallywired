import { Reducer, createContext, useContext, useMemo, useReducer } from "react";

type GenericActions<T> =
  | { type: "update"; apply: (existing: T) => T }
  | { type: "set"; apply: T };

type GenericReducer<T> = Reducer<T, GenericActions<T>>;

type FactoryResult<T> = [
  () => T,
  () => { set: (apply: T) => void; update: (apply: (existing: T) => T) => void; },
  ({ children }: React.PropsWithChildren) => JSX.Element
];

export function providerFactory<T>(init: T): FactoryResult<T> {
  const reducer: GenericReducer<T> = (obj, action) => {
    switch (action.type) {
      case "update": {
        return action.apply(obj);
      }
      case "set": {
        return action.apply;
      }
      default: {
        throw Error("Unknown action");
      }
    }
  };

  const Context = createContext<T>(init);
  const DispatchContext = createContext<React.Dispatch<GenericActions<T>>>((_) => undefined);

  const useGeneric = () => {
    return useContext(Context);
  };

  const useStore = () => {
    const dc = useContext(DispatchContext);
    
    const actions = useMemo(() => ({
      set: (apply: T) => dc({ type: 'set', apply }),
      update: (apply: (existing: T) => T) => dc({ type: 'update', apply }) 
    }), [dc]);

    return actions;
  };

  const Provider = ({ children }: React.PropsWithChildren) => {
    const [object, dispatch] = useReducer(reducer, init);
    return (
      <Context.Provider value={object}>
        <DispatchContext.Provider value={dispatch}>
          {children}
        </DispatchContext.Provider>
      </Context.Provider>
    );
  };

  return [useGeneric, useStore, Provider];
}
