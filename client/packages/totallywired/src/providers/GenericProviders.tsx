import { providerFactory } from "./ProviderFactory";
import { User } from "../lib/types";

const INIT_USER: User = {
  userId: "",
  username: "",
  name: "",
  isAuthenticated: false,
};

const [useUser, userStore, UserProvider] = providerFactory(INIT_USER);
export { useUser, userStore, UserProvider };

