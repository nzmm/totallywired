import React, { Reducer, createContext } from "react";

type SetAction<T> = { type: "ACTION_SET_ONE"; apply: T };

type UpdateFn<T> = (existing: Readonly<T>) => T | Readonly<T>;

type UpdateAction<T> = {
  type: "ACTION_UPDATE_ONE";
  apply: UpdateFn<T>;
};

type UpdateManyAction<T> = {
  type: "ACTION_UPDATE_MANY";
  apply: UpdateFn<T>[];
};

type GenericActions<T> = UpdateManyAction<T> | UpdateAction<T> | SetAction<T>;
type GenericReducer<T> = Reducer<T, GenericActions<T>>;
export type GenericDispatch<T> = React.Dispatch<GenericActions<T>>;

const INIT_DISPATCH = () => undefined;

export function createDispatchContext<T>() {
  return createContext<GenericDispatch<T>>(INIT_DISPATCH);
}

export function commonReducer<T>(): GenericReducer<T> {
  return (obj, action) => {
    switch (action.type) {
      case "ACTION_UPDATE_ONE": {
        return action.apply(obj);
      }
      case "ACTION_UPDATE_MANY": {
        return action.apply.reduce<T>((acc, fn) => {
          acc = fn(obj);
          return acc;
        }, obj);
      }
      case "ACTION_SET_ONE": {
        return action.apply;
      }
      default: {
        throw Error("Unknown action");
      }
    }
  };
}

export function set<T>(apply: T): SetAction<T> {
  return { apply, type: "ACTION_SET_ONE" };
}

export function update<T>(apply: UpdateFn<T>): UpdateAction<T> {
  return { apply, type: "ACTION_UPDATE_ONE" };
}

export function updateMany<T>(apply: UpdateFn<T>[]): UpdateManyAction<T> {
  return { apply, type: "ACTION_UPDATE_MANY" };
}
