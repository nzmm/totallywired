import { Link } from "react-router-dom";
import { useQueue } from "../providers/AudioProvider";

export default function Sidebar() {
  const queue = useQueue();
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
            <Link to="/lib/queue">Queue ({queue.length})</Link>
          </li>
          <li>
            <Link to="/lib/liked">Liked</Link>
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
