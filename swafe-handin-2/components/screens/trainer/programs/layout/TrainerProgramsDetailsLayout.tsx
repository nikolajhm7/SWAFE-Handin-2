import { WorkoutProgram } from "@/models/WorkoutProgram";

interface Props {
    program: WorkoutProgram | null;
    loading: boolean;
    error: string | null;
    onBack: () => void;
}

export function TrainerProgramsDetailsLayout({ program, loading, error, onBack }: Props) {
    const exerciseCount = program?.exercises?.length ?? 0;
  
    return (
      <div className="program-page">
        <button type="button" onClick={onBack} className="program-back-button">
          ← Back to Programs
        </button>
  
        {loading && <div className="program-status program-status--loading">Loading workout program...</div>}
  
        {error && <div className="program-status program-status--error">{error}</div>}
  
        {!loading && !error && !program && (
          <div className="program-status program-status--empty">
            Workout program not found.
          </div>
        )}
  
        {!loading && !error && program && (
          <>
            <header className="program-header">
              <h1 className="program-title">{program.name || "No name"}</h1>
  
              {program.description && (
                <p className="program-description">{program.description}</p>
              )}
  
              <div className="program-meta">
                <span>ID: {program.workoutProgramId}</span>
                {program.clientId != null && <span>Client ID: {program.clientId}</span>}
                <span>
                  {exerciseCount} exercise{exerciseCount === 1 ? "" : "s"}
                </span>
              </div>
            </header>
  
            <section className="program-exercises">
              <h2 className="program-exercises-title">Exercises</h2>
  
              {exerciseCount === 0 && (
                <div className="program-status program-status--empty">
                    No exercises in this program.
                </div>
              )}
  
              {exerciseCount > 0 && (
                <ul className="program-exercises-list">
                  {program.exercises!.map((ex, index) => {
                    const hasSetsOrReps = ex.sets != null || (ex.repetitions !== 0);
                    const hasTime = !!ex.time;
  
                    return (
                      <li
                        key={ex.exerciseId ?? index}
                        className="program-exercise-item"
                      >
                        <div className="program-exercise-header">
                          <div className="program-exercise-name">
                            {ex.name || `Exercise ${index + 1}`}
                          </div>
                          <div className="program-exercise-id">
                            ID: {ex.exerciseId}
                          </div>
                        </div>
  
                        {ex.description && (
                          <p className="program-exercise-description">
                            {ex.description}
                          </p>
                        )}
  
                        <div className="program-exercise-meta">
                          {hasSetsOrReps && (
                            <span>
                              {ex.sets != null && `${ex.sets} sæt`}
                              {ex.sets != null && ex.repetitions != null && " x "}
                              {ex.repetitions != null &&
                                `${ex.repetitions} repetitions`}
                            </span>
                          )}
                          {hasTime && <span>Duration: {ex.time}</span>}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          </>
        )}
      </div>
    );
  }