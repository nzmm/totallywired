import { useCallback, useEffect, useState } from "react";
import { SetURLSearchParams, useSearchParams } from "react-router-dom";
import { Cross2Icon } from "@radix-ui/react-icons";
import {
  useScrollRestoration,
  ScrollRestoration,
} from "@totallywired/ui-components";
import { debounce } from "../../../lib/utils";
import "./SearchInput.css";

type ChangeEvent = React.ChangeEvent<HTMLInputElement> & {
  currentTarget: { value: string };
};

const onSubmit = (e: React.FormEvent) => {
  e.preventDefault();
};

const updateSearchParamsDebounced = debounce(
  (
    q: string,
    setSearchParams: SetURLSearchParams,
    restoration: ScrollRestoration,
    restorationKey: string,
  ) => {
    restoration.preventScrollRestoration(restorationKey);
    setSearchParams((prev) => {
      prev.set("q", q);
      return prev;
    });
  },
  500,
);

export default function SearchInput() {
  const restoration = useScrollRestoration();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  const onChange = useCallback(
    (e: ChangeEvent) => {
      e.preventDefault();
      const q = e.currentTarget.value;
      setQuery(q);
      updateSearchParamsDebounced(
        q,
        setSearchParams,
        restoration,
        restoration.getKey(),
      );
    },
    [restoration, setSearchParams],
  );

  const onClear = () => {
    const key = restoration.getKey();
    restoration.preventScrollRestoration(key);
    setQuery("");
    setSearchParams((prev) => {
      prev.delete("q");
      return prev;
    });
  };

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  return (
    <div id="global-search-input">
      <form onSubmit={onSubmit}>
        <input
          name="q"
          type="text"
          placeholder="Search"
          autoComplete="off"
          value={query}
          onChange={onChange}
        />
        <button type="reset" disabled={!query} onClick={onClear}>
          <Cross2Icon />
        </button>
      </form>
    </div>
  );
}
