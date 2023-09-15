import { Link } from "react-router-dom";
import { useAwaitingQueue } from "../providers/AudioProvider";
import "./styles/Sidebar.css";

export default function Sidebar() {
  const queue = useAwaitingQueue();
  return (
    <aside>
      <nav>
        <menu>
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
            <span className="jube">{queue.length}</span>
          </li>
          <li>
            <Link to="/lib/liked">Liked</Link>
            <span className="jube">{0}</span>
          </li>
          <hr />
          <li>
            <Link to="/lib/providers">Content Providers</Link>
          </li>
        </menu>
      </nav>
    </aside>
  );
}
