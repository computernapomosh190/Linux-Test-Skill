import { useEffect, useState } from "react";
import type { Answer, AppPage, AssessmentResult } from "@/types";
import { QUESTIONS } from "@/data/questions";
import { checkAnswer, calculateResult } from "@/utils/scoring";
import { loadState, saveState, clearState, buildSavedState } from "@/utils/storage";
import { LandingPage } from "@/pages/LandingPage";
import { PreTestPage } from "@/pages/PreTestPage";
import { TestPage } from "@/pages/TestPage";
import { ResultPage } from "@/pages/ResultPage";
import { AuthPage } from "@/pages/AuthPage";
import { LeaderboardPage } from "@/pages/LeaderboardPage";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { user, loading: authLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState<AppPage>("landing");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [userName, setUserName] = useState("");
  const [hasSavedProgress, setHasSavedProgress] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [resultSaved, setResultSaved] = useState(false);

  // Load saved state on mount
  useEffect(() => {
    const saved = loadState();
    if (saved) {
      setHasSavedProgress(true);
      if (saved.currentPage === "test" || saved.currentPage === "result") {
        setShowResumeModal(true);
      }
    }
  }, []);

  // Save state on changes
  useEffect(() => {
    if (currentPage !== "landing" || Object.keys(answers).length > 0) {
      saveState(
        buildSavedState(currentPage, currentQuestionIndex, answers, result, userName),
      );
    }
  }, [currentPage, currentQuestionIndex, answers, result, userName]);

  const handleAnswer = (
    questionId: number,
    value: string | string[] | Record<string, string>,
  ) => {
    const question = QUESTIONS.find((q) => q.id === questionId);
    if (!question) return;
    const scored = checkAnswer(question, value);
    setAnswers((prev) => ({ ...prev, [questionId]: scored }));
  };

  const startTest = () => {
    if (!user) {
      setCurrentPage("auth");
      return;
    }
    clearState();
    setAnswers({});
    setResult(null);
    setCurrentQuestionIndex(0);
    setResultSaved(false);
    setCurrentPage("pretest");
  };

  const beginAssessment = () => {
    setCurrentQuestionIndex(0);
    setCurrentPage("test");
  };

  const finishTest = async () => {
    const res = calculateResult(answers);
    setResult(res);
    setCurrentPage("result");
    setResultSaved(false);
    window.scrollTo(0, 0);

    // Save result to Supabase
    if (user) {
      const { error } = await supabase.from("test_results").insert({
        user_email: user.email ?? "",
        user_name: userName || null,
        score_percentage: res.percentage,
        correct_answers: res.correctAnswers,
        incorrect_answers: res.incorrectAnswers,
        level_key: res.level.key,
        level_name: res.level.name,
        category_scores: res.categoryScores,
        result_id: res.resultId,
      });

      if (!error) {
        setResultSaved(true);
      }
    }
  };

  const exitToLanding = () => {
    setCurrentPage("landing");
  };

  const restart = () => {
    clearState();
    setAnswers({});
    setResult(null);
    setCurrentQuestionIndex(0);
    setUserName("");
    setResultSaved(false);
    setCurrentPage("pretest");
  };

  const goHome = () => {
    clearState();
    setAnswers({});
    setResult(null);
    setCurrentQuestionIndex(0);
    setHasSavedProgress(false);
    setResultSaved(false);
    setCurrentPage("landing");
  };

  const resumeProgress = () => {
    const saved = loadState();
    if (saved) {
      setAnswers(saved.answers ?? {});
      setResult(saved.result);
      setCurrentQuestionIndex(saved.currentQuestionIndex ?? 0);
      setUserName(saved.userName ?? "");
      setCurrentPage(saved.currentPage === "result" ? "result" : "test");
      setShowResumeModal(false);
    }
  };

  const dismissResume = () => {
    setShowResumeModal(false);
    setHasSavedProgress(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="font-mono text-sm text-gray-500 animate-pulse">Loading...</div>
      </div>
    );
  }

  if (currentPage === "auth") {
    return <AuthPage onBack={() => setCurrentPage("landing")} />;
  }

  if (currentPage === "leaderboard") {
    return <LeaderboardPage onHome={goHome} />;
  }

  if (currentPage === "landing") {
    return (
      <>
        <LandingPage
          onStart={startTest}
          onContinue={resumeProgress}
          hasSavedProgress={hasSavedProgress}
          onShowLeaderboard={() => setCurrentPage("leaderboard")}
        />
        {showResumeModal && (
          <ResumeModal
            onResume={resumeProgress}
            onDismiss={dismissResume}
          />
        )}
      </>
    );
  }

  if (currentPage === "pretest") {
    return <PreTestPage onStart={beginAssessment} onBack={goHome} />;
  }

  if (currentPage === "test") {
    return (
      <TestPage
        currentQuestionIndex={currentQuestionIndex}
        answers={answers}
        onAnswer={handleAnswer}
        onNext={() => setCurrentQuestionIndex((i) => Math.min(i + 1, QUESTIONS.length - 1))}
        onPrev={() => setCurrentQuestionIndex((i) => Math.max(i - 1, 0))}
        onFinish={finishTest}
        onExit={exitToLanding}
        setCurrentQuestionIndex={setCurrentQuestionIndex}
      />
    );
  }

  if (currentPage === "result" && result) {
    return (
      <ResultPage
        result={result}
        userName={userName}
        onUserNameChange={setUserName}
        onRestart={restart}
        onHome={goHome}
        onShowLeaderboard={() => setCurrentPage("leaderboard")}
        resultSaved={resultSaved}
      />
    );
  }

  return <LandingPage onStart={startTest} onContinue={resumeProgress} hasSavedProgress={false} onShowLeaderboard={() => setCurrentPage("leaderboard")} />;
}

function ResumeModal({
  onResume,
  onDismiss,
}: {
  onResume: () => void;
  onDismiss: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#161b22] border border-gray-700 rounded-2xl p-6 sm:p-8 max-w-md w-full text-center">
        <h2 className="text-xl font-bold text-white mb-2">Welcome Back!</h2>
        <p className="text-gray-400 mb-6">
          We found your previous assessment progress. Would you like to continue
          from where you left off or start over?
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onDismiss}
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg border border-gray-700 transition-all font-mono text-sm"
          >
            START OVER
          </button>
          <button
            onClick={onResume}
            className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg transition-all font-mono text-sm"
          >
            CONTINUE
          </button>
        </div>
      </div>
    </div>
  );
}
