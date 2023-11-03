import { Outlet } from "react-router-dom";
import Header from "../../components/views/shell/Header";

export default function ManageRoot() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
