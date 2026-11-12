import { useState } from "react";
import { Terminal, ChevronRight, ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface AuthPageProps {
  onBack: () => void;
}

export function AuthPage({ onBack }: AuthPageProps) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = mode === "login" ? await signIn(email, password) : await signUp(email, password);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white flex flex-col">
      {/* Terminal-style top bar */}
      <div className="border-b border-gray-800 bg-[#161b22] px-4 sm:px-8 py-3">
        <div className="flex items-center gap-2 max-w-4xl mx-auto">
          <span className="w-3 h-3 rounded-full bg-red-500" />
          <span className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-3 font-mono text-xs text-gray-400">
            user@linux:~$ {mode === "login" ? "login" : "register"}
          </span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-12">
        <div className="w-full max-w-md">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 font-mono text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> back
          </button>

          <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6 sm:p-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-600/10 border border-orange-600/30 mb-5">
              <Terminal className="w-4 h-4 text-orange-500" />
              <span className="font-mono text-xs text-orange-500 uppercase tracking-wider">
                {mode === "login" ? "Sign In" : "Create Account"}
              </span>
            </div>

            <h1 className="text-2xl font-bold text-white mb-2">
              {mode === "login" ? "Welcome Back" : "Join the Assessment"}
            </h1>
            <p className="text-gray-400 mb-6 text-sm">
              {mode === "login"
                ? "Sign in to take the test and see the leaderboard."
                : "Create an account to save your results and compete with others."}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-mono text-gray-500 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white font-mono text-sm outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-mono text-gray-500 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white font-mono text-sm outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg px-4 py-3 text-sm text-red-400 font-mono">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold rounded-lg transition-all shadow-lg shadow-orange-600/20 font-mono text-sm"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    {mode === "login" ? "SIGN IN" : "CREATE ACCOUNT"}
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setMode(mode === "login" ? "signup" : "login");
                  setError(null);
                }}
                className="text-sm text-gray-400 hover:text-orange-500 transition-colors font-mono"
              >
                {mode === "login"
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
