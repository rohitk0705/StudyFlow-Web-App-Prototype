export type Screen = "home" | "input" | "plan" | "progress" | "analytics";

export type Difficulty = "Easy" | "Medium" | "Hard";

export interface SubjectInput {
  name: string;
  difficulty: Difficulty;
}

export interface StudyPlanInput {
  examDate: string;
  subjects: SubjectInput[];
  dailyHours: string;
}
