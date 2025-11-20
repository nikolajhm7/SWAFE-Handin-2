import { RequireRole } from "@/components/auth/RequireRole";

export default function TrainerScreen() {
    return (
        <RequireRole allowed={["trainer"]}>
            <h1>Trainer Screen</h1>
        </RequireRole>
    )
}