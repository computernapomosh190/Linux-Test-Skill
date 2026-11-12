import type { Level } from "@/types";

export const LEVELS: Level[] = [
  {
    key: "windows",
    name: "Windows User",
    emoji: "🪟",
    minScore: 0,
    maxScore: 19,
    description:
      "Installed Linux, then removed it and went back to Windows. But hey — every expert started somewhere!",
    asset: "/assets/levels/windows-user.svg",
  },
  {
    key: "beginner",
    name: "Beginner Linux User",
    emoji: "🐧",
    minScore: 20,
    maxScore: 39,
    description:
      "You know basic Linux commands, the filesystem, and the core principles of how Linux works.",
    asset: "/assets/levels/beginner-linux.svg",
  },
  {
    key: "intermediate",
    name: "Intermediate Linux User",
    emoji: "🧑‍💻",
    minScore: 40,
    maxScore: 59,
    description:
      "You confidently work with Linux in everyday tasks and can perform basic system administration.",
    asset: "/assets/levels/intermediate-linux.svg",
  },
  {
    key: "advanced",
    name: "Advanced Linux User",
    emoji: "🐬",
    minScore: 60,
    maxScore: 79,
    description:
      "You are well-versed in Linux administration, networking, services, and troubleshooting.",
    asset: "/assets/levels/advanced-linux.svg",
  },
  {
    key: "expert",
    name: "Expert Linux Engineer / DevOps",
    emoji: "⚡",
    minScore: 80,
    maxScore: 100,
    description:
      "Deep understanding of Linux, system administration, networking, and troubleshooting at an engineering level.",
    asset: "/assets/levels/expert-devops.svg",
  },
];

export function getLevelByScore(score: number): Level {
  return (
    LEVELS.find((l) => score >= l.minScore && score <= l.maxScore) ??
    LEVELS[0]
  );
}
