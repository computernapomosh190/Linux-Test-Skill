import { forwardRef } from "react";
import type { AssessmentResult } from "@/types";
import { QUESTIONS } from "@/data/questions";

interface CertificateProps {
  result: AssessmentResult;
  userName: string;
}

export const Certificate = forwardRef<HTMLDivElement, CertificateProps>(
  ({ result, userName }, ref) => {
    const date = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return (
      <div
        ref={ref}
        className="bg-[#0d1117] text-white"
        style={{ width: "1120px", padding: "52px", borderRadius: "0", boxSizing: "border-box" }}
      >
        {/* Top decoration */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-2 rounded-full bg-orange-500" />
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          <div className="w-2 h-2 rounded-full bg-gray-600" />
          <span className="font-mono text-xs text-gray-500 ml-2">certificate --generate</span>
        </div>

        {/* Header */}
        <div className="border-y-2 border-orange-600 py-6 text-center mb-8">
          <p className="font-mono text-sm text-orange-500 tracking-widest mb-2">
            ~ / linux-skill-assessment / result ~
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-white">
            LINUX SKILL ASSESSMENT
          </h1>
          <p className="font-mono text-sm text-gray-400 mt-2">
            Official Result Certificate
          </p>
        </div>

        <div className="flex gap-8">
          {/* Left: image */}
          <div className="flex-shrink-0">
            <div className="bg-gray-900 border-2 border-orange-600/50 rounded-lg p-4">
              <img
                src={result.level.asset}
                alt={result.level.name}
                style={{ width: "300px", height: "220px" }}
              />
            </div>
          </div>

          {/* Right: details */}
          <div className="flex-1 space-y-4">
            <div>
              <p className="font-mono text-xs text-gray-500 uppercase tracking-wider">Awarded to</p>
              <p className="text-2xl font-bold text-white">{userName || "Anonymous User"}</p>
            </div>

            <div>
              <p className="font-mono text-xs text-gray-500 uppercase tracking-wider">Linux Level</p>
              <p className="text-xl font-bold text-orange-500">
                {result.level.emoji} {result.level.name.toUpperCase()}
              </p>
            </div>

            <div className="flex gap-8">
              <div>
                <p className="font-mono text-xs text-gray-500 uppercase tracking-wider">Score</p>
                <p className="text-3xl font-bold text-white">
                  {result.percentage}<span className="text-lg text-gray-400">/100</span>
                </p>
              </div>
              <div>
                <p className="font-mono text-xs text-gray-500 uppercase tracking-wider">Questions</p>
                <p className="text-3xl font-bold text-white">{QUESTIONS.length}</p>
              </div>
              <div>
                <p className="font-mono text-xs text-gray-500 uppercase tracking-wider">Correct</p>
                <p className="text-3xl font-bold text-green-500">{result.correctAnswers}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <p className="font-mono text-xs text-gray-500 uppercase tracking-wider">Date</p>
                <p className="text-sm font-mono text-white">{date}</p>
              </div>
              <div>
                <p className="font-mono text-xs text-gray-500 uppercase tracking-wider">Result ID</p>
                <p className="text-sm font-mono text-yellow-500">{result.resultId}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 border-t-2 border-orange-600 pt-4 flex justify-between items-center">
          <div className="font-mono text-xs text-gray-500">
            <p>$ cat /etc/assessment-result</p>
            <p className="text-orange-500">status: VERIFIED  |  level: {result.level.key}</p>
          </div>
          <div className="text-right">
            <div className="w-16 h-16 border-2 border-yellow-500 rounded-full flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl">🐧</p>
                <p className="font-mono text-[8px] text-yellow-500">CERTIFIED</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

Certificate.displayName = "Certificate";
