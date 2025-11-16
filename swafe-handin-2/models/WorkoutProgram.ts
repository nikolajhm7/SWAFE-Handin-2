import { Exercise } from "./Exercise";

export interface WorkoutProgram{
    workoutProgramId: number;
    groupId: string;
    name: string | null;
    description: string | null;
    exercises: Exercise[] | null;
    personalTrainerId: number;
    clientId: number | null;
}