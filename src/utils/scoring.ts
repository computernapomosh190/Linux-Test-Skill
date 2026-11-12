import type {
  Answer,
  AssessmentResult,
  CategoryScore,
  Question,
} from "@/types";
import { QUESTIONS, TOTAL_MAX_POINTS } from "@/data/questions";
import { getLevelByScore } from "@/data/levels";

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase("uk-UA").replace(/\s+/g, " ");
}

function normalizeCommand(value: string): string {
  return normalize(value)
    .replace(/^user@[^$]+\$\s*/, "")
    .replace(/^(sudo\s+)+/, "")
    .replace(/\/etc(?:\s+|-)?maxdepth\b/g, "/etc -maxdepth")
    .replace(/[;]+$/, "")
    .trim();
}

export function checkAnswer(question: Question, rawAnswer: unknown): Answer {
  const base: Answer = {
    questionId: question.id,
    type: question.type,
    value: (rawAnswer as string | string[] | Record<string, string>) ?? null,
    pointsEarned: 0,
    maxPoints: question.points,
  };

  switch (question.type) {
    case "single":
    case "trueFalse":
      return rawAnswer === question.correctAnswer
        ? { ...base, pointsEarned: question.points }
        : base;

    case "multiple": {
      const selected = new Set((rawAnswer as string[]) ?? []);
      const correct = new Set((question.correctAnswer as string[]) ?? []);
      if (selected.size === correct.size && [...selected].every((value) => correct.has(value))) {
        return { ...base, pointsEarned: question.points };
      }
      const rightSelections = [...selected].filter((value) => correct.has(value)).length;
      const partial = rightSelections > 0
        ? (rightSelections / correct.size) * question.points
        : 0;
      return { ...base, pointsEarned: partial };
    }

    case "matching": {
      const selected = (rawAnswer as Record<string, string>) ?? {};
      const pairs = question.matchingPairs ?? [];
      const correctCount = pairs.filter((pair) => selected[pair.left] === pair.right).length;
      return { ...base, pointsEarned: Math.round((correctCount / pairs.length) * question.points) };
    }

    case "command": {
      const value = normalizeCommand((rawAnswer as string) ?? "");
      const accepted = (question.acceptedAnswers ?? []).map(normalizeCommand);
      if (accepted.includes(value)) return { ...base, pointsEarned: question.points };

      if (question.id === 4) {
        const compact = value.replace(/\s+/g, "");
        const validFindCommand = [
          "find/etc-maxdepth1-typef",
          "find/etcmaxdepth1-typef",
          "find/etc-maxdepth1-typef-print",
          "find/etcmaxdepth1-typef-print",
        ].includes(compact);
        if (validFindCommand) return { ...base, pointsEarned: question.points };
      }

      return base;
    }

    case "troubleshooting": {
      const lines = String(rawAnswer ?? "").split("\n");
      const criteria = question.troubleshootingCriteria ?? [];
      const earnedSteps = criteria.reduce((total, criterion, index) => {
        const line = normalizeCommand(lines[index] ?? "");
        const matched = criterion.patterns.some((pattern) => line.includes(normalizeCommand(pattern)));
        return total + (matched ? criterion.points : 0);
      }, 0);
      const earned = criteria.length > 0
        ? Math.round((earnedSteps / criteria.length) * question.points)
        : 0;
      return { ...base, pointsEarned: Math.min(earned, question.points) };
    }

    default:
      return base;
  }
}

export function getCorrectAnswerText(question: Question): string {
  if (question.type === "troubleshooting") {
    return question.expectedAnswer ?? "Опишіть логічну послідовність перевірок і підтвердьте причину проблеми.";
  }
  if (question.type === "multiple") {
    return ((question.correctAnswer as string[]) ?? []).join("; ");
  }
  if (question.type === "matching") {
    return (question.matchingPairs ?? []).map((pair) => `${pair.left} → ${pair.right}`).join("; ");
  }
  return String(question.correctAnswer ?? question.acceptedAnswers?.[0] ?? "");
}

export function calculateResult(answers: Record<number, Answer>): AssessmentResult {
  let totalScore = 0;
  let correctAnswers = 0;
  let incorrectAnswers = 0;
  const categoryMap: Record<string, { earned: number; total: number }> = {};

  for (const question of QUESTIONS) {
    const answer = answers[question.id];
    if (!categoryMap[question.category]) categoryMap[question.category] = { earned: 0, total: 0 };
    categoryMap[question.category].total += question.points;
    if (!answer) continue;
    totalScore += answer.pointsEarned;
    categoryMap[question.category].earned += answer.pointsEarned;
    if (answer.pointsEarned >= answer.maxPoints) correctAnswers++;
    else incorrectAnswers++;
  }

  const percentage = TOTAL_MAX_POINTS > 0 ? Math.round((totalScore / TOTAL_MAX_POINTS) * 100) : 0;
  const categoryScores: CategoryScore[] = Object.entries(categoryMap).map(([category, value]) => ({
    category,
    earned: value.earned,
    total: value.total,
    percentage: value.total > 0 ? Math.round((value.earned / value.total) * 100) : 0,
  }));

  return {
    totalScore,
    percentage,
    correctAnswers,
    incorrectAnswers,
    level: getLevelByScore(percentage),
    categoryScores,
    resultId: generateResultId(),
    answers: Object.values(answers),
  };
}

function generateResultId(): string {
  const year = new Date().getFullYear();
  const hex = Math.random().toString(16).toUpperCase().slice(2, 8);
  return `LNX-${year}-${hex}`;
}
