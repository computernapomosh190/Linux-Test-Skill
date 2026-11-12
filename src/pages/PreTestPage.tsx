import { Clock, ListChecks, Play, ArrowLeft } from "lucide-react";
import { QUESTIONS } from "@/data/questions";

interface PreTestPageProps {
  onStart: () => void;
  onBack: () => void;
}

const CATEGORIES = [
  "Linux Basics",
  "Filesystems",
  "Bash Principles",
  "Pipes & Pipelines",
  "TTY",
  "Linux Boot",
  "Linux Distributions",
  "Linux History",
  "Docker",
  "Ansible",
  "Kubernetes",
  "Networking",
  "SSH & Security",
];

export function PreTestPage({ onStart, onBack }: PreTestPageProps) {
  return (
    <div className="min-h-screen bg-[#0d1117] text-white flex flex-col">
      {/* Top bar */}
      <div className="border-b border-gray-800 bg-[#161b22] px-4 sm:px-8 py-3">
        <div className="flex items-center gap-2 max-w-4xl mx-auto">
          <span className="w-3 h-3 rounded-full bg-red-500" />
          <span className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-3 font-mono text-xs text-gray-400">user@linux:~$ assessment --info</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-12">
        <div className="w-full max-w-2xl">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 font-mono text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> back
          </button>

          <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6 sm:p-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Before You Start
            </h1>
            <p className="text-gray-400 mb-8">
              Here's what you need to know about the assessment.
            </p>

            {/* Info cards */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-800/50 border border-gray-800 rounded-lg p-5">
                <ListChecks className="w-6 h-6 text-orange-500 mb-3" />
                <p className="text-3xl font-bold text-white">{QUESTIONS.length}</p>
                <p className="text-sm text-gray-500 font-mono">Questions</p>
              </div>
              <div className="bg-gray-800/50 border border-gray-800 rounded-lg p-5">
                <Clock className="w-6 h-6 text-orange-500 mb-3" />
                <p className="text-3xl font-bold text-white">30–45</p>
                <p className="text-sm text-gray-500 font-mono">Minutes</p>
              </div>
            </div>

            {/* Categories */}
            <div className="mb-8">
              <h2 className="text-sm font-mono text-gray-500 uppercase tracking-wider mb-3">
                Categories covered
              </h2>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <span
                    key={cat}
                    className="px-3 py-1.5 rounded-full bg-gray-800 border border-gray-700 text-gray-300 text-xs font-mono"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            {/* Question types */}
            <div className="mb-8">
              <h2 className="text-sm font-mono text-gray-500 uppercase tracking-wider mb-3">
                Question types
              </h2>
              <div className="grid sm:grid-cols-2 gap-2">
                {[
                  "Single choice",
                  "Multiple choice",
                  "True / False",
                  "Matching",
                  "Docker",
                  "Bash Scripting",
                  "Ansible",
                  "Kubernetes",
                ].map((type) => (
                  <div
                    key={type}
                    className="flex items-center gap-2 text-sm text-gray-300 font-mono"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    {type}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={onStart}
              className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg transition-all duration-200 text-lg shadow-lg shadow-orange-600/30 hover:scale-[1.01]"
            >
              <Play className="w-5 h-5" />
              START ASSESSMENT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
