import { Terminal, Server, Award, ChevronRight, FileText, CheckCircle2, Trophy, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface LandingPageProps {
  onStart: () => void;
  onContinue: () => void;
  hasSavedProgress: boolean;
  onShowLeaderboard: () => void;
}

export function LandingPage({ onStart, onContinue, hasSavedProgress, onShowLeaderboard }: LandingPageProps) {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      {/* Terminal-style top bar */}
      <div className="border-b border-gray-800 bg-[#161b22] px-4 sm:px-8 py-3">
        <div className="flex items-center gap-2 max-w-6xl mx-auto">
          <span className="w-3 h-3 rounded-full bg-red-500" />
          <span className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-3 font-mono text-xs text-gray-400">user@linux:~$ assessment --start</span>
          <div className="ml-auto flex items-center gap-3">
            {user ? (
              <>
                <span className="hidden sm:inline font-mono text-xs text-gray-400">
                  <User className="w-3.5 h-3.5 inline mr-1" />
                  {user.email}
                </span>
                <button
                  onClick={() => signOut()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-red-400 transition-colors font-mono text-xs"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </>
            ) : (
              <button
                onClick={onShowLeaderboard}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-orange-400 transition-colors font-mono text-xs"
              >
                <Trophy className="w-3.5 h-3.5" />
                Leaderboard
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 sm:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-600/10 border border-orange-600/30 mb-6">
              <Terminal className="w-4 h-4 text-orange-500" />
              <span className="font-mono text-xs text-orange-500 uppercase tracking-wider">Linux Skill Assessment</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              <span className="text-white">How well do you</span>
              <br />
              <span className="text-orange-500">really know Linux?</span>
            </h1>
            <p className="text-lg text-gray-400 mb-8 max-w-xl leading-relaxed">
              Test your Linux knowledge — from basic commands to Linux administration
              and DevOps practices. Get your real Linux level in 60 questions.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onStart}
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg transition-all duration-200 text-lg shadow-lg shadow-orange-600/30 hover:shadow-orange-500/50 hover:scale-[1.02]"
              >
                {user ? "START TEST" : "SIGN IN TO START"}
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              {hasSavedProgress && (
                <button
                  onClick={onContinue}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-lg border border-gray-700 transition-all duration-200 text-lg"
                >
                  CONTINUE
                </button>
              )}
              <button
                onClick={onShowLeaderboard}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-lg border border-gray-700 transition-all duration-200 text-lg"
              >
                <Trophy className="w-5 h-5 text-yellow-400" />
                LEADERBOARD
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10">
              <StatCard icon={FileText} label="Questions" value="60" />
              <StatCard icon={Award} label="Score" value="0–100" />
              <StatCard icon={Server} label="Levels" value="5" />
              <StatCard icon={CheckCircle2} label="Types" value="Multi" />
            </div>
          </div>

          {/* Terminal illustration */}
          <div className="hidden lg:block">
            <div className="bg-[#161b22] border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800 bg-[#0d1117]">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-3 font-mono text-xs text-gray-500">bash — 80×24</span>
              </div>
              <div className="p-6 font-mono text-sm space-y-2">
                <p className="text-gray-500">$ <span className="text-green-400">whoami</span></p>
                <p className="text-gray-300">linux-enthusiast</p>
                <p className="text-gray-500">$ <span className="text-green-400">uname -r</span></p>
                <p className="text-gray-300">6.9.12-arch1-1</p>
                <p className="text-gray-500">$ <span className="text-green-400">echo $SKILL_LEVEL</span></p>
                <p className="text-orange-500 font-bold">??? — take the test to find out</p>
                <p className="text-gray-500">$ <span className="text-green-400">systemctl status career</span></p>
                <p className="text-gray-300">● career.service — <span className="text-green-400">active (running)</span></p>
                <p className="text-gray-500">$ <span className="text-green-400">cat /etc/motd</span></p>
                <p className="text-yellow-500">"Real engineers use Linux."</p>
                <p className="text-gray-500">$ <span className="text-orange-500 cursor-blink">_</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features strip */}
      <div className="border-t border-gray-800 bg-[#161b22]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12">
          <div className="grid sm:grid-cols-3 gap-8">
            <FeatureCard
              icon={Terminal}
              title="Multiple Question Types"
              desc="Single choice, multiple choice, true/false, matching, Bash, and DevOps theory."
            />
            <FeatureCard
              icon={Award}
              title="5 Linux Levels"
              desc="From Windows User to Expert DevOps Engineer — discover where you truly stand."
            />
            <FeatureCard
              icon={Server}
              title="Real-World Scenarios"
              desc="Questions cover Linux basics, Bash, TTY, boot, distributions, Docker, Ansible, Kubernetes, and databases."
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-800 px-4 sm:px-8 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="font-mono text-xs text-gray-600">
            $ echo "Linux Skill Assessment v1.0"
          </span>
          <span className="font-mono text-xs text-gray-600">
            🐧 Powered by Open Source
          </span>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: typeof Terminal; label: string; value: string }) {
  return (
    <div className="bg-gray-800/50 border border-gray-800 rounded-lg px-4 py-3">
      <Icon className="w-5 h-5 text-orange-500 mb-1" />
      <p className="text-xl font-bold text-white">{value}</p>
      <p className="text-xs text-gray-500 font-mono">{label}</p>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: { icon: typeof Terminal; title: string; desc: string }) {
  return (
    <div>
      <div className="w-12 h-12 rounded-lg bg-orange-600/10 border border-orange-600/30 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-orange-500" />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
    </div>
  );
}
