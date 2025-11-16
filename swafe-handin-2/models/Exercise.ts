export interface Exercise {
    exerciseId: number;
    groupId: string;
    name: string | null;
    description: string | null;
    sets: number | null;
    repetitions: number | null;
    time: string | null;
    workoutProgramId: number | null;
    personalTrainerId: string | null;
}