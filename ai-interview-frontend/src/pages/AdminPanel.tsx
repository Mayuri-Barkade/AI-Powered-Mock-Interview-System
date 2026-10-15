
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "@/contexts/AuthContext";
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
//   PieChart, Pie, Cell, Legend,
// } from "recharts";
// import {
//   Users, TrendingUp, Trophy, BarChart2, ShieldCheck,
//   LogOut, Sparkles, RefreshCw, Star, AlertCircle,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";

// // ── Types ──────────────────────────────────────────────────────────────────
// interface Session {
//   sessionId: string | number;
//   role: string;
//   date: string;
//   averageScore: number;
//   questionCount: number;
// }

// interface Candidate {
//   id: number;
//   name: string;
//   overallAverage: number;
//   bestScore: number;
//   totalSessions: number;
//   roles: string[];
//   band: "Excellent" | "Good" | "Average" | "Needs Work";
//   sessions: Session[];
// }

// interface Summary {
//   total_candidates: number;
//   total_sessions: number;
//   average_score: number;
//   top_score: number;
//   roles: { role: string; count: number }[];
// }

// // ── Helpers ────────────────────────────────────────────────────────────────
// const BAND_COLOR: Record<string, string> = {
//   Excellent:    "#22c55e",
//   Good:         "#3b82f6",
//   Average:      "#f59e0b",
//   "Needs Work": "#ef4444",
// };

// const ROLE_LABELS: Record<string, string> = {
//   software_developer: "Software Dev",
//   data_analyst:       "Data Analyst",
//   product_manager:    "Product Mgr",
//   devops_engineer:    "DevOps",
//   ml_engineer:        "ML Engineer",
//   frontend_developer: "Frontend Dev",
// };

// function ScoreBadge({ score }: { score: number }) {
//   const color =
//     score >= 80 ? "#22c55e" :
//     score >= 65 ? "#3b82f6" :
//     score >= 45 ? "#f59e0b" : "#ef4444";
//   return (
//     <span
//       style={{ color, background: color + "18", border: `1px solid ${color}40` }}
//       className="px-2 py-0.5 rounded-full text-xs font-bold"
//     >
//       {score}%
//     </span>
//   );
// }

// // ── Main Component ─────────────────────────────────────────────────────────
// export default function AdminPanel() {
//   const { logout } = useAuth();
//   const navigate   = useNavigate();

//   const [candidates, setCandidates] = useState<Candidate[]>([]);
//   const [summary,    setSummary]    = useState<Summary | null>(null);
//   const [loading,    setLoading]    = useState(true);
//   const [selected,   setSelected]   = useState<Candidate | null>(null);
//   const [useMock,    setUseMock]    = useState(false);

//   const load = async () => {
//     setLoading(true);
//     try {
//       const res  = await fetch("http://127.0.0.1:8000/api/ai_feedback/admin/performance/");
//       const data = await res.json();

//       if (data.candidates && data.candidates.length > 0) {
//         setCandidates(data.candidates);
//         setSummary(data.summary);
//         setUseMock(false);
//       } else {
//         setCandidates([]);
//         setSummary({ total_candidates: 0, total_sessions: 0, average_score: 0, top_score: 0, roles: [] });
//         setUseMock(true);
//       }
//     } catch (err) {
//       console.error("Admin fetch failed:", err);
//       setCandidates([]);
//       setSummary({ total_candidates: 0, total_sessions: 0, average_score: 0, top_score: 0, roles: [] });
//       setUseMock(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { load(); }, []);

//   // ── Chart data ─────────────────────────────────────────────────────────
//   const barData = candidates.map((c) => ({
//     name:  c.name.split(" ")[0],
//     score: c.overallAverage,
//     best:  c.bestScore,
//     fill:  BAND_COLOR[c.band],
//   }));

//   const pieData = [
//     { name: "Excellent (≥80)",  value: candidates.filter((c) => c.overallAverage >= 80).length,                               color: "#22c55e" },
//     { name: "Good (65-79)",     value: candidates.filter((c) => c.overallAverage >= 65 && c.overallAverage < 80).length,      color: "#3b82f6" },
//     { name: "Average (45-64)",  value: candidates.filter((c) => c.overallAverage >= 45 && c.overallAverage < 65).length,      color: "#f59e0b" },
//     { name: "Needs Work (<45)", value: candidates.filter((c) => c.overallAverage < 45).length,                                color: "#ef4444" },
//   ].filter((d) => d.value > 0);

//   const roleBarData = summary?.roles.map((r) => ({
//     name:  ROLE_LABELS[r.role] || r.role,
//     count: r.count,
//   })) ?? [];

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-surface flex items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-pulse">
//             <BarChart2 className="w-6 h-6 text-white" />
//           </div>
//           <p className="text-muted-foreground font-medium">Loading performance data…</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-surface">

//       {/* NAV */}
//       <nav className="sticky top-0 z-50 glass border-b border-border/40">
//         <div className="container mx-auto flex items-center justify-between h-16 px-6">
//           <div className="flex items-center gap-3">
//             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
//               <Sparkles className="w-4 h-4 text-white" />
//             </div>
//             <span className="font-display font-bold text-lg">AceInterview</span>
//             <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold ml-1">
//               Admin Panel
//             </span>
//           </div>
//           <div className="flex items-center gap-3">
//             {useMock && (
//               <span className="text-xs text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
//                 No data yet — complete some interviews first
//               </span>
//             )}
//             <Button variant="ghost" size="sm" onClick={load}>
//               <RefreshCw className="w-4 h-4 mr-1" /> Refresh
//             </Button>
//             <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
//               Dashboard
//             </Button>
//             <Button variant="ghost" size="icon" onClick={() => { logout(); navigate("/"); }}>
//               <LogOut className="w-4 h-4" />
//             </Button>
//           </div>
//         </div>
//       </nav>

//       <div className="container mx-auto px-6 py-8 max-w-7xl">

//         {/* SUMMARY CARDS */}
//         {summary && (
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//             {[
//               { icon: Users,     label: "Total Candidates", value: summary.total_candidates,    color: "bg-primary/10 text-primary" },
//               { icon: BarChart2, label: "Total Sessions",   value: summary.total_sessions,      color: "bg-accent/10 text-accent" },
//               { icon: TrendingUp,label: "Average Score",    value: `${summary.average_score}%`, color: "bg-blue-500/10 text-blue-500" },
//               { icon: Trophy,    label: "Top Score",        value: `${summary.top_score}%`,     color: "bg-green-500/10 text-green-500" },
//             ].map((s, i) => (
//               <div key={i} className="p-5 rounded-2xl bg-card border border-border flex items-center gap-4">
//                 <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>
//                   <s.icon className="w-5 h-5" />
//                 </div>
//                 <div>
//                   <div className="text-2xl font-display font-bold">{s.value}</div>
//                   <div className="text-xs text-muted-foreground">{s.label}</div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* NO DATA STATE */}
//         {candidates.length === 0 ? (
//           <div className="text-center py-20 rounded-2xl bg-card border border-border">
//             <BarChart2 className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
//             <h3 className="text-xl font-display font-semibold mb-2">No interview data yet</h3>
//             <p className="text-muted-foreground mb-6">
//               Users need to complete interviews before data appears here.
//             </p>
//             <Button variant="hero" onClick={() => navigate("/dashboard")}>
//               Go to Dashboard
//             </Button>
//           </div>
//         ) : (
//           <>
//             {/* CHARTS ROW */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

//               {/* Bar Chart */}
//               <div className="lg:col-span-2 p-6 rounded-2xl bg-card border border-border">
//                 <h2 className="font-display font-semibold text-base mb-4 flex items-center gap-2">
//                   <BarChart2 className="w-4 h-4 text-primary" />
//                   Candidate Scores (Average vs Best)
//                 </h2>
//                 <ResponsiveContainer width="100%" height={250}>
//                   <BarChart data={barData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
//                     <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
//                     <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
//                     <Tooltip
//                       contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
//                       formatter={(val: number, name: string) => [`${val}%`, name === "score" ? "Avg Score" : "Best Score"]}
//                     />
//                     <Legend formatter={(val) => val === "score" ? "Avg Score" : "Best Score"} />
//                     <Bar dataKey="score" name="score" radius={[4, 4, 0, 0]}>
//                       {barData.map((entry, i) => (
//                         <Cell key={i} fill={entry.fill} />
//                       ))}
//                     </Bar>
//                     <Bar dataKey="best" name="best" fill="#94a3b8" radius={[4, 4, 0, 0]} />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>

//               {/* Pie Chart */}
//               <div className="p-6 rounded-2xl bg-card border border-border">
//                 <h2 className="font-display font-semibold text-base mb-4 flex items-center gap-2">
//                   <ShieldCheck className="w-4 h-4 text-primary" />
//                   Performance Distribution
//                 </h2>
//                 <ResponsiveContainer width="100%" height={180}>
//                   <PieChart>
//                     <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
//                       {pieData.map((entry, i) => (
//                         <Cell key={i} fill={entry.color} />
//                       ))}
//                     </Pie>
//                     <Tooltip
//                       contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
//                       formatter={(val: number) => [`${val} candidate${val !== 1 ? "s" : ""}`]}
//                     />
//                   </PieChart>
//                 </ResponsiveContainer>
//                 <div className="mt-3 space-y-1.5">
//                   {pieData.map((d) => (
//                     <div key={d.name} className="flex items-center justify-between text-xs">
//                       <div className="flex items-center gap-2">
//                         <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
//                         <span className="text-muted-foreground">{d.name}</span>
//                       </div>
//                       <span className="font-semibold">{d.value}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* SESSIONS BY ROLE */}
//             {roleBarData.length > 0 && (
//               <div className="p-6 rounded-2xl bg-card border border-border mb-8">
//                 <h2 className="font-display font-semibold text-base mb-4 flex items-center gap-2">
//                   <Star className="w-4 h-4 text-primary" />
//                   Sessions by Role
//                 </h2>
//                 <ResponsiveContainer width="100%" height={180}>
//                   <BarChart data={roleBarData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
//                     <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
//                     <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
//                     <Tooltip
//                       contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
//                     />
//                     <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             )}

//             {/* CANDIDATES TABLE */}
//             <div className="rounded-2xl bg-card border border-border overflow-hidden mb-8">
//               <div className="px-6 py-4 border-b border-border flex items-center justify-between">
//                 <h2 className="font-display font-semibold text-base flex items-center gap-2">
//                   <Users className="w-4 h-4 text-primary" /> All Candidates
//                 </h2>
//                 <span className="text-xs text-muted-foreground">{candidates.length} total</span>
//               </div>
//               <div className="overflow-x-auto">
//                 <table className="w-full text-sm">
//                   <thead>
//                     <tr className="border-b border-border bg-muted/30">
//                       {["Rank", "Name", "Avg Score", "Best Score", "Sessions", "Roles", "Band", "Details"].map((h) => (
//                         <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
//                           {h}
//                         </th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {candidates.map((c, i) => (
//                       <tr
//                         key={c.id}
//                         className="border-b border-border/50 hover:bg-muted/20 transition-colors cursor-pointer"
//                         onClick={() => setSelected(selected?.id === c.id ? null : c)}
//                       >
//                         <td className="px-4 py-3">
//                           {i === 0 ? <span>🥇</span> :
//                            i === 1 ? <span>🥈</span> :
//                            i === 2 ? <span>🥉</span> :
//                            <span className="text-muted-foreground font-medium">#{i + 1}</span>}
//                         </td>
//                         <td className="px-4 py-3 font-medium">{c.name}</td>
//                         <td className="px-4 py-3"><ScoreBadge score={c.overallAverage} /></td>
//                         <td className="px-4 py-3 text-muted-foreground">{c.bestScore}%</td>
//                         <td className="px-4 py-3 text-muted-foreground">{c.totalSessions}</td>
//                         <td className="px-4 py-3">
//                           <div className="flex flex-wrap gap-1">
//                             {c.roles.map((r) => (
//                               <span key={r} className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-xs">
//                                 {ROLE_LABELS[r] || r}
//                               </span>
//                             ))}
//                           </div>
//                         </td>
//                         <td className="px-4 py-3">
//                           <span
//                             className="px-2 py-0.5 rounded-full text-xs font-semibold"
//                             style={{ color: BAND_COLOR[c.band], background: BAND_COLOR[c.band] + "18" }}
//                           >
//                             {c.band}
//                           </span>
//                         </td>
//                         <td className="px-4 py-3">
//                           <span className="text-xs text-primary underline underline-offset-2">
//                             {selected?.id === c.id ? "Hide ▲" : "View ▼"}
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {selected && (
//             <div className="rounded-2xl bg-card border border-primary/30 p-6 mb-8">
//               <div className="flex items-center justify-between mb-6">
//                 <div>
//                   <h3 className="text-xl font-display font-bold">{selected.name}</h3>
//                   <p className="text-sm text-muted-foreground">
//                     {selected.totalSessions} session{selected.totalSessions !== 1 ? "s" : ""} ·{" "}
//                     <span style={{ color: BAND_COLOR[selected.band] }}>{selected.band}</span>
//                   </p>
//                 </div>
//                 <ScoreBadge score={selected.overallAverage} />
//               </div>

//               <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
//                 Session History
//               </h4>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-2xl">
//                 {selected.sessions.map((s, i) => (
//                   <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50">
//                     <div>
//                       <div className="text-sm font-medium">{ROLE_LABELS[s.role] || s.role}</div>
//                       <div className="text-xs text-muted-foreground">
//                         {s.date} · {s.questionCount} questions
//                       </div>
//                     </div>
//                     <ScoreBadge score={s.averageScore} />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "@/contexts/AuthContext";
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
//   PieChart, Pie, Cell, Legend,
// } from "recharts";
// import {
//   Users, TrendingUp, Trophy, BarChart2, ShieldCheck,
//   LogOut, Sparkles, RefreshCw, Star, X,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";

// interface Session {
//   sessionId: string | number;
//   role: string;
//   date: string;
//   averageScore: number;
//   questionCount: number;
// }

// interface Candidate {
//   id: number;
//   name: string;
//   overallAverage: number;
//   bestScore: number;
//   totalSessions: number;
//   roles: string[];
//   band: "Excellent" | "Good" | "Average" | "Needs Work";
//   sessions: Session[];
// }

// interface Summary {
//   total_candidates: number;
//   total_sessions: number;
//   average_score: number;
//   top_score: number;
//   roles: { role: string; count: number }[];
// }

// const BAND_COLOR: Record<string, string> = {
//   Excellent:    "#22c55e",
//   Good:         "#3b82f6",
//   Average:      "#f59e0b",
//   "Needs Work": "#ef4444",
// };

// const ROLE_LABELS: Record<string, string> = {
//   software_developer: "Software Dev",
//   data_analyst:       "Data Analyst",
//   product_manager:    "Product Mgr",
//   devops_engineer:    "DevOps",
//   ml_engineer:        "ML Engineer",
//   frontend_developer: "Frontend Dev",
// };

// function ScoreBadge({ score }: { score: number }) {
//   const color =
//     score >= 80 ? "#22c55e" :
//     score >= 65 ? "#3b82f6" :
//     score >= 45 ? "#f59e0b" : "#ef4444";
//   return (
//     <span
//       style={{ color, background: color + "18", border: `1px solid ${color}40` }}
//       className="px-2 py-0.5 rounded-full text-xs font-bold"
//     >
//       {score}%
//     </span>
//   );
// }

// // ── Custom clickable bar ───────────────────────────────────────────────────
// const ClickableBar = (props: any) => {
//   const { x, y, width, height, onClick, name } = props;
//   return (
//     <rect
//       x={x} y={y} width={width} height={height}
//       fill="hsl(var(--primary))"
//       rx={4} ry={4}
//       style={{ cursor: "pointer" }}
//       onClick={() => onClick && onClick(name)}
//     />
//   );
// };

// export default function AdminPanel() {
//   const { logout } = useAuth();
//   const navigate   = useNavigate();

//   const [candidates,    setCandidates]    = useState<Candidate[]>([]);
//   const [summary,       setSummary]       = useState<Summary | null>(null);
//   const [loading,       setLoading]       = useState(true);
//   const [selected,      setSelected]      = useState<Candidate | null>(null);
//   const [useMock,       setUseMock]       = useState(false);
//   const [selectedRole,  setSelectedRole]  = useState<string | null>(null);

//   const load = async () => {
//     setLoading(true);
//     try {
//       const res  = await fetch("http://127.0.0.1:8000/api/ai_feedback/admin/performance/");
//       const data = await res.json();
//       if (data.candidates && data.candidates.length > 0) {
//         setCandidates(data.candidates);
//         setSummary(data.summary);
//         setUseMock(false);
//       } else {
//         setCandidates([]);
//         setSummary({ total_candidates: 0, total_sessions: 0, average_score: 0, top_score: 0, roles: [] });
//         setUseMock(true);
//       }
//     } catch (err) {
//       console.error("Admin fetch failed:", err);
//       setCandidates([]);
//       setSummary({ total_candidates: 0, total_sessions: 0, average_score: 0, top_score: 0, roles: [] });
//       setUseMock(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { load(); }, []);

//   // Candidates filtered + sorted for selected role
//   const rolePerformers = selectedRole
//     ? candidates
//         .filter((c) => c.roles.includes(selectedRole))
//         .map((c) => {
//           const roleSessions = c.sessions.filter((s) => s.role === selectedRole);
//           const avg = roleSessions.length
//             ? Math.round(roleSessions.reduce((sum, s) => sum + s.averageScore, 0) / roleSessions.length)
//             : c.overallAverage;
//           return { ...c, roleAvg: avg, roleSessions };
//         })
//         .sort((a, b) => b.roleAvg - a.roleAvg)
//     : [];

//   const barData = candidates.map((c) => ({
//     name:  c.name.split(" ")[0],
//     score: c.overallAverage,
//     best:  c.bestScore,
//     fill:  BAND_COLOR[c.band],
//   }));

//   const pieData = [
//     { name: "Excellent (≥80)",  value: candidates.filter((c) => c.overallAverage >= 80).length,                          color: "#22c55e" },
//     { name: "Good (65-79)",     value: candidates.filter((c) => c.overallAverage >= 65 && c.overallAverage < 80).length, color: "#3b82f6" },
//     { name: "Average (45-64)",  value: candidates.filter((c) => c.overallAverage >= 45 && c.overallAverage < 65).length, color: "#f59e0b" },
//     { name: "Needs Work (<45)", value: candidates.filter((c) => c.overallAverage < 45).length,                           color: "#ef4444" },
//   ].filter((d) => d.value > 0);

//   const roleBarData = summary?.roles.map((r) => ({
//     name:     ROLE_LABELS[r.role] || r.role,
//     rawRole:  r.role,
//     count:    r.count,
//   })) ?? [];

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-surface flex items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-pulse">
//             <BarChart2 className="w-6 h-6 text-white" />
//           </div>
//           <p className="text-muted-foreground font-medium">Loading performance data…</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-surface">

//       {/* NAV */}
//       <nav className="sticky top-0 z-50 glass border-b border-border/40">
//         <div className="container mx-auto flex items-center justify-between h-16 px-6">
//           <div className="flex items-center gap-3">
//             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
//               <Sparkles className="w-4 h-4 text-white" />
//             </div>
//             <span className="font-display font-bold text-lg">AceInterview</span>
//             <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold ml-1">
//               Admin Panel
//             </span>
//           </div>
//           <div className="flex items-center gap-3">
//             {useMock && (
//               <span className="text-xs text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
//                 No data yet — complete some interviews first
//               </span>
//             )}
//             <Button variant="ghost" size="sm" onClick={load}>
//               <RefreshCw className="w-4 h-4 mr-1" /> Refresh
//             </Button>
//             <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
//               Dashboard
//             </Button>
//             <Button variant="ghost" size="icon" onClick={() => { logout(); navigate("/"); }}>
//               <LogOut className="w-4 h-4" />
//             </Button>
//           </div>
//         </div>
//       </nav>

//       <div className="container mx-auto px-6 py-8 max-w-7xl">

//         {/* SUMMARY CARDS */}
//         {summary && (
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//             {[
//               { icon: Users,      label: "Total Candidates", value: summary.total_candidates,    color: "bg-primary/10 text-primary" },
//               { icon: BarChart2,  label: "Total Sessions",   value: summary.total_sessions,      color: "bg-accent/10 text-accent" },
//               { icon: TrendingUp, label: "Average Score",    value: `${summary.average_score}%`, color: "bg-blue-500/10 text-blue-500" },
//               { icon: Trophy,     label: "Top Score",        value: `${summary.top_score}%`,     color: "bg-green-500/10 text-green-500" },
//             ].map((s, i) => (
//               <div key={i} className="p-5 rounded-2xl bg-card border border-border flex items-center gap-4">
//                 <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>
//                   <s.icon className="w-5 h-5" />
//                 </div>
//                 <div>
//                   <div className="text-2xl font-display font-bold">{s.value}</div>
//                   <div className="text-xs text-muted-foreground">{s.label}</div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {candidates.length === 0 ? (
//           <div className="text-center py-20 rounded-2xl bg-card border border-border">
//             <BarChart2 className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
//             <h3 className="text-xl font-display font-semibold mb-2">No interview data yet</h3>
//             <p className="text-muted-foreground mb-6">Users need to complete interviews before data appears here.</p>
//             <Button variant="hero" onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
//           </div>
//         ) : (
//           <>
//             {/* CHARTS ROW */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//               <div className="lg:col-span-2 p-6 rounded-2xl bg-card border border-border">
//                 <h2 className="font-display font-semibold text-base mb-4 flex items-center gap-2">
//                   <BarChart2 className="w-4 h-4 text-primary" />
//                   Candidate Scores (Average vs Best)
//                 </h2>
//                 <ResponsiveContainer width="100%" height={250}>
//                   <BarChart data={barData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
//                     <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
//                     <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
//                     <Tooltip
//                       contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
//                       formatter={(val: number, name: string) => [`${val}%`, name === "score" ? "Avg Score" : "Best Score"]}
//                     />
//                     <Legend formatter={(val) => val === "score" ? "Avg Score" : "Best Score"} />
//                     <Bar dataKey="score" name="score" radius={[4, 4, 0, 0]}>
//                       {barData.map((entry, i) => (
//                         <Cell key={i} fill={entry.fill} />
//                       ))}
//                     </Bar>
//                     <Bar dataKey="best" name="best" fill="#94a3b8" radius={[4, 4, 0, 0]} />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>

//               <div className="p-6 rounded-2xl bg-card border border-border">
//                 <h2 className="font-display font-semibold text-base mb-4 flex items-center gap-2">
//                   <ShieldCheck className="w-4 h-4 text-primary" />
//                   Performance Distribution
//                 </h2>
//                 <ResponsiveContainer width="100%" height={180}>
//                   <PieChart>
//                     <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
//                       {pieData.map((entry, i) => (
//                         <Cell key={i} fill={entry.color} />
//                       ))}
//                     </Pie>
//                     <Tooltip
//                       contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
//                       formatter={(val: number) => [`${val} candidate${val !== 1 ? "s" : ""}`]}
//                     />
//                   </PieChart>
//                 </ResponsiveContainer>
//                 <div className="mt-3 space-y-1.5">
//                   {pieData.map((d) => (
//                     <div key={d.name} className="flex items-center justify-between text-xs">
//                       <div className="flex items-center gap-2">
//                         <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
//                         <span className="text-muted-foreground">{d.name}</span>
//                       </div>
//                       <span className="font-semibold">{d.value}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* SESSIONS BY ROLE — clickable */}
//             {roleBarData.length > 0 && (
//               <div className="p-6 rounded-2xl bg-card border border-border mb-8">
//                 <h2 className="font-display font-semibold text-base mb-1 flex items-center gap-2">
//                   <Star className="w-4 h-4 text-primary" />
//                   Sessions by Role
//                 </h2>
//                 <p className="text-xs text-muted-foreground mb-4">Click a bar to see performers for that role</p>
//                 <ResponsiveContainer width="100%" height={180}>
//                   <BarChart
//                     data={roleBarData}
//                     margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
//                     onClick={(data) => {
//                       if (data?.activePayload?.[0]) {
//                         const raw = data.activePayload[0].payload.rawRole;
//                         setSelectedRole(selectedRole === raw ? null : raw);
//                       }
//                     }}
//                     style={{ cursor: "pointer" }}
//                   >
//                     <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
//                     <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
//                     <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
//                     <Tooltip
//                       contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
//                       formatter={(val: number) => [val, "Sessions"]}
//                       cursor={{ fill: "hsl(var(--primary)/0.08)" }}
//                     />
//                     <Bar
//                       dataKey="count"
//                       radius={[4, 4, 0, 0]}
//                     >
//                       {roleBarData.map((entry, i) => (
//                         <Cell
//                           key={i}
//                           fill={selectedRole === entry.rawRole ? "hsl(var(--accent))" : "hsl(var(--primary))"}
//                         />
//                       ))}
//                     </Bar>
//                   </BarChart>
//                 </ResponsiveContainer>

//                 {/* Role performers panel */}
//                 {selectedRole && (
//                   <div className="mt-6 border-t border-border pt-5">
//                     <div className="flex items-center justify-between mb-4">
//                       <h3 className="font-display font-semibold text-sm flex items-center gap-2">
//                         <Users className="w-4 h-4 text-primary" />
//                         {ROLE_LABELS[selectedRole] || selectedRole} — Top Performers
//                       </h3>
//                       <button
//                         onClick={() => setSelectedRole(null)}
//                         className="text-muted-foreground hover:text-foreground transition-colors"
//                       >
//                         <X className="w-4 h-4" />
//                       </button>
//                     </div>

//                     {rolePerformers.length === 0 ? (
//                       <p className="text-sm text-muted-foreground">No candidates found for this role.</p>
//                     ) : (
//                       <div className="space-y-2">
//                         {rolePerformers.map((c, i) => (
//                           <div
//                             key={c.id}
//                             className="flex items-center justify-between px-4 py-3 rounded-xl bg-muted/30 border border-border/50"
//                           >
//                             <div className="flex items-center gap-3">
//                               <span className="text-lg w-6 text-center">
//                                 {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
//                               </span>
//                               <div>
//                                 <div className="text-sm font-medium">{c.name}</div>
//                                 <div className="text-xs text-muted-foreground">
//                                   {c.roleSessions.length} session{c.roleSessions.length !== 1 ? "s" : ""} in this role
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="flex items-center gap-3">
//                               <span
//                                 className="px-2 py-0.5 rounded-full text-xs font-semibold"
//                                 style={{ color: BAND_COLOR[c.band], background: BAND_COLOR[c.band] + "18" }}
//                               >
//                                 {c.band}
//                               </span>
//                               <ScoreBadge score={c.roleAvg} />
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* CANDIDATES TABLE */}
//             <div className="rounded-2xl bg-card border border-border overflow-hidden mb-8">
//               <div className="px-6 py-4 border-b border-border flex items-center justify-between">
//                 <h2 className="font-display font-semibold text-base flex items-center gap-2">
//                   <Users className="w-4 h-4 text-primary" /> All Candidates
//                 </h2>
//                 <span className="text-xs text-muted-foreground">{candidates.length} total</span>
//               </div>
//               <div className="overflow-x-auto">
//                 <table className="w-full text-sm">
//                   <thead>
//                     <tr className="border-b border-border bg-muted/30">
//                       {["Rank", "Name", "Avg Score", "Best Score", "Sessions", "Roles", "Band", "Details"].map((h) => (
//                         <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
//                           {h}
//                         </th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {candidates.map((c, i) => (
//                       <tr
//                         key={c.id}
//                         className="border-b border-border/50 hover:bg-muted/20 transition-colors cursor-pointer"
//                         onClick={() => setSelected(selected?.id === c.id ? null : c)}
//                       >
//                         <td className="px-4 py-3">
//                           {i === 0 ? <span>🥇</span> :
//                            i === 1 ? <span>🥈</span> :
//                            i === 2 ? <span>🥉</span> :
//                            <span className="text-muted-foreground font-medium">#{i + 1}</span>}
//                         </td>
//                         <td className="px-4 py-3 font-medium">{c.name}</td>
//                         <td className="px-4 py-3"><ScoreBadge score={c.overallAverage} /></td>
//                         <td className="px-4 py-3 text-muted-foreground">{c.bestScore}%</td>
//                         <td className="px-4 py-3 text-muted-foreground">{c.totalSessions}</td>
//                         <td className="px-4 py-3">
//                           <div className="flex flex-wrap gap-1">
//                             {c.roles.map((r) => (
//                               <span key={r} className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-xs">
//                                 {ROLE_LABELS[r] || r}
//                               </span>
//                             ))}
//                           </div>
//                         </td>
//                         <td className="px-4 py-3">
//                           <span
//                             className="px-2 py-0.5 rounded-full text-xs font-semibold"
//                             style={{ color: BAND_COLOR[c.band], background: BAND_COLOR[c.band] + "18" }}
//                           >
//                             {c.band}
//                           </span>
//                         </td>
//                         <td className="px-4 py-3">
//                           <span className="text-xs text-primary underline underline-offset-2">
//                             {selected?.id === c.id ? "Hide ▲" : "View ▼"}
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {selected && (
//               <div className="rounded-2xl bg-card border border-primary/30 p-6 mb-8">
//                 <div className="flex items-center justify-between mb-6">
//                   <div>
//                     <h3 className="text-xl font-display font-bold">{selected.name}</h3>
//                     <p className="text-sm text-muted-foreground">
//                       {selected.totalSessions} session{selected.totalSessions !== 1 ? "s" : ""} ·{" "}
//                       <span style={{ color: BAND_COLOR[selected.band] }}>{selected.band}</span>
//                     </p>
//                   </div>
//                   <ScoreBadge score={selected.overallAverage} />
//                 </div>
//                 <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
//                   Session History
//                 </h4>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-2xl">
//                   {selected.sessions.map((s, i) => (
//                     <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50">
//                       <div>
//                         <div className="text-sm font-medium">{ROLE_LABELS[s.role] || s.role}</div>
//                         <div className="text-xs text-muted-foreground">
//                           {s.date} · {s.questionCount} questions
//                         </div>
//                       </div>
//                       <ScoreBadge score={s.averageScore} />
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  Users, TrendingUp, Trophy, BarChart2, ShieldCheck,
  LogOut, Sparkles, RefreshCw, Star, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Session {
  sessionId: string | number;
  role: string;
  date: string;
  averageScore: number;
  questionCount: number;
}

interface Candidate {
  id: number;
  name: string;
  overallAverage: number;
  bestScore: number;
  totalSessions: number;
  roles: string[];
  band: "Excellent" | "Good" | "Average" | "Needs Work";
  sessions: Session[];
}

interface Summary {
  total_candidates: number;
  total_sessions: number;
  average_score: number;
  top_score: number;
  roles: { role: string; count: number }[];
}

const BAND_COLOR: Record<string, string> = {
  Excellent:    "#22c55e",
  Good:         "#3b82f6",
  Average:      "#f59e0b",
  "Needs Work": "#ef4444",
};

const ROLE_LABELS: Record<string, string> = {
  software_developer: "Software Dev",
  data_analyst:       "Data Analyst",
  product_manager:    "Product Mgr",
  devops_engineer:    "DevOps",
  ml_engineer:        "ML Engineer",
  frontend_developer: "Frontend Dev",
};

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80 ? "#22c55e" :
    score >= 65 ? "#3b82f6" :
    score >= 45 ? "#f59e0b" : "#ef4444";
  return (
    <span
      style={{ color, background: color + "18", border: `1px solid ${color}40` }}
      className="px-2 py-0.5 rounded-full text-xs font-bold"
    >
      {score}%
    </span>
  );
}

export default function AdminPanel() {
  const { logout } = useAuth();
  const navigate   = useNavigate();

  const [candidates,   setCandidates]   = useState<Candidate[]>([]);
  const [summary,      setSummary]      = useState<Summary | null>(null);
  const [loading,      setLoading]      = useState(true);
  const [selected,     setSelected]     = useState<Candidate | null>(null);
  const [useMock,      setUseMock]      = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res  = await fetch("http://127.0.0.1:8000/api/ai_feedback/admin/performance/");
      const data = await res.json();
      if (data.candidates && data.candidates.length > 0) {
        setCandidates(data.candidates);
        setSummary(data.summary);
        setUseMock(false);
      } else {
        setCandidates([]);
        setSummary({ total_candidates: 0, total_sessions: 0, average_score: 0, top_score: 0, roles: [] });
        setUseMock(true);
      }
    } catch (err) {
      console.error("Admin fetch failed:", err);
      setCandidates([]);
      setSummary({ total_candidates: 0, total_sessions: 0, average_score: 0, top_score: 0, roles: [] });
      setUseMock(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // ✅ Role performers with role-specific band
  const rolePerformers = selectedRole
    ? candidates
        .filter((c) => c.roles.includes(selectedRole))
        .map((c) => {
          const roleSessions = c.sessions.filter((s) => s.role === selectedRole);
          const avg = roleSessions.length
            ? Math.round(roleSessions.reduce((sum, s) => sum + s.averageScore, 0) / roleSessions.length)
            : c.overallAverage;
          const roleBand =
            avg >= 80 ? "Excellent" :
            avg >= 65 ? "Good"      :
            avg >= 45 ? "Average"   : "Needs Work";
          return { ...c, roleAvg: avg, roleSessions, roleBand };
        })
        .sort((a, b) => b.roleAvg - a.roleAvg)
    : [];

  const barData = candidates.map((c) => ({
    name:  c.name.split(" ")[0],
    score: c.overallAverage,
    best:  c.bestScore,
    fill:  BAND_COLOR[c.band],
  }));

  const pieData = [
    { name: "Excellent (≥80)",  value: candidates.filter((c) => c.overallAverage >= 80).length,                          color: "#22c55e" },
    { name: "Good (65-79)",     value: candidates.filter((c) => c.overallAverage >= 65 && c.overallAverage < 80).length, color: "#3b82f6" },
    { name: "Average (45-64)",  value: candidates.filter((c) => c.overallAverage >= 45 && c.overallAverage < 65).length, color: "#f59e0b" },
    { name: "Needs Work (<45)", value: candidates.filter((c) => c.overallAverage < 45).length,                           color: "#ef4444" },
  ].filter((d) => d.value > 0);

  const roleBarData = summary?.roles.map((r) => ({
    name:    ROLE_LABELS[r.role] || r.role,
    rawRole: r.role,
    count:   r.count,
  })) ?? [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-pulse">
            <BarChart2 className="w-6 h-6 text-white" />
          </div>
          <p className="text-muted-foreground font-medium">Loading performance data…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-surface">

      {/* NAV */}
      <nav className="sticky top-0 z-50 glass border-b border-border/40">
        <div className="container mx-auto flex items-center justify-between h-16 px-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg">AceInterview</span>
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold ml-1">
              Admin Panel
            </span>
          </div>
          <div className="flex items-center gap-3">
            {useMock && (
              <span className="text-xs text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                No data yet — complete some interviews first
              </span>
            )}
            <Button variant="ghost" size="sm" onClick={load}>
              <RefreshCw className="w-4 h-4 mr-1" /> Refresh
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              Dashboard
            </Button>
            <Button variant="ghost" size="icon" onClick={() => { logout(); navigate("/"); }}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8 max-w-7xl">

        {/* SUMMARY CARDS */}
        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Users,      label: "Total Candidates", value: summary.total_candidates,    color: "bg-primary/10 text-primary" },
              { icon: BarChart2,  label: "Total Sessions",   value: summary.total_sessions,      color: "bg-accent/10 text-accent" },
              { icon: TrendingUp, label: "Average Score",    value: `${summary.average_score}%`, color: "bg-blue-500/10 text-blue-500" },
              { icon: Trophy,     label: "Top Score",        value: `${summary.top_score}%`,     color: "bg-green-500/10 text-green-500" },
            ].map((s, i) => (
              <div key={i} className="p-5 rounded-2xl bg-card border border-border flex items-center gap-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-display font-bold">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {candidates.length === 0 ? (
          <div className="text-center py-20 rounded-2xl bg-card border border-border">
            <BarChart2 className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-display font-semibold mb-2">No interview data yet</h3>
            <p className="text-muted-foreground mb-6">Users need to complete interviews before data appears here.</p>
            <Button variant="hero" onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
          </div>
        ) : (
          <>
            {/* CHARTS ROW */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2 p-6 rounded-2xl bg-card border border-border">
                <h2 className="font-display font-semibold text-base mb-4 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-primary" />
                  Candidate Scores (Average vs Best)
                </h2>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={barData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip
                      contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                      formatter={(val: number, name: string) => [`${val}%`, name === "score" ? "Avg Score" : "Best Score"]}
                    />
                    <Legend formatter={(val) => val === "score" ? "Avg Score" : "Best Score"} />
                    <Bar dataKey="score" name="score" radius={[4, 4, 0, 0]}>
                      {barData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Bar>
                    <Bar dataKey="best" name="best" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border">
                <h2 className="font-display font-semibold text-base mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  Performance Distribution
                </h2>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                      formatter={(val: number) => [`${val} candidate${val !== 1 ? "s" : ""}`]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-3 space-y-1.5">
                  {pieData.map((d) => (
                    <div key={d.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                        <span className="text-muted-foreground">{d.name}</span>
                      </div>
                      <span className="font-semibold">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SESSIONS BY ROLE — clickable */}
            {roleBarData.length > 0 && (
              <div className="p-6 rounded-2xl bg-card border border-border mb-8">
                <h2 className="font-display font-semibold text-base mb-1 flex items-center gap-2">
                  <Star className="w-4 h-4 text-primary" />
                  Sessions by Role
                </h2>
                <p className="text-xs text-muted-foreground mb-4">Click a bar to see performers for that role</p>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart
                    data={roleBarData}
                    margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                    onClick={(data) => {
                      if (data?.activePayload?.[0]) {
                        const raw = data.activePayload[0].payload.rawRole;
                        setSelectedRole(selectedRole === raw ? null : raw);
                      }
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip
                      contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                      formatter={(val: number) => [val, "Sessions"]}
                      cursor={{ fill: "hsl(var(--primary)/0.08)" }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {roleBarData.map((entry, i) => (
                        <Cell
                          key={i}
                          fill={selectedRole === entry.rawRole ? "hsl(var(--accent))" : "hsl(var(--primary))"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>

                {/* ✅ Role performers panel */}
                {selectedRole && (
                  <div className="mt-6 border-t border-border pt-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-display font-semibold text-sm flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        {ROLE_LABELS[selectedRole] || selectedRole} — Top Performers
                      </h3>
                      <button
                        onClick={() => setSelectedRole(null)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {rolePerformers.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No candidates found for this role.</p>
                    ) : (
                      <div className="space-y-2">
                        {rolePerformers.map((c, i) => (
                          <div
                            key={c.id}
                            className="flex items-center justify-between px-4 py-3 rounded-xl bg-muted/30 border border-border/50"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-lg w-6 text-center">
                                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                              </span>
                              <div>
                                <div className="text-sm font-medium">{c.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {c.roleSessions.length} session{c.roleSessions.length !== 1 ? "s" : ""} in this role
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {/* ✅ Band based on role score, not overall */}
                              <span
                                className="px-2 py-0.5 rounded-full text-xs font-semibold"
                                style={{ color: BAND_COLOR[c.roleBand], background: BAND_COLOR[c.roleBand] + "18" }}
                              >
                                {c.roleBand}
                              </span>
                              <ScoreBadge score={c.roleAvg} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* CANDIDATES TABLE */}
            <div className="rounded-2xl bg-card border border-border overflow-hidden mb-8">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <h2 className="font-display font-semibold text-base flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" /> All Candidates
                </h2>
                <span className="text-xs text-muted-foreground">{candidates.length} total</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      {["Rank", "Name", "Avg Score", "Best Score", "Sessions", "Roles", "Band", "Details"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {candidates.map((c, i) => (
                      <tr
                        key={c.id}
                        className="border-b border-border/50 hover:bg-muted/20 transition-colors cursor-pointer"
                        onClick={() => setSelected(selected?.id === c.id ? null : c)}
                      >
                        <td className="px-4 py-3">
                          {i === 0 ? <span>🥇</span> :
                           i === 1 ? <span>🥈</span> :
                           i === 2 ? <span>🥉</span> :
                           <span className="text-muted-foreground font-medium">#{i + 1}</span>}
                        </td>
                        <td className="px-4 py-3 font-medium">{c.name}</td>
                        <td className="px-4 py-3"><ScoreBadge score={c.overallAverage} /></td>
                        <td className="px-4 py-3 text-muted-foreground">{c.bestScore}%</td>
                        <td className="px-4 py-3 text-muted-foreground">{c.totalSessions}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {c.roles.map((r) => (
                              <span key={r} className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-xs">
                                {ROLE_LABELS[r] || r}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className="px-2 py-0.5 rounded-full text-xs font-semibold"
                            style={{ color: BAND_COLOR[c.band], background: BAND_COLOR[c.band] + "18" }}
                          >
                            {c.band}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs text-primary underline underline-offset-2">
                            {selected?.id === c.id ? "Hide ▲" : "View ▼"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {selected && (
              <div className="rounded-2xl bg-card border border-primary/30 p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-display font-bold">{selected.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {selected.totalSessions} session{selected.totalSessions !== 1 ? "s" : ""} ·{" "}
                      <span style={{ color: BAND_COLOR[selected.band] }}>{selected.band}</span>
                    </p>
                  </div>
                  <ScoreBadge score={selected.overallAverage} />
                </div>
                <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
                  Session History
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-2xl">
                  {selected.sessions.map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50">
                      <div>
                        <div className="text-sm font-medium">{ROLE_LABELS[s.role] || s.role}</div>
                        <div className="text-xs text-muted-foreground">
                          {s.date} · {s.questionCount} questions
                        </div>
                      </div>
                      <ScoreBadge score={s.averageScore} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}