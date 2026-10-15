import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { ROLES, type InterviewSession } from "@/data/questions";
import {
  Sparkles, ArrowLeft, Trophy, Target, MessageSquare,
  Lightbulb, CheckCircle2, AlertCircle, ChevronDown, ChevronUp,
  AlertTriangle, Video, Eye, Users, Mic,
} from "lucide-react";
import { fetchSessionDetail } from "@/services/aiEvaluator";

function ScoreRing({ score, size = 120, label }: { score: number; size?: number; label: string }) {
  const radius       = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset       = circumference - (score / 100) * circumference;
  const color =
    score >= 80 ? "hsl(var(--success))" :
    score >= 60 ? "hsl(var(--warning))" :
    "hsl(var(--destructive))";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
          <motion.circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={color} strokeWidth="8"
            strokeLinecap="round" strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-display font-bold">{score}%</span>
        </div>
      </div>
      <span className="text-sm text-muted-foreground font-medium">{label}</span>
    </div>
  );
}

export default function Results() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const [session,   setSession]   = useState<InterviewSession | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [expandedQ, setExpandedQ] = useState<number | null>(0);

  useEffect(() => {
    if (!sessionId) return;
    fetchSessionDetail(sessionId).then((data) => {
      if (data) setSession(data);
      else navigate("/dashboard");
      setLoading(false);
    });
  }, [sessionId, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading results...</p>
      </div>
    );
  }

  if (!session) return null;

  const role = ROLES.find((r) => r.id === session.role);

  const avgRelevance = Math.round(
    session.responses.reduce((a, r) => a + r.feedback.relevance, 0) / session.responses.length
  );
  const avgTechnical = Math.round(
    session.responses.reduce((a, r) => a + r.feedback.technicalAccuracy, 0) / session.responses.length
  );
  const avgClarity = Math.round(
    session.responses.reduce((a, r) => a + r.feedback.communicationClarity, 0) / session.responses.length
  );

  const warnings: any[] = JSON.parse(
    sessionStorage.getItem(`warnings_${sessionId}`) || "[]"
  );

  const videoScores = session.videoScores ?? null;

  return (
    <div className="min-h-screen bg-gradient-surface">

      {/* NAV */}
      <nav className="sticky top-0 z-50 glass">
        <div className="container mx-auto flex items-center justify-between h-16 px-6">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold">Results</span>
          </div>
          <div />
        </div>
      </nav>

      <div className="container mx-auto px-6 py-10 max-w-4xl">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-success/10 text-success text-sm font-medium mb-4">
            <Trophy className="w-4 h-4" /> Interview Complete
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
            {role?.label} Interview Results
          </h1>
          <p className="text-muted-foreground">Here's how you performed across all questions</p>
        </motion.div>

        {/* SCORE RINGS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { score: session.averageScore, label: "Overall",   icon: Trophy },
            { score: avgRelevance,         label: "Relevance", icon: Target },
            { score: avgTechnical,         label: "Technical", icon: Lightbulb },
            { score: avgClarity,           label: "Clarity",   icon: MessageSquare },
          ].map((item, i) => (
            <div key={i} className="relative p-6 rounded-2xl bg-card border border-border flex flex-col items-center">
              <ScoreRing score={item.score} size={100} label={item.label} />
            </div>
          ))}
        </motion.div>

        {/* VIDEO ANALYSIS CARD */}
        {videoScores && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-8 p-5 rounded-2xl bg-card border border-border"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-rose-500/10 flex items-center justify-center">
                <Video className="w-3.5 h-3.5 text-rose-500" />
              </div>
              <h2 className="font-display font-semibold">Video Analysis</h2>
              <span className="ml-auto text-xs text-muted-foreground">
                Averaged over full session
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  icon: Eye,
                  label: "Eye Contact",
                  score: videoScores.eyeContactScore,
                  tip: videoScores.eyeContactScore >= 60
                    ? "Good eye contact maintained"
                    : "Try to look directly at the camera more",
                },
                {
                  icon: Users,
                  label: "Posture",
                  score: videoScores.postureScore,
                  tip: videoScores.postureScore >= 55
                    ? "Good upright posture"
                    : "Sit up straighter during the interview",
                },
                {
                  icon: Mic,
                  label: "Confidence",
                  score: videoScores.confidenceScore,
                  tip: videoScores.confidenceScore >= 60
                    ? "Confident demeanour detected"
                    : "Try to relax and appear more confident",
                },
              ].map((m, i) => (
                <div key={i} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-secondary/50">
                  <m.icon className="w-4 h-4 text-muted-foreground" />
                  <div className="text-2xl font-display font-bold">{m.score}</div>
                  <div className="text-xs text-muted-foreground font-medium">{m.label}</div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${m.score >= 60 ? "bg-emerald-500" : "bg-amber-500"}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${m.score}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                    />
                  </div>
                  <p className={`text-[11px] text-center leading-tight ${
                    m.score >= 60
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-amber-600 dark:text-amber-400"
                  }`}>
                    {m.tip}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* QUESTION BREAKDOWN */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <h2 className="text-xl font-display font-semibold mb-6">Question Breakdown</h2>
          <div className="space-y-3">
            {session.responses.map((resp, i) => {
              const isExpanded = expandedQ === i;

              const filteredSuggestions = resp.feedback.suggestions?.filter(
                (s) =>
                  !s.toLowerCase().includes("missed") &&
                  !s.toLowerCase().includes("study these topics") &&
                  !s.toLowerCase().includes("study before next")
              ) ?? [];

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.05 }}
                  className="rounded-2xl bg-card border border-border overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedQ(isExpanded ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-sm ${
                        resp.score >= 80 ? "bg-success/10 text-success" :
                        resp.score >= 60 ? "bg-warning/10 text-warning" :
                        "bg-destructive/10 text-destructive"
                      }`}>
                        {resp.score}
                      </span>
                      {/* Use resp.questionText directly — not QUESTIONS_DB lookup */}
                      <span className="font-medium truncate">
                        {resp.questionText}
                      </span>
                    </div>
                    {isExpanded
                      ? <ChevronUp   className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      : <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    }
                  </button>

                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-t border-border"
                    >
                      <div className="p-5 space-y-5">

                        {/* Answer */}
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-2">Your Answer</h4>
                          <p className="text-sm bg-secondary/50 rounded-xl p-4">{resp.answer}</p>
                        </div>

                        {/* Score breakdown */}
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { label: "Relevance",  value: resp.feedback.relevance },
                            { label: "Technical",  value: resp.feedback.technicalAccuracy },
                            { label: "Clarity",    value: resp.feedback.communicationClarity },
                          ].map((m, j) => (
                            <div key={j} className="p-3 rounded-xl bg-secondary/50 text-center">
                              <div className="text-lg font-display font-bold">{m.value}%</div>
                              <div className="text-xs text-muted-foreground">{m.label}</div>
                            </div>
                          ))}
                        </div>

                        {/* Topic coverage */}
                        {(resp.feedback.coveredTopics?.length || resp.feedback.missingTopics?.length) ? (
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-2">Topics Coverage</h4>
                            <div className="flex flex-wrap gap-1.5">
                              {resp.feedback.coveredTopics?.map((t, k) => (
                                <span key={k} className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium border border-emerald-500/20">
                                  ✓ {t}
                                </span>
                              ))}
                              {resp.feedback.missingTopics?.map((t, k) => (
                                <span key={k} className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 text-xs font-medium border border-rose-500/20">
                                  ✗ {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : null}

                        {/* Strengths & Improvements */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium flex items-center gap-1.5 mb-2">
                              <CheckCircle2 className="w-4 h-4 text-success" /> Strengths
                            </h4>
                            <ul className="space-y-1">
                              {resp.feedback.strengths?.length > 0 ? (
                                resp.feedback.strengths.map((s, k) => (
                                  <li key={k} className="text-sm text-muted-foreground">• {s}</li>
                                ))
                              ) : (
                                <li className="text-sm text-muted-foreground">No strengths recorded</li>
                              )}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium flex items-center gap-1.5 mb-2">
                              <AlertCircle className="w-4 h-4 text-warning" /> Improvements
                            </h4>
                            <ul className="space-y-1">
                              {resp.feedback.improvements?.length > 0 ? (
                                resp.feedback.improvements.map((s, k) => (
                                  <li key={k} className="text-sm text-muted-foreground">• {s}</li>
                                ))
                              ) : (
                                <li className="text-sm text-muted-foreground">No improvements recorded</li>
                              )}
                            </ul>
                          </div>
                        </div>

                        {/* Suggestions */}
                        {filteredSuggestions.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium flex items-center gap-1.5 mb-2">
                              <Lightbulb className="w-4 h-4 text-info" /> Suggestions
                            </h4>
                            <ul className="space-y-1">
                              {filteredSuggestions.map((s, k) => (
                                <li key={k} className="text-sm text-muted-foreground">• {s}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* INTEGRITY REPORT */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-8"
        >
          {warnings.length === 0 ? (
            <div className="p-4 rounded-2xl bg-success/10 border border-success/30 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
              <p className="text-sm font-semibold text-success">
                No integrity issues detected during this interview
              </p>
            </div>
          ) : (
            <div className="rounded-2xl bg-card border border-destructive/30 overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                <h3 className="font-display font-semibold text-destructive">
                  Integrity Report — {warnings.length} warning{warnings.length !== 1 ? "s" : ""} recorded
                </h3>
              </div>
              <div className="p-5 space-y-2">
                {warnings.map((w: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-destructive/5 border border-destructive/10">
                    <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium capitalize">{w.type.replace(/_/g, " ")}</p>
                      <p className="text-sm text-muted-foreground">{w.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(w.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* ACTIONS */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 mt-10 justify-center"
        >
          <Button variant="hero"    size="lg" onClick={() => navigate(`/interview/${session.role}`)}>Retry This Role</Button>
          <Button variant="outline" size="lg" onClick={() => navigate("/dashboard")}>Choose Another Role</Button>
          <Button variant="ghost"   size="lg" onClick={() => navigate("/history")}>View History</Button>
        </motion.div>

      </div>
    </div>
  );
}