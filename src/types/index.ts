export type QuestionType =
  | "single"
  | "multiple"
  | "trueFalse"
  | "matching"
  | "command"
  | "troubleshooting";

export interface TroubleshootingCriterion {
  label: string;
  patterns: string[];
  points: number;
}

export interface MatchingPair {
  left: string;
  right: string;
}

export interface Question {
  id: number;
  category: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer?: string | string[];
  acceptedAnswers?: string[];
  matchingPairs?: MatchingPair[];
  image?: string;
  explanation?: string;
  expectedAnswer?: string;
  troubleshootingCriteria?: TroubleshootingCriterion[];
  points: number;
}

export interface Level {
  key: string;
  name: string;
  emoji: string;
  minScore: number;
  maxScore: number;
  description: string;
  asset: string;
}

export interface Answer {
  questionId: number;
  type: QuestionType;
  value: string | string[] | Record<string, string> | null;
  pointsEarned: number;
  maxPoints: number;
}

export interface AssessmentResult {
  totalScore: number;
  percentage: number;
  correctAnswers: number;
  incorrectAnswers: number;
  level: Level;
  categoryScores: CategoryScore[];
  resultId: string;
  answers: Answer[];
}

export interface CategoryScore {
  category: string;
  earned: number;
  total: number;
  percentage: number;
}

export type AppPage = "landing" | "pretest" | "test" | "result" | "auth" | "leaderboard";

export interface SavedState {
  currentPage: AppPage;
  currentQuestionIndex: number;
  answers: Record<number, Answer>;
  result: AssessmentResult | null;
  userName: string;
}
