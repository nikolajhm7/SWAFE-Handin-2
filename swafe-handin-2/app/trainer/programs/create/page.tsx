import { RequireRole } from "@/components/auth/RequireRole";
import TrainerProgramsCreateScreen from "@/components/screens/trainer/programs/TrainerProgramsCreateScreen";

export default function TrainerProgramsCreatePage() {
    return (
        <RequireRole allowed={["trainer"]}>
            <TrainerProgramsCreateScreen />
        </RequireRole>
    )
}