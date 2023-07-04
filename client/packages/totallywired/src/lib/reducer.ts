import React, { Reducer, createContext } from "react";

type SetAction<T> = { type: "ACTION_SET"; apply: T };
type UpdateAction<T> = { type: "ACTION_UPDATE"; apply: (existing: T) => T };

type GenericActions<T> = UpdateAction<T> | SetAction<T>;

type GenericReducer<T> = Reducer<T, GenericActions<T>>;

export type GenericDispatch<T> = React.Dispatch<GenericActions<T>>;

const INIT_DISPATCH = (_: any) => undefined;

export function createDispatchContext<T>() {
  return createContext<GenericDispatch<T>>(INIT_DISPATCH);
}

export function commonReducer<T>(): GenericReducer<T> {
  return (obj, action) => {
    switch (action.type) {
      case "ACTION_UPDATE": {
        return action.apply(obj);
      }
      case "ACTION_SET": {
        return action.apply;
      }
      default: {
        throw Error("Unknown action");
      }
    }
  };
}

export function set<T>(apply: T): SetAction<T> {
  return { apply, type: "ACTION_SET" };
}

export function update<T>(apply: (existing: T) => T): UpdateAction<T> {
  return { apply, type: "ACTION_UPDATE" };
}
