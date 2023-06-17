import { Splitter, VirtualList } from "@totallywired/ui-components";

import "@totallywired/ui-components/dist/cjs/totallywired.css";
import './App.css';

const createItems = (n: number, height = 50) => {
  n = isNaN(n) ? 20 : n;
  n = Math.max(0, Math.min(n, 100_000));
  return Array(n)
    .fill(null)
    .map((_, i) => {
      return {
        height,
        label: `Item ${i + 1}`      };
    });
};

const tracks = createItems(10_000);

const ListItem = (props: any)  => {
  return <div className="track">{`track > ${props.label}`}</div>
}

function App() {
  return (
    <>
      <header>
        <h1>Totallywired</h1>
      </header>
      <Splitter orientation="horizontal" initialPosition="220px" minSize="200px">
        <aside>
          <p>Aside</p>
        </aside>
        <main>
          <VirtualList items={tracks} renderer={ListItem} />
        </main>
      </Splitter>
      <footer>

      </footer>
    </>
  )
}

export default App
