import { Splitter } from "@totallywired/ui-components";
import { Outlet } from "react-router-dom";
import Footer from "../components/shell/Footer";
import Header from "../components/shell/Header";
import Sidebar from "../components/shell/Sidebar";
import PlaylistsProvider from "../components/providers/PlaylistProvider";
import CollectionProvider from "../components/providers/CollectionProvider";

export default function Library() {
  return (
    <CollectionProvider>
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
    </CollectionProvider>
  );
}
