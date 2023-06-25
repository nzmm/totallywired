import { Link } from "react-router-dom";

export default function Sidebar() {
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
