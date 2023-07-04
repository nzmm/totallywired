import { Outlet } from "react-router-dom";
import { Splitter } from "@totallywired/ui-components";
import { TracksProvider } from "../providers/TracksProvider";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";

export default function Library() {
  return (
    <TracksProvider>
      <Header />

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
    </TracksProvider>
  );
}
