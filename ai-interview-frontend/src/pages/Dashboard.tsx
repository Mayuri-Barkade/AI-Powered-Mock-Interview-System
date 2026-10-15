import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ROLES } from "@/data/questions";
import {
  Sparkles, LogOut, Play, History,
  TrendingUp, User, BarChart2,
} from "lucide-react";
import { fetchSessions } from "@/services/aiEvaluator";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (user?.id) fetchSessions(user.id).then(setHistory);
  }, [user]);

  const completedSessions = history.filter((s) => s.status === "completed");

  const avgScore =
    completedSessions.length > 0
      ? Math.round(
          completedSessions.reduce((a, s) => a + (Number(s.averageScore) || 0), 0) /
            completedSessions.length
        )
      : 0;

  const displayName = user?.username?.includes("@")
    ? user.username.split("@")[0]
    : user?.username;

  return (
    <div className="min-h-screen bg-gradient-surface">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 glass">
        <div className="container mx-auto flex items-center justify-between h-16 px-6">

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg">AceInterview</span>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/history")}>
              <History className="w-4 h-4 mr-1" /> History
            </Button>
            {user?.isStaff && (
              <Button variant="ghost" size="sm" onClick={() => navigate("/admin")}>
                <BarChart2 className="w-4 h-4 mr-1" /> Admin
              </Button>
            )}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">{displayName}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => { logout(); navigate("/"); }}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>

        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="container mx-auto px-6 py-10">

        {/* WELCOME */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
            Welcome back, <span className="text-gradient">{displayName}</span> 👋
          </h1>
          <p className="text-muted-foreground text-lg">
            Choose a role and start a mock interview session.
          </p>
        </motion.div>

        {/* STATS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
        >
          {[
            { icon: Play,       label: "Total Sessions", value: history.length,           color: "bg-primary/10 text-primary" },
            { icon: TrendingUp, label: "Average Score",  value: `${avgScore}%`,           color: "bg-accent/10 text-accent" },
            { icon: History,    label: "Completed",      value: completedSessions.length, color: "bg-success/10 text-success" },
          ].map((s, i) => (
            <div key={i} className="p-6 rounded-2xl bg-card border border-border flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.color}`}>
                <s.icon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-display font-bold">{s.value}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* ROLE SELECTION */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <h2 className="text-xl font-display font-semibold mb-6">Select Interview Role</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ROLES.map((role, i) => (
              <motion.button
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.05 }}
                onClick={() => navigate(`/interview/${role.id}`)}
                className="group p-6 rounded-2xl bg-card border border-border hover:shadow-lg hover:border-primary/20 transition-all duration-300 text-left"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                  {role.icon}
                </div>
                <h3 className="font-display font-semibold text-lg mb-1">{role.label}</h3>
                <p className="text-sm text-muted-foreground">
                  Practice {role.label.toLowerCase()} interview questions
                </p>
              </motion.button>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}