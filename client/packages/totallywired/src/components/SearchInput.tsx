import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

type SubmitEvent = React.FormEvent<HTMLFormElement> & { currentTarget: { q: { value: string } } }

export default function SearchInput() {
  const [searchParams, setSearchParams] = useSearchParams();

  const onSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    setSearchParams({ q: e.currentTarget.q.value });
  };

  const defaultValue = useMemo(() => {
    return searchParams.get('q') ?? '';
  }, [searchParams]);

  return (
    <form className="search-input" onSubmit={onSubmit}>
      <fieldset disabled={false}>
        <input name="q" type="text" placeholder="Search your library..." autoComplete="off" defaultValue={defaultValue}/>
      </fieldset>
    </form>
  );
}
