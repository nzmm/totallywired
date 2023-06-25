import { Outlet } from "react-router-dom";
import { Splitter } from "@totallywired/ui-components";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";

export default function Library() {
  return (
    <>
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
    </>
  );
}
