import { RequireRole } from "@/components/auth/RequireRole";
import TrainerClientsScreen from "@/components/screens/trainer/clients/TrainerClientsScreen";

export default function TrainerClientsPage() {
    return (
        <RequireRole allowed={["trainer"]}>
            <TrainerClientsScreen />
        </RequireRole>
    )
}