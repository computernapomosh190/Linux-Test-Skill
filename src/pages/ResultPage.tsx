import { FileDown, RotateCcw, Home, CheckCircle2, XCircle, TrendingUp, Trophy, Check } from "lucide-react";
import type { AssessmentResult } from "@/types";
import { Certificate } from "@/components/Certificate";

interface ResultPageProps {
  result: AssessmentResult;
  userName: string;
  onUserNameChange: (name: string) => void;
  onRestart: () => void;
  onHome: () => void;
  onShowLeaderboard: () => void;
  resultSaved: boolean;
}

export function ResultPage({
  result,
  userName,
  onUserNameChange,
  onRestart,
  onHome,
  onShowLeaderboard,
  resultSaved,
}: ResultPageProps) {
  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      {/* Top bar */}
      <div className="border-b border-gray-800 bg-[#161b22] px-4 sm:px-8 py-3">
        <div className="flex items-center gap-2 max-w-4xl mx-auto">
          <span className="w-3 h-3 rounded-full bg-red-500" />
          <span className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-3 font-mono text-xs text-gray-400">
            user@linux:~$ cat result.txt
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="font-mono text-sm text-gray-500 uppercase tracking-widest mb-2">
            ~ Your Linux Level ~
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1">
            YOUR LINUX LEVEL
          </h1>
          <p className="font-mono text-xs text-orange-500 mt-2">
            Result ID: {result.resultId}
          </p>
          {resultSaved && (
            <div className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full bg-green-600/10 border border-green-600/30">
              <Check className="w-4 h-4 text-green-500" />
              <span className="font-mono text-xs text-green-500">Result saved to leaderboard</span>
            </div>
          )}
        </div>

        {/* Result card */}
        <div className="bg-[#161b22] border border-gray-800 rounded-2xl overflow-hidden mb-8">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Level image */}
            <div className="flex items-center justify-center bg-[#0d1117] p-8 border-b md:border-b-0 md:border-r border-gray-800">
              <img
                src={result.level.asset}
                alt={result.level.name}
                className="w-full max-w-sm h-auto rounded-lg"
              />
            </div>

            {/* Score details */}
            <div className="p-8 flex flex-col justify-center">
              <p className="text-5xl mb-2">{result.level.emoji}</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-orange-500 mb-3 uppercase">
                {result.level.name}
              </h2>
              <div className="mb-4">
                <span className="text-5xl font-bold text-white">
                  {result.percentage}
                </span>
                <span className="text-2xl text-gray-500">/100</span>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                {result.level.description}
              </p>

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-800/50 border border-gray-800 rounded-lg p-3 text-center">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto mb-1" />
                  <p className="text-xl font-bold text-white">{result.correctAnswers}</p>
                  <p className="text-xs text-gray-500 font-mono">Correct</p>
                </div>
                <div className="bg-gray-800/50 border border-gray-800 rounded-lg p-3 text-center">
                  <XCircle className="w-5 h-5 text-red-500 mx-auto mb-1" />
                  <p className="text-xl font-bold text-white">{result.incorrectAnswers}</p>
                  <p className="text-xs text-gray-500 font-mono">Wrong</p>
                </div>
                <div className="bg-gray-800/50 border border-gray-800 rounded-lg p-3 text-center">
                  <TrendingUp className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                  <p className="text-xl font-bold text-white">{result.percentage}%</p>
                  <p className="text-xs text-gray-500 font-mono">Score</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category breakdown */}
        <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6 sm:p-8 mb-8">
          <h3 className="text-lg font-bold text-white mb-1">Category Performance</h3>
          <p className="text-xs text-gray-500 font-mono mb-6">
            $ performance --breakdown --by-category
          </p>
          <div className="space-y-4">
            {result.categoryScores.map((cat) => (
              <CategoryBar key={cat.category} {...cat} />
            ))}
          </div>
        </div>

        {/* Name input + Download */}
        <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6 sm:p-8 mb-8">
          <h3 className="text-lg font-bold text-white mb-4">
            Your Certificate
          </h3>
          <div className="mb-4">
            <label className="block text-sm font-mono text-gray-500 mb-2">
              Your name (for the certificate):
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => onUserNameChange(e.target.value)}
              placeholder="e.g. Jane Doe"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white font-mono text-sm outline-none focus:border-orange-500 transition-colors"
            />
          </div>
          <button
            onClick={handlePrintPdf}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg transition-all shadow-lg shadow-orange-600/30 font-mono text-sm"
          >
            <FileDown className="w-5 h-5" />
            ЗАВАНТАЖИТИ PDF
          </button>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onShowLeaderboard}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-lg transition-all font-mono text-sm shadow-lg shadow-yellow-600/20"
          >
            <Trophy className="w-4 h-4" />
            LEADERBOARD
          </button>
          <button
            onClick={onRestart}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg border border-gray-700 transition-all font-mono text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            RETAKE TEST
          </button>
          <button
            onClick={onHome}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg border border-gray-700 transition-all font-mono text-sm"
          >
            <Home className="w-4 h-4" />
            HOME
          </button>
        </div>
      </div>

      <div className="print-only-certificate">
        <Certificate result={result} userName={userName} />
      </div>


    </div>
  );
}

function CategoryBar({
  category,
  percentage,
  earned,
  total,
}: {
  category: string;
  percentage: number;
  earned: number;
  total: number;
}) {
  const color =
    percentage >= 80
      ? "from-green-600 to-green-400"
      : percentage >= 60
      ? "from-orange-600 to-orange-400"
      : percentage >= 40
      ? "from-yellow-600 to-yellow-400"
      : "from-red-600 to-red-400";

  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm font-mono text-gray-300">{category}</span>
        <span className="text-sm font-mono text-gray-500">
          {percentage}% <span className="text-gray-600">({earned}/{total})</span>
        </span>
      </div>
      <div className="h-2.5 w-full bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
