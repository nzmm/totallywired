import { VirtualList } from "@totallywired/ui-components";
import { createItems } from "../lib/dummy";

type SourceItemProps = {
  sourceName: string;
  sourceProvider: string;
  trackCount: number;
};

const sources = createItems<SourceItemProps>(3, (i) => ({
  sourceName: `SourceName ${i}`,
  sourceProvider: `SourceProvider ${i}`,
  trackCount: 6_000,
  height: 50,
}));

function SourceItem(props: SourceItemProps) {
  return (
    <div className="source">
      <div className="name">
        <a href="#">{`${props.sourceName}`}</a>
      </div>
      <div className="provider">
        <a href="#">{`${props.sourceProvider}`}</a>
      </div>
      <div className="count">
        <a href="#">{`${props.trackCount}`}</a>
      </div>
    </div>
  );
}

export default function Sources() {
  return <VirtualList items={sources} renderer={SourceItem} />;
}
