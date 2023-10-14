import { Splitter } from "@totallywired/ui-components";
import { Outlet } from "react-router-dom";
import Footer from "../components/shell/Footer";
import Header from "../components/shell/Header";
import Sidebar from "../components/lib/LibrarySidebar";
import PlaylistsProvider from "../components/providers/PlaylistProvider";
import CollectionProvider from "../components/providers/CollectionProvider";
import SearchInput from "../components/shell/SearchInput";
import {
  ToastProvider,
  ToastViewport,
} from "../components/vendor/radix-ui/Toast";

export default function Library() {
  return (
    <ToastProvider>
      <CollectionProvider>
        <PlaylistsProvider>
          <Header>
            <SearchInput />
          </Header>

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
      <ToastViewport />
    </ToastProvider>
  );
}
