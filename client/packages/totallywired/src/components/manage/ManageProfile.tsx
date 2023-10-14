import { useUser } from "../../lib/users/hooks";
import { Avatar } from "../vendor/radix-ui/Avatar";
import "./ManageProfile.css";

export default function ManageProfile() {
  const user = useUser();

  if (!user) {
    return null;
  }

  return (
    <section id="my-profile">
      <Avatar src={`/avatars/${user.id}.jpg`} name={user.name} />
      <h1>Welcome, {user.name}</h1>
      <p>Manage your info and application settings.</p>
    </section>
  );
}
