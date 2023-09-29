import { NavLink } from "react-router-dom";
import { useAwaitingQueue, usePlaylists } from "../../lib/player/hooks";
import "./Sidebar.css";

type NavLinkClassNamer = (props: {
  isActive: boolean;
  isPending: boolean;
}) => string;

const classNamer: NavLinkClassNamer = ({ isActive }) =>
  isActive ? "list selector active" : "list selector";

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
        </menu>
        <div className="spacer"></div>
        <menu>
          <li>
            <NavLink to="/lib/queue" className={classNamer}>
              Queue
              <span className="jube">{queue.length}</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/lib/liked" className={classNamer}>
              Liked
              <span className="jube">{playlists[0]?.trackCount ?? 0}</span>
            </NavLink>
          </li>
        </menu>
        <div className="spacer"></div>
        <menu>
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
