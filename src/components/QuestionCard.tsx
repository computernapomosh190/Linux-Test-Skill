import { useState } from "react";
import { Check, Terminal } from "lucide-react";
import type { Question } from "@/types";

interface QuestionCardProps {
  question: Question;
  answer: string | string[] | Record<string, string> | null | undefined;
  onAnswer: (value: string | string[] | Record<string, string>) => void;
  disabled?: boolean;
}

export function QuestionCard({ question, answer, onAnswer, disabled = false }: QuestionCardProps) {
  return (
    <fieldset disabled={disabled} className={`m-0 min-w-0 w-full border-0 p-0 ${disabled ? "opacity-75" : ""}`}>
      <div className="flex items-center gap-2 mb-4">
        <span className="px-3 py-1 rounded-full bg-orange-600/20 border border-orange-600/40 text-orange-500 text-xs font-mono font-bold uppercase tracking-wider">
          {question.type === "single" && "Single Choice"}
          {question.type === "multiple" && "Multiple Choice"}
          {question.type === "trueFalse" && "True / False"}
          {question.type === "matching" && "Matching"}
          {question.type === "command" && "Command Input"}
          {question.type === "troubleshooting" && "Troubleshooting"}
        </span>
        <span className="px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-gray-400 text-xs font-mono">
          {question.category}
        </span>
        <span className="px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 text-xs font-mono font-bold">
          {question.points} {question.points === 1 ? "pt" : "pts"}
        </span>
      </div>

      <h2 className="text-lg sm:text-xl font-semibold text-white mb-6 leading-snug">
        {question.question}
      </h2>

      {question.image && (
        <div className="mb-6 rounded-lg overflow-hidden border border-gray-700 bg-gray-900">
          <img
            src={question.image}
            alt="Question reference"
            className="w-full h-auto"
          />
        </div>
      )}

      <QuestionInput question={question} answer={answer} onAnswer={onAnswer} />
    </fieldset>
  );
}

function shuffleOptions(options: string[]): string[] {
  const shuffled = [...options];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }
  return shuffled;
}

function QuestionInput({ question, answer, onAnswer }: QuestionCardProps) {
  switch (question.type) {
    case "single":
      return <SingleChoice question={question} answer={answer as string} onAnswer={onAnswer} />;
    case "multiple":
      return <MultipleChoice question={question} answer={answer as string[]} onAnswer={onAnswer} />;
    case "trueFalse":
      return <TrueFalse answer={answer as string} onAnswer={onAnswer} />;
    case "matching":
      return <Matching question={question} answer={answer as Record<string, string>} onAnswer={onAnswer} />;
    case "command":
      return <CommandInput question={question} answer={answer as string} onAnswer={onAnswer} />;
    case "troubleshooting":
      return <TroubleshootingInput question={question} answer={answer as string} onAnswer={onAnswer} />;
    default:
      return null;
  }
}

// ── Single Choice ──
function SingleChoice({
  question,
  answer,
  onAnswer,
}: {
  question: Question;
  answer: string | undefined;
  onAnswer: (v: string) => void;
}) {
  const options = question.options ?? [];
  const [shuffledOptions] = useState(() => shuffleOptions(options));
  return (
    <div className="space-y-3">
      {shuffledOptions.map((opt) => (
        <button
          key={opt}
          onClick={() => onAnswer(opt)}
          className={`w-full text-left px-4 py-3.5 rounded-lg border transition-all duration-200 font-mono text-sm sm:text-base ${
            answer === opt
              ? "bg-orange-600/20 border-orange-500 text-white"
              : "bg-gray-800/50 border-gray-700 text-gray-300 hover:border-gray-500 hover:bg-gray-800"
          }`}
        >
          <span className="inline-flex items-center gap-3">
            <span
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                answer === opt ? "border-orange-500 bg-orange-500" : "border-gray-600"
              }`}
            >
              {answer === opt && <Check className="w-3 h-3 text-black" />}
            </span>
            {opt}
          </span>
        </button>
      ))}
    </div>
  );
}

// ── Multiple Choice ──
function MultipleChoice({
  question,
  answer,
  onAnswer,
}: {
  question: Question;
  answer: string[] | undefined;
  onAnswer: (v: string[]) => void;
}) {
  const options = question.options ?? [];
  const [shuffledOptions] = useState(() => shuffleOptions(options));
  const selected = answer ?? [];
  const toggle = (opt: string) => {
    if (selected.includes(opt)) {
      onAnswer(selected.filter((o) => o !== opt));
    } else {
      onAnswer([...selected, opt]);
    }
  };
  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500 mb-3 font-mono">
        Оберіть усі правильні відповіді
      </p>
      {shuffledOptions.map((opt) => (
        <button
          key={opt}
          onClick={() => toggle(opt)}
          className={`w-full text-left px-4 py-3.5 rounded-lg border transition-all duration-200 font-mono text-sm sm:text-base ${
            selected.includes(opt)
              ? "bg-orange-600/20 border-orange-500 text-white"
              : "bg-gray-800/50 border-gray-700 text-gray-300 hover:border-gray-500 hover:bg-gray-800"
          }`}
        >
          <span className="inline-flex items-center gap-3">
            <span
              className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                selected.includes(opt) ? "border-orange-500 bg-orange-500" : "border-gray-600"
              }`}
            >
              {selected.includes(opt) && <Check className="w-3 h-3 text-black" />}
            </span>
            {opt}
          </span>
        </button>
      ))}
    </div>
  );
}

// ── True / False ──
function TrueFalse({
  answer,
  onAnswer,
}: {
  answer: string | undefined;
  onAnswer: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {["true", "false"].map((opt) => (
        <button
          key={opt}
          onClick={() => onAnswer(opt)}
          className={`px-4 py-5 rounded-lg border transition-all duration-200 font-mono font-bold uppercase text-base sm:text-lg ${
            answer === opt
              ? "bg-orange-600/20 border-orange-500 text-white"
              : "bg-gray-800/50 border-gray-700 text-gray-300 hover:border-gray-500 hover:bg-gray-800"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

// ── Matching ──
function Matching({
  question,
  answer,
  onAnswer,
}: {
  question: Question;
  answer: Record<string, string> | undefined;
  onAnswer: (v: Record<string, string>) => void;
}) {
  const pairs = question.matchingPairs ?? [];
  const rights = [...pairs.map((p) => p.right)];
  const [shuffledRights] = useState(() => {
    const arr = [...rights];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });
  const current = answer ?? {};

  const select = (left: string, right: string) => {
    const next = { ...current };
    for (const key of Object.keys(next)) {
      if (next[key] === right) delete next[key];
    }
    next[left] = right;
    onAnswer(next);
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500 mb-3 font-mono">
        Tap a left item, then tap the matching right item
      </p>
      {pairs.map((pair) => {
        const usedRights = Object.values(current);
        return (
          <div
            key={pair.left}
            className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:items-center"
          >
            <div className="flex-1 px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 font-mono text-sm text-white">
              {pair.left}
            </div>
            <div className="hidden sm:block text-gray-600 font-mono">→</div>
            <div className="flex flex-wrap gap-2">
              {shuffledRights.map((right) => {
                const isSelected = current[pair.left] === right;
                const isUsedElsewhere =
                  usedRights.includes(right) && !isSelected;
                return (
                  <button
                    key={right}
                    onClick={() => select(pair.left, right)}
                    disabled={isUsedElsewhere && !isSelected}
                    className={`px-3 py-2 rounded-lg border font-mono text-xs sm:text-sm transition-all ${
                      isSelected
                        ? "bg-orange-600 border-orange-500 text-white"
                        : isUsedElsewhere
                        ? "bg-gray-800/30 border-gray-800 text-gray-700 cursor-not-allowed"
                        : "bg-gray-800/50 border-gray-700 text-gray-300 hover:border-orange-500/50"
                    }`}
                  >
                    {right}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Command Input ──
function CommandInput({
  answer,
  onAnswer,
}: {
  question: Question;
  answer: string | undefined;
  onAnswer: (v: string) => void;
}) {
  return (
    <div>
      <div className="flex min-h-36 min-w-0 max-w-full items-start gap-3 overflow-hidden bg-gray-900 border border-gray-700 rounded-lg px-3 sm:px-4 py-4 focus-within:border-orange-500 transition-colors">
        <Terminal className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1" />
        <span className="font-mono text-xs sm:text-sm text-gray-500 whitespace-nowrap flex-shrink-0 mt-1">
          user@linux:~$
        </span>
        <textarea
          value={answer ?? ""}
          onChange={(e) => onAnswer(e.target.value)}
          placeholder="type your command..."
          rows={3}
          className="min-h-24 min-w-0 w-0 flex-1 resize-y overflow-auto bg-transparent border-none outline-none font-mono text-sm sm:text-base leading-relaxed text-white placeholder-gray-600"
          autoComplete="off"
          spellCheck={false}
        />
      </div>
      <p className="text-xs text-gray-500 mt-2 font-mono">
        Multiple equivalent commands may be accepted
      </p>
    </div>
  );
}

// ── Troubleshooting Input ──
function TroubleshootingInput({
  question,
  answer,
  onAnswer,
}: {
  question: Question;
  answer: string | undefined;
  onAnswer: (v: string) => void;
}) {
  const steps = question.troubleshootingCriteria ?? [];
  const values = (answer ?? "").split("\n");

  const updateStep = (index: number, value: string) => {
    const next = Array.from({ length: steps.length }, (_, stepIndex) => values[stepIndex] ?? "");
    next[index] = value;
    onAnswer(next.join("\n"));
  };
  return (
    <div>
      <div className="flex items-start gap-2 mb-4">
        <Terminal className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1" />
        <div>
          <p className="font-mono text-sm text-gray-300">Виконайте кроки послідовно:</p>
          <p className="font-mono text-xs text-gray-500 mt-1">Одна команда в кожному окремому полі. За правильний крок нараховуються часткові бали.</p>
        </div>
      </div>
      <div className="space-y-3">
        {steps.map((step, index) => (
          <label key={step.label} className="block">
            <span className="mb-1.5 flex items-center gap-2 text-xs font-mono text-gray-400">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-600/20 text-orange-400">{index + 1}</span>
              {step.label}
            </span>
            <div className="flex min-w-0 items-center gap-2 rounded-lg border border-gray-700 bg-gray-900 px-3 py-3 focus-within:border-orange-500 transition-colors">
              <span className="font-mono text-xs text-orange-500">$</span>
              <input
                value={values[index] ?? ""}
                onChange={(event) => updateStep(index, event.target.value)}
                placeholder="введіть Linux-команду"
                className="min-w-0 flex-1 bg-transparent font-mono text-sm text-white placeholder-gray-600 outline-none"
                autoComplete="off"
                spellCheck={false}
              />
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
