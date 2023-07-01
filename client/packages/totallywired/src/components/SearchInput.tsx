import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

type ChangeEvent = React.ChangeEvent<HTMLInputElement> & {
  currentTarget: { value: string };
};

const onSubmit = (e: React.FormEvent) => {
  e.preventDefault();
};

export default function SearchInput() {
  const [searchParams, setSearchParams] = useSearchParams();

  const onChange = (e: ChangeEvent) => {
    e.preventDefault();
    const q = e.currentTarget.value;
    setSearchParams({ q });
  };

  const onClear = () => {
    setSearchParams({});
  };

  const value = useMemo(() => {
    return searchParams.get("q") ?? "";
  }, [searchParams]);

  return (
    <form className="search-input" onSubmit={onSubmit}>
      <input
        name="q"
        type="text"
        placeholder="Search your library..."
        autoComplete="off"
        value={value}
        onChange={onChange}
      />
      <button type="reset" disabled={!value} onClick={onClear}>
        X
      </button>
    </form>
  );
}
