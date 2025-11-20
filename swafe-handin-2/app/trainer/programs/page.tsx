import { RequireRole } from "@/components/auth/RequireRole";
import { TrainerProgramsScreen } from "@/components/screens/trainer/programs/TrainerProgramsScreen";

export default function TrainerProgramsPage() {
    return (
        <RequireRole allowed={["trainer"]}>
            <TrainerProgramsScreen />
        </RequireRole>
    )
}