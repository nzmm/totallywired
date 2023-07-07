import { useCallback, useState } from "react";
import { URLSearchParamsInit, useSearchParams } from "react-router-dom";
import { debounce } from "../lib/utils";
import './SearchInput.css';

type ChangeEvent = React.ChangeEvent<HTMLInputElement> & {
  currentTarget: { value: string };
};

const onSubmit = (e: React.FormEvent) => {
  e.preventDefault();
};

const updateSearchParamsDebounced = debounce(
  (q: string, setSearchParams: (next: URLSearchParamsInit) => void) => {
    setSearchParams({ q });
  },
  500
);

export default function SearchInput() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  const onChange = useCallback((e: ChangeEvent) => {
    e.preventDefault();
    const q = e.currentTarget.value;
    setQuery(q);
    updateSearchParamsDebounced(q, setSearchParams);
  }, []);

  const onClear = () => {
    const q = ''
    setQuery(q);
    updateSearchParamsDebounced(q, setSearchParams);
  };

  return (
    <form className="search-input" onSubmit={onSubmit}>
      <input
        name="q"
        type="text"
        placeholder="Search your library..."
        autoComplete="off"
        value={query}
        onChange={onChange}
      />
      <button type="reset" disabled={!query} onClick={onClear}>
        X
      </button>
    </form>
  );
}
