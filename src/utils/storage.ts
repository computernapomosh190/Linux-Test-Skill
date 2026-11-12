import type { Answer, AppPage, AssessmentResult, SavedState } from "@/types";

const STORAGE_KEY = "linux-assessment-state";

export function loadState(): SavedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedState;
  } catch {
    return null;
  }
}

export function saveState(state: SavedState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function clearState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function buildSavedState(
  currentPage: AppPage,
  currentQuestionIndex: number,
  answers: Record<number, Answer>,
  result: AssessmentResult | null,
  userName: string,
): SavedState {
  return { currentPage, currentQuestionIndex, answers, result, userName };
}
