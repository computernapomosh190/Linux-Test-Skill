import { useState } from "react";
import { ChevronLeft, ChevronRight, Flag, X } from "lucide-react";
import { ProgressBar } from "@/components/ProgressBar";
import { QuestionCard } from "@/components/QuestionCard";
import type { Answer } from "@/types";
import { getCorrectAnswerText } from "@/utils/scoring";
import { QUESTIONS } from "@/data/questions";

interface TestPageProps {
  currentQuestionIndex: number;
  answers: Record<number, Answer>;
  onAnswer: (questionId: number, value: string | string[] | Record<string, string>) => void;
  onNext: () => void;
  onPrev: () => void;
  onFinish: () => void;
  onExit: () => void;
  setCurrentQuestionIndex: (index: number) => void;
}

export function TestPage({
  currentQuestionIndex,
  answers,
  onAnswer,
  onNext,
  onPrev,
  onFinish,
  onExit,
  setCurrentQuestionIndex,
}: TestPageProps) {
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [lockedQuestionIds, setLockedQuestionIds] = useState<Set<number>>(new Set());

  const question = QUESTIONS[currentQuestionIndex];
  const currentAnswer = answers[question.id];
  const isLast = currentQuestionIndex === QUESTIONS.length - 1;
  const isFirst = currentQuestionIndex === 0;
  const hasAnswer = currentAnswer !== undefined;

  const answeredCount = Object.keys(answers).length;
  const isCorrect = currentAnswer?.pointsEarned === currentAnswer?.maxPoints;
  const isLocked = lockedQuestionIds.has(question.id);
  const handleAdvance = () => {
    if (!hasAnswer) return;
    if (!feedbackVisible) {
      setLockedQuestionIds((previous) => new Set(previous).add(question.id));
      setFeedbackVisible(true);
      return;
    }
    setFeedbackVisible(false);
    onNext();
  };
  const handleFinish = () => {
    if (!hasAnswer) return;
    if (!feedbackVisible) {
      setLockedQuestionIds((previous) => new Set(previous).add(question.id));
      setFeedbackVisible(true);
      return;
    }
    setFeedbackVisible(false);
    setShowFinishConfirm(true);
  };

  return (
    <div className="min-h-screen w-full min-w-0 overflow-x-hidden bg-[#0d1117] text-white flex flex-col">
      {/* Top bar */}
      <div className="border-b border-gray-800 bg-[#161b22] px-4 sm:px-8 py-3 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500" />
          <span className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-3 font-mono text-xs text-gray-400 hidden sm:inline">
            user@linux:~$ assessment --in-progress
          </span>
          <span className="ml-auto font-mono text-xs text-gray-500">
            {answeredCount}/{QUESTIONS.length} answered
          </span>
          <button
            onClick={() => setShowExitConfirm(true)}
            className="ml-2 p-1.5 rounded-lg hover:bg-gray-800 text-gray-500 hover:text-red-400 transition-colors"
            aria-label="Exit assessment"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 px-4 sm:px-8 py-6">
        <div className="w-full min-w-0 max-w-3xl mx-auto">
          <ProgressBar current={currentQuestionIndex + 1} total={QUESTIONS.length} />

          {/* Question nav dots */}
          <div className="flex flex-wrap gap-1.5 mt-4 mb-6 justify-center">
            {QUESTIONS.map((q, i) => {
              const isAnswered = answers[q.id] !== undefined;
              const isCurrent = i === currentQuestionIndex;
              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setFeedbackVisible(false);
                    setCurrentQuestionIndex(i);
                  }}
                  className={`w-7 h-7 rounded text-xs font-mono font-bold transition-all ${
                    isCurrent
                      ? "bg-orange-600 text-white scale-110"
                      : isAnswered
                      ? "bg-green-600/30 text-green-400 border border-green-600/50"
                      : "bg-gray-800 text-gray-500 border border-gray-700 hover:border-gray-500"
                  }`}
                  aria-label={`Go to question ${i + 1}`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>

          {/* Question card */}
          <div className="min-w-0 bg-[#161b22] border border-gray-800 rounded-2xl p-4 sm:p-8">
                    <QuestionCard
              key={question.id}
              question={question}
              answer={currentAnswer?.value}
              onAnswer={(value) => onAnswer(question.id, value)}
              disabled={isLocked}
            />
          </div>

          {feedbackVisible && currentAnswer && (
            <div className={`mt-6 rounded-xl border p-4 ${isCorrect ? "border-green-500/50 bg-green-500/10" : "border-red-500/50 bg-red-500/10"}`}>
              <p className={`font-bold ${isCorrect ? "text-green-400" : "text-red-400"}`}>
                {isCorrect ? "Правильна відповідь" : "Неправильна відповідь"}
                {currentAnswer.pointsEarned > 0 && !isCorrect ? ` Частково: ${currentAnswer.pointsEarned}/${currentAnswer.maxPoints} балів` : ""}
              </p>
              {!isCorrect && (
                <p className="mt-2 text-sm leading-relaxed text-gray-200">
                  <span className="font-bold text-white">Правильна відповідь: </span>
                  {getCorrectAnswerText(question)}
                </p>
              )}
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex min-w-0 justify-between items-center mt-6 gap-3">
            <button
              onClick={() => {
                setFeedbackVisible(false);
                onPrev();
              }}
              disabled={isFirst}
              className="inline-flex items-center gap-2 px-5 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg border border-gray-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed font-mono text-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              PREV
            </button>

            {!isLast ? (
              <button
                onClick={handleAdvance}
                className="inline-flex items-center gap-2 px-8 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg transition-all shadow-lg shadow-orange-600/20 font-mono text-sm"
              >
                {feedbackVisible ? "CONTINUE" : "NEXT QUESTION"}
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="inline-flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition-all shadow-lg shadow-green-600/20 font-mono text-sm"
              >
                <Flag className="w-4 h-4" />
                {feedbackVisible ? "CONTINUE TO FINISH" : "FINISH TEST"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Finish confirmation */}
      {showFinishConfirm && (
        <Modal onClose={() => setShowFinishConfirm(false)}>
          <div className="text-center">
            <Flag className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">
              Finish Assessment?
            </h2>
            <p className="text-gray-400 mb-6">
              You've answered {answeredCount} of {QUESTIONS.length} questions.
              {answeredCount < 50 && (
                <span className="block mt-1 text-yellow-500 text-sm">
                  {QUESTIONS.length - answeredCount} questions are still unanswered.
                </span>
              )}
              Are you sure you want to finish?
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowFinishConfirm(false)}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg border border-gray-700 transition-all font-mono text-sm"
              >
                KEEP GOING
              </button>
              <button
                onClick={() => {
                  setShowFinishConfirm(false);
                  onFinish();
                }}
                className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition-all font-mono text-sm"
              >
                FINISH NOW
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Exit confirmation */}
      {showExitConfirm && (
        <Modal onClose={() => setShowExitConfirm(false)}>
          <div className="text-center">
            <X className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">
              Exit Assessment?
            </h2>
            <p className="text-gray-400 mb-6">
              Your progress will be saved. You can continue later from where you left off.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg border border-gray-700 transition-all font-mono text-sm"
              >
                CANCEL
              </button>
              <button
                onClick={() => {
                  setShowExitConfirm(false);
                  onExit();
                }}
                className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-all font-mono text-sm"
              >
                EXIT & SAVE
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#161b22] border border-gray-700 rounded-2xl p-6 sm:p-8 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
