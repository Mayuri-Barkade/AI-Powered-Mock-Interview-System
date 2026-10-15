import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ROLES } from "@/data/questions";
import { useAuth } from "@/contexts/AuthContext";
import { fetchSessions } from "@/services/aiEvaluator";
import { Sparkles, ArrowLeft, Calendar, BarChart3, Trash2 } from "lucide-react";

export default function InterviewHistory() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // LOAD HISTORY FROM DJANGO
  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    fetchSessions(user.id)
      .then((data) => setHistory(data))
      .finally(() => setLoading(false));
  }, [user]);

  // CLEAR HISTORY
  const clearHistory = async () => {
    if (!user?.id) return;
    try {
      await fetch(`http://127.0.0.1:8000/api/ai_feedback/clear-sessions/${user.id}/`, {
        method: "DELETE",
      });
      setHistory([]);
    } catch (error) {
      console.error("Failed to clear history", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-surface">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 glass">
        <div className="container mx-auto flex items-center justify-between h-16 px-6">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold">History</span>
          </div>
          <div />
        </div>
      </nav>

      {/* MAIN */}
      <div className="container mx-auto px-6 py-10 max-w-3xl">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-display font-bold">Interview History</h1>
            <p className="text-muted-foreground">
              {history.length} session{history.length !== 1 ? "s" : ""} recorded
            </p>
          </div>
          {history.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearHistory} className="text-destructive">
              <Trash2 className="w-4 h-4 mr-1" /> Clear All
            </Button>
          )}
        </motion.div>

        {/* LOADING */}
        {loading ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Loading history...</p>
          </div>

        ) : history.length === 0 ? (
          // EMPTY STATE
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <BarChart3 className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-display font-semibold mb-2">No interviews yet</h3>
            <p className="text-muted-foreground mb-6">
              Complete an interview to see your history here.
            </p>
            <Button variant="hero" onClick={() => navigate("/dashboard")}>
              Start an Interview
            </Button>
          </motion.div>

        ) : (
          // HISTORY LIST
          <div className="space-y-3">
            {history.map((session, i) => {
              const role = ROLES.find((r) => r.id === session.role);

              // ← fix: use averageScore (camelCase from Django)
              const score = Number(session.averageScore) || 0;

              // ← fix: use responses array length
              const questionCount = session.responses?.length ?? 0;

              return (
                <motion.button
                  key={session.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => navigate(`/results/${session.id}`)}
                  className="w-full flex items-center gap-4 p-5 rounded-2xl bg-card border border-border hover:shadow-md hover:border-primary/20 transition-all text-left"
                >
                  {/* ICON */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                    role?.color || "from-primary to-primary/70"
                  } flex items-center justify-center text-xl flex-shrink-0`}>
                    {role?.icon || "📝"}
                  </div>

                  {/* DETAILS */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold">
                      {role?.label || "Unknown"}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(session.date).toLocaleDateString()}
                      </span>
                      <span>{questionCount} questions</span>
                    </div>
                  </div>

                  {/* SCORE */}
                  <div className={`text-2xl font-display font-bold ${
                    score >= 80 ? "text-success" :
                    score >= 60 ? "text-warning" :
                    "text-destructive"
                  }`}>
                    {score}%
                  </div>

                </motion.button>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}