import { RequireRole } from "@/components/auth/RequireRole";

export default function ClientScreen() {
  return (
    <RequireRole allowed={["client"]}>
        <h1>Client Screen</h1>
    </RequireRole>
  )
}