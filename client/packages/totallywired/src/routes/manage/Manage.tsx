import { Outlet } from "react-router-dom";
import Header from "../../components/shell/Header";

export default function ManageRoot() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
