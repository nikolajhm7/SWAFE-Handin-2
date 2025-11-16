import { RequireRole } from "@/components/auth/RequireRole";
import { TrainerProgramsDetailsScreen } from "@/components/screens/trainer/programs/TrainerProgramsDetailsScreen";

interface PageProps {
    params: Promise<{id: string}>;
}

export default async function TrainerProgramsDetailsPage({ params }: PageProps){
    const { id } = await params;
    const programId = Number(id);

    if (Number.isNaN(programId)){
        return <div>Invalid program ID</div>;
    }

    return (
        <RequireRole allowed={["trainer"]}>
            <TrainerProgramsDetailsScreen id={programId}/>
        </RequireRole>
    )
}