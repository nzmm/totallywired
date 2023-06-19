import { Splitter, VirtualList } from "@totallywired/ui-components";
import { TrackItem } from "./components/TrackItem";
import { NowPlaying } from "./components/NowPlaying";
import { MeMenu } from "./components/MeMenu";

import "@totallywired/ui-components/dist/cjs/totallywired.css";
import "./App.css";

const createItems = (n: number, height = 50) => {
  n = isNaN(n) ? 20 : n;
  n = Math.max(0, Math.min(n, 100_000));
  return Array(n)
    .fill(null)
    .map((_, i) => {
      return {
        height,
        label: `Item ${i + 1}`,
      };
    });
};

const tracks = createItems(6_000);

function App() {
  return (
    <>
      <header>
        <h1>Totallywired</h1>
        <MeMenu />
      </header>

      <Splitter
        orientation="horizontal"
        initialPosition="220px"
        minSize="200px"
      >
        <aside>
          <nav>
            <ul>
              <li>
                <a href="#" aria-current="page">
                  Tracks
                </a>
              </li>
              <li>
                <a href="#">Albums</a>
              </li>
              <li>
                <a href="#">Artists</a>
              </li>
              <li>
                <a href="#">Sources</a>
              </li>
            </ul>
          </nav>
        </aside>

        <main>
          <VirtualList items={tracks} renderer={TrackItem} />
        </main>
      </Splitter>

      <footer>
        <NowPlaying />
      </footer>
    </>
  );
}

export default App;
