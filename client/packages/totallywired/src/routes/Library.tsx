import { Outlet, Link } from "react-router-dom";
import { Splitter } from "@totallywired/ui-components";

import NowPlaying from "../lib/components/NowPlaying";
import PlaybackControls from "../lib/components/PlaybackControls";
import OutputControls from "../lib/components/OutputControls";
import Header from "../lib/components/Header";

export default function Library() {
  return (
    <>
      <Header />

      <Splitter
        orientation="horizontal"
        initialPosition="200px"
        minSize="200px"
      >
        <aside>
          <nav>
            <ul>
              <li>
                <Link to="/lib/tracks">Tracks</Link>
              </li>
              <li>
                <Link to="/lib/albums">Albums</Link>
              </li>
              <li>
                <Link to="/lib/artists">Artists</Link>
              </li>
              <hr />
              <li>
                <Link to="/lib/queue">Queue</Link>
              </li>
              <li>
                <Link to="/lib/liked">Liked</Link>
              </li>
              <hr />
              <li>
                <Link to="/providers">Content Providers</Link>
              </li>
            </ul>
          </nav>
        </aside>

        <main>
          <Outlet />
        </main>
      </Splitter>

      <footer>
        <NowPlaying />
        <PlaybackControls />
        <OutputControls />
      </footer>
    </>
  );
}
