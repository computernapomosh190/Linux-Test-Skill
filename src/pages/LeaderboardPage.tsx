import { useEffect, useState } from "react";
import { Trophy, ArrowLeft, Crown, Medal, Award, Home } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

interface LeaderboardEntry {
  id: string;
  user_email: string;
  user_name: string | null;
  score_percentage: number;
  correct_answers: number;
  level_name: string;
  level_key: string;
  created_at: string;
}

interface LeaderboardPageProps {
  onHome: () => void;
}

export function LeaderboardPage({ onHome }: LeaderboardPageProps) {
  const { user } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data, error: queryError } = await supabase
        .from("test_results")
        .select("id, user_email, user_name, score_percentage, correct_answers, level_name, level_key, created_at")
        .order("score_percentage", { ascending: false })
        .order("created_at", { ascending: true })
        .limit(50);

      if (queryError) {
        setError(queryError.message);
        setLoading(false);
        return;
      }

      // Deduplicate: keep only the best result per user
      const seen = new Set<string>();
      const deduped = (data ?? []).filter((entry) => {
        const key = entry.user_email;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      setEntries(deduped);
      setLoading(false);
    }
    load();
  }, []);

  const displayName = (entry: LeaderboardEntry) =>
    entry.user_name?.trim() || entry.user_email.split("@")[0];

  const maskEmail = (email: string) => {
    const [name, domain] = email.split("@");
    if (name.length <= 2) return email;
    return `${name.slice(0, 2)}${"*".repeat(Math.max(1, name.length - 2))}@${domain}`;
  };

  const rankIcon = (index: number) => {
    if (index === 0) return <Crown className="w-5 h-5 text-yellow-400" />;
    if (index === 1) return <Medal className="w-5 h-5 text-gray-300" />;
    if (index === 2) return <Award className="w-5 h-5 text-orange-700" />;
    return <span className="font-mono text-sm text-gray-500">{index + 1}</span>;
  };

  const levelColor = (key: string) => {
    switch (key) {
      case "expert": return "text-orange-400";
      case "advanced": return "text-green-400";
      case "intermediate": return "text-blue-400";
      case "beginner": return "text-yellow-400";
      default: return "text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      {/* Top bar */}
      <div className="border-b border-gray-800 bg-[#161b22] px-4 sm:px-8 py-3 sticky top-0 z-10">
        <div className="flex items-center gap-2 max-w-4xl mx-auto">
          <span className="w-3 h-3 rounded-full bg-red-500" />
          <span className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-3 font-mono text-xs text-gray-400">
            user@linux:~$ cat /var/log/leaderboard
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={onHome}
              className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors font-mono text-sm"
            >
              <ArrowLeft className="w-4 h-4" /> back
            </button>
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-400" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Leaderboard</h1>
                <p className="font-mono text-xs text-gray-500">$ rank --all --by-score</p>
              </div>
            </div>
          </div>
          <button
            onClick={onHome}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg border border-gray-700 transition-all font-mono text-sm"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">HOME</span>
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="font-mono text-sm text-gray-500 animate-pulse">Loading results...</div>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6 text-center">
            <p className="text-red-400 font-mono text-sm">{error}</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-12 text-center">
            <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">No Results Yet</h2>
            <p className="text-gray-400 mb-6">
              Be the first to take the assessment and claim the top spot!
            </p>
            <button
              onClick={onHome}
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg transition-all font-mono text-sm"
            >
              TAKE THE TEST
            </button>
          </div>
        ) : (
          <>
            {/* Podium — top 3 */}
            {entries.length >= 1 && (
              <div className="grid grid-cols-3 gap-3 mb-8">
                {entries.slice(0, 3).map((entry, i) => (
                  <div
                    key={entry.id}
                    className={`rounded-xl border p-4 sm:p-5 text-center ${
                      i === 0
                        ? "border-yellow-500/40 bg-yellow-500/5 sm:scale-105"
                        : i === 1
                        ? "border-gray-500/40 bg-gray-500/5"
                        : "border-orange-700/40 bg-orange-700/5"
                    }`}
                  >
                    <div className="flex justify-center mb-2">
                      {i === 0 ? (
                        <Crown className="w-7 h-7 text-yellow-400" />
                      ) : i === 1 ? (
                        <Medal className="w-7 h-7 text-gray-300" />
                      ) : (
                        <Award className="w-7 h-7 text-orange-600" />
                      )}
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-white">
                      {entry.score_percentage}
                    </p>
                    <p className="text-xs text-gray-500 font-mono">/ 100</p>
                    <p className="text-sm text-white mt-2 truncate">
                      {displayName(entry)}
                    </p>
                    <p className={`text-xs font-mono mt-1 ${levelColor(entry.level_key)}`}>
                      {entry.level_name}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Full table */}
            <div className="bg-[#161b22] border border-gray-800 rounded-2xl overflow-hidden">
              <div className="px-4 sm:px-6 py-3 border-b border-gray-800">
                <p className="font-mono text-xs text-gray-500">
                  Rank · Player · Score · Level · Date
                </p>
              </div>
              <div className="divide-y divide-gray-800/50">
                {entries.map((entry, i) => {
                  const isMe = user?.email === entry.user_email;
                  return (
                    <div
                      key={entry.id}
                      className={`flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 transition-colors ${
                        isMe ? "bg-orange-600/5 border-l-2 border-orange-500" : "hover:bg-gray-800/30"
                      }`}
                    >
                      <div className="w-8 flex-shrink-0 flex justify-center">
                        {rankIcon(i)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white truncate">
                            {displayName(entry)}
                          </span>
                          {isMe && (
                            <span className="text-xs font-mono text-orange-500 bg-orange-600/10 px-2 py-0.5 rounded">
                              YOU
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-600 font-mono">
                          {maskEmail(entry.user_email)}
                        </span>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-lg font-bold text-white">
                          {entry.score_percentage}
                        </span>
                        <span className="text-xs text-gray-600 font-mono"> / 100</span>
                      </div>
                      <div className="hidden sm:block text-right flex-shrink-0 w-32">
                        <span className={`text-xs font-mono ${levelColor(entry.level_key)}`}>
                          {entry.level_name}
                        </span>
                      </div>
                      <div className="hidden md:block text-right flex-shrink-0 w-28">
                        <span className="text-xs text-gray-600 font-mono">
                          {new Date(entry.created_at).toLocaleDateString("uk-UA", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <p className="text-center font-mono text-xs text-gray-600 mt-4">
              Showing {entries.length} {entries.length === 1 ? "result" : "results"} · Best score per user
            </p>
          </>
        )}
      </div>
    </div>
  );
}
