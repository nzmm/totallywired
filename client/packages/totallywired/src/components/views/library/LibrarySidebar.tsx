import { useAwaitingQueue, usePlaylists } from "../../../lib/player/hooks";
import Separator from "../../common/Separator";
import {
  Sidebar,
  SidebarJube,
  SidebarLink,
  SidebarSection,
} from "../../common/Sidebar";

export default function LibraySidebar() {
  const queue = useAwaitingQueue();
  const playlists = usePlaylists();
  return (
    <Sidebar>
      <SidebarSection>
        <SidebarLink to="/lib/tracks">Tracks</SidebarLink>
        <SidebarLink to="/lib/albums">Albums</SidebarLink>
        <SidebarLink to="/lib/artists">Artists</SidebarLink>
      </SidebarSection>

      <Separator />

      <SidebarSection>
        <SidebarLink to="/lib/queue">
          Queue
          <SidebarJube>{queue.length}</SidebarJube>
        </SidebarLink>
        <SidebarLink to="/lib/liked">
          Liked
          <SidebarJube>{playlists[0]?.trackCount ?? 0}</SidebarJube>
        </SidebarLink>
      </SidebarSection>
    </Sidebar>
  );
}
