import { WorkoutProgram } from "@/models/WorkoutProgram";

interface Props {
    programs: WorkoutProgram[] | null;
    loading: boolean;
    error: string | null;
    onProgramClick: (id: number) => void;
    onCreateNew?: () => void;
}

export function TrainerProgramsLayout({
    programs,
    loading,
    error,
    onProgramClick,
    onCreateNew,
  }: Props) {
    const hasPrograms = !!programs && programs.length > 0;
  
    return (
      <div className="program-list-page">
        <div className="program-list-header">
          <div>
            <h1 className="program-list-title">Your workout programs</h1>
            <p className="program-list-subtitle">
              Here you can see the workout programs you have created for your clients previously.
            </p>
          </div>
  
          {onCreateNew && (
            <button
              type="button"
              onClick={onCreateNew}
              className="program-list-new-button"
            >
              + New Program
            </button>
          )}
        </div>
  
        {loading && (
          <div className="program-status program-status--loading">
            Loading workout programs...
          </div>
        )}
  
        {error && (
          <div className="program-status program-status--error">
            {error}
          </div>
        )}
  
        {!loading && !error && (!programs || programs.length === 0) && (
          <div className="program-status program-status--empty">
            You have not created any workout programs yet.
          </div>
        )}
  
        {!loading && !error && hasPrograms && (
          <div className="program-list-items">
            {programs!.map((program) => {
              const exerciseCount = program.exercises?.length ?? 0;
  
              return (
                <button
                  key={program.workoutProgramId}
                  type="button"
                  onClick={() => onProgramClick(program.workoutProgramId)}
                  className="program-list-item"
                >
                  <div className="program-list-item-main">
                    <div>
                      <h2 className="program-list-item-title">
                        {program.name || "No name"}
                      </h2>
                      {program.description && (
                        <p className="program-list-item-description">
                          {program.description}
                        </p>
                      )}
                    </div>
                    <div className="program-list-item-meta">
                      <div>
                        {exerciseCount} exercise{exerciseCount === 1 ? "" : "s"}
                      </div>
                      {program.clientId != null && (
                        <div>Client ID: {program.clientId}</div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }