import { RequireRole } from "@/components/auth/RequireRole";
import TrainerClientsCreateScreen from "@/components/screens/trainer/clients/TrainerClientsCreateScreen";

export default function TrainerClientsCreatePage() {
    return (
        <RequireRole allowed={["trainer"]}>
            <TrainerClientsCreateScreen />
        </RequireRole>
    )
}