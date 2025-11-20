import { RequireRole } from "@/components/auth/RequireRole";

export default function ManagerScreen() {
  return (
    <RequireRole allowed={["manager"]}>
        <h1>Manager Screen</h1>
    </RequireRole>
  )
}