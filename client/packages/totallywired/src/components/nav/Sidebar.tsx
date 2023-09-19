import { NavLink } from "react-router-dom";
import { useAwaitingQueue } from "../../providers/AudioProvider";
import { usePlaylists } from "../../providers/PlaylistProvider";
import "./Sidebar.css";

const classNamer = ({ isActive }: { isActive: boolean }) =>
  isActive ? "active" : "";

export default function Sidebar() {
  const queue = useAwaitingQueue();
  const playlists = usePlaylists();
  return (
    <aside>
      <nav>
        <menu>
          <li>
            <NavLink to="/lib/tracks" className={classNamer}>
              Tracks
            </NavLink>
          </li>
          <li>
            <NavLink to="/lib/albums" className={classNamer}>
              Albums
            </NavLink>
          </li>
          <li>
            <NavLink to="/lib/artists" className={classNamer}>
              Artists
            </NavLink>
          </li>
          <hr />
          <li>
            <NavLink to="/lib/queue" className={classNamer}>
              Queue
            </NavLink>
            <span className="jube">{queue.length}</span>
          </li>
          <li>
            <NavLink to="/lib/liked" className={classNamer}>
              Liked
            </NavLink>
            <span className="jube">{playlists[0]?.trackCount ?? 0}</span>
          </li>
          <hr />
          <li>
            <NavLink to="/lib/providers" className={classNamer}>
              Content Providers
            </NavLink>
          </li>
        </menu>
      </nav>
    </aside>
  );
}
