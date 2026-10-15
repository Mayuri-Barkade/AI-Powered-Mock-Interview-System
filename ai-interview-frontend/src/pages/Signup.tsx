// // import { useState } from "react";
// // import { motion } from "framer-motion";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import { useNavigate, Link } from "react-router-dom";
// // import { useAuth } from "@/contexts/AuthContext";
// // import { Sparkles, Mail, Lock, User, ArrowRight } from "lucide-react";

// // export default function Signup() {
// //   const [username, setUsername] = useState("");
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [loading, setLoading] = useState(false);
// //   const navigate = useNavigate();
// //   const { signup } = useAuth();

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     setLoading(true);
// //     try {
// //       await signup(username, email, password);
// //       navigate("/dashboard");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-gradient-surface flex">
// //       <div className="hidden lg:flex flex-1 bg-gradient-primary items-center justify-center p-12">
// //         <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="max-w-md">
// //           <div className="w-16 h-16 rounded-2xl bg-primary-foreground/20 flex items-center justify-center mb-8">
// //             <Sparkles className="w-8 h-8 text-primary-foreground" />
// //           </div>
// //           <h2 className="text-4xl font-display font-bold text-primary-foreground mb-4">Start your journey</h2>
// //           <p className="text-primary-foreground/70 text-lg">Get AI-powered feedback on your interview answers and track your progress.</p>
// //         </motion.div>
// //       </div>
// //       <div className="flex-1 flex items-center justify-center p-8">
// //         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
// //           <Link to="/" className="flex items-center gap-2 mb-8">
// //             <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
// //               <Sparkles className="w-4 h-4 text-primary-foreground" />
// //             </div>
// //             <span className="font-display font-bold text-lg">AceInterview</span>
// //           </Link>
// //           <h1 className="text-3xl font-display font-bold mb-2">Create account</h1>
// //           <p className="text-muted-foreground mb-8">Sign up to start practicing interviews</p>
// //           <form onSubmit={handleSubmit} className="space-y-5">
// //             <div className="space-y-2">
// //               <Label htmlFor="username">Username</Label>
// //               <div className="relative">
// //                 <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
// //                 <Input id="username" placeholder="johndoe" className="pl-10" value={username} onChange={(e) => setUsername(e.target.value)} required />
// //               </div>
// //             </div>
// //             <div className="space-y-2">
// //               <Label htmlFor="email">Email</Label>
// //               <div className="relative">
// //                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
// //                 <Input id="email" type="email" placeholder="you@example.com" className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} required />
// //               </div>
// //             </div>
// //             <div className="space-y-2">
// //               <Label htmlFor="password">Password</Label>
// //               <div className="relative">
// //                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
// //                 <Input id="password" type="password" placeholder="••••••••" className="pl-10" value={password} onChange={(e) => setPassword(e.target.value)} required />
// //               </div>
// //             </div>
// //             <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
// //               {loading ? "Creating account..." : "Create account"} <ArrowRight className="w-4 h-4" />
// //             </Button>
// //           </form>
// //           <p className="text-center text-sm text-muted-foreground mt-6">
// //             Already have an account?{" "}
// //             <Link to="/login" className="text-primary font-medium hover:underline">Log in</Link>
// //           </p>
// //         </motion.div>
// //       </div>
// //     </div>
// //   );
// // }
// import { useState } from "react";
// import { motion } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "@/contexts/AuthContext";
// import { Sparkles, Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";

// export default function Signup() {
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const { signup } = useAuth();
//   const [showPassword, setShowPassword] = useState(false);
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await signup(username, email, password);
//       navigate("/dashboard");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-surface flex">
//       <div className="hidden lg:flex flex-1 bg-gradient-primary items-center justify-center p-12">
//         <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="max-w-md">
//           <div className="w-16 h-16 rounded-2xl bg-primary-foreground/20 flex items-center justify-center mb-8">
//             <Sparkles className="w-8 h-8 text-primary-foreground" />
//           </div>
//           <h2 className="text-4xl font-display font-bold text-primary-foreground mb-4">Start your journey</h2>
//           <p className="text-primary-foreground/70 text-lg">Get feedback on your interview answers and track your progress.</p>
//         </motion.div>
//       </div>
//       <div className="flex-1 flex items-center justify-center p-8">
//         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
//           <Link to="/" className="flex items-center gap-2 mb-8">
//             <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
//               <Sparkles className="w-4 h-4 text-primary-foreground" />
//             </div>
//             <span className="font-display font-bold text-lg">AceInterview</span>
//           </Link>
//           <h1 className="text-3xl font-display font-bold mb-2">Create account</h1>
//           <p className="text-muted-foreground mb-8">Sign up to start practicing interviews</p>
//           <form onSubmit={handleSubmit} className="space-y-5">
//             <div className="space-y-2">
//               <Label htmlFor="username">Username</Label>
//               <div className="relative">
//                 <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//                 <Input id="username" placeholder="johndoe" className="pl-10" value={username} onChange={(e) => setUsername(e.target.value)} required />
//               </div>
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//                 <Input id="email" type="email" placeholder="you@example.com" className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} required />
//               </div>
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <div className="relative">
//               <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//               <Input
//                 id="password"
//                 type={showPassword ? "text" : "password"}
//                 placeholder="••••••••"
//                 className="pl-10 pr-10"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
//               >
//                 {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//               </button>
//             </div>
//             </div>
//             <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
//               {loading ? "Creating account..." : "Create account"} <ArrowRight className="w-4 h-4" />
//             </Button>
//           </form>
//           <p className="text-center text-sm text-muted-foreground mt-6">
//             Already have an account?{" "}
//             <Link to="/login" className="text-primary font-medium hover:underline">Log in</Link>
//           </p>
//         </motion.div>
//       </div>
//     </div>
//   );
// }
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Sparkles, Mail, Lock, User, ArrowRight, Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";

// ✅ Password rules
const passwordRules = [
  { label: "At least 8 characters",         test: (p: string) => p.length >= 8 },
  { label: "At least one uppercase letter",  test: (p: string) => /[A-Z]/.test(p) },
  { label: "At least one lowercase letter",  test: (p: string) => /[a-z]/.test(p) },
  { label: "At least one number",            test: (p: string) => /[0-9]/.test(p) },
  { label: "At least one special character", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

export default function Signup() {
  const [username,     setUsername]     = useState("");
  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");
  const [showRules,    setShowRules]    = useState(false);

  const navigate = useNavigate();
  const { signup } = useAuth();

  // ✅ Live password strength
  const passedRules  = passwordRules.filter((r) => r.test(password));
  const strength     = passedRules.length;                           // 0–5
  const strengthLabel =
    strength === 0 ? "" :
    strength <= 2  ? "Weak" :
    strength <= 3  ? "Fair" :
    strength <= 4  ? "Good" :
                     "Strong";
  const strengthColor =
    strength <= 2  ? "bg-red-500" :
    strength === 3 ? "bg-amber-500" :
    strength === 4 ? "bg-yellow-400" :
                     "bg-emerald-500";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // ── Frontend validation ──────────────────────────────────────
    if (username.trim().length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError("Username can only contain letters, numbers, and underscores.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    const failedRules = passwordRules.filter((r) => !r.test(password));
    if (failedRules.length > 0) {
      setError(`Password is too weak: ${failedRules[0].label.toLowerCase()}.`);
      return;
    }

    // ── Call backend ─────────────────────────────────────────────
    setLoading(true);
    try {
      await signup(username, email, password);
      navigate("/dashboard");
    } catch (err: any) {
      // Backend errors: "username already exists", "email already registered", etc.
      const msg: string = err.message || "Signup failed. Please try again.";

      if (msg.toLowerCase().includes("username"))
        setError("This username is already taken. Please choose another.");
      else if (msg.toLowerCase().includes("email"))
        setError("An account with this email already exists.");
      else
        setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-surface flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-1 bg-gradient-primary items-center justify-center p-12">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-primary-foreground/20 flex items-center justify-center mb-8">
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-4xl font-display font-bold text-primary-foreground mb-4">Start your journey</h2>
          <p className="text-primary-foreground/70 text-lg">Get feedback on your interview answers and track your progress.</p>
        </motion.div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg">AceInterview</span>
          </Link>

          <h1 className="text-3xl font-display font-bold mb-2">Create account</h1>
          <p className="text-muted-foreground mb-8">Sign up to start practicing interviews</p>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="username"
                  placeholder="johndoe"
                  className="pl-10"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Letters, numbers, and underscores only. Min 3 characters.
              </p>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setShowRules(true); }}
                  onFocus={() => setShowRules(true)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Strength bar */}
              {password.length > 0 && (
                <div className="space-y-1">
                  <div className="flex gap-1 h-1">
                    {[1,2,3,4,5].map((i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-full transition-all duration-300 ${
                          i <= strength ? strengthColor : "bg-secondary"
                        }`}
                      />
                    ))}
                  </div>
                  {strengthLabel && (
                    <p className={`text-xs font-medium ${
                      strength <= 2 ? "text-red-500" :
                      strength === 3 ? "text-amber-500" :
                      strength === 4 ? "text-yellow-500" : "text-emerald-500"
                    }`}>
                      Password strength: {strengthLabel}
                    </p>
                  )}
                </div>
              )}

              {/* Rules checklist */}
              {showRules && (
                <div className="space-y-1 pt-1">
                  {passwordRules.map((rule) => {
                    const passed = rule.test(password);
                    return (
                      <div key={rule.label} className="flex items-center gap-2">
                        {passed
                          ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          : <XCircle      className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        }
                        <span className={`text-xs ${passed ? "text-emerald-500" : "text-muted-foreground"}`}>
                          {rule.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create account"} <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          {/* Error message */}
          {error && (
            <div className="mt-4 p-3 rounded-xl bg-destructive/10 border border-destructive/30">
              <p className="text-sm text-destructive text-center font-medium">{error}</p>
            </div>
          )}

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">Log in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}