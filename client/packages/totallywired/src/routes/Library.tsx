import { Splitter } from "@totallywired/ui-components";
import { Outlet } from "react-router-dom";
import Footer from "../components/shell/Footer";
import Header from "../components/shell/Header";
import Sidebar from "../components/shell/Sidebar";
import PlaylistsProvider from "../components/providers/PlaylistProvider";
import TracksProvider from "../components/providers/TracksProvider";

export default function Library() {
  return (
    <TracksProvider>
      <PlaylistsProvider>
        <Header withSearch />

        <Splitter
          orientation="horizontal"
          initialPosition="200px"
          minSize="200px"
        >
          <Sidebar />

          <main>
            <Outlet />
          </main>
        </Splitter>

        <Footer />
      </PlaylistsProvider>
    </TracksProvider>
  );
}
