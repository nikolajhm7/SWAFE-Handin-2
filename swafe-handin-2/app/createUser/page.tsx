import CreateUserScreen from "../../components/screens/manager/CreateUserScreen";
import { useAuth } from "../../providers/AuthProvider"; // this is client hook, but page is server by default

export default function Page() {
  // route files can be server components. To perform a client-side auth redirect, create a client wrapper,
  // or simply render the screen — screen will guard itself. Simpler: have the screen check auth.
  return <CreateUserScreen />;
}