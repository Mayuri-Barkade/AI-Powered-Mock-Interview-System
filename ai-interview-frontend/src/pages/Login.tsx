// import { useState } from "react";
// import { motion } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "@/contexts/AuthContext";
// import { Sparkles, Mail, Lock, ArrowRight } from "lucide-react";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await login(email, password);
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
//           <h2 className="text-4xl font-display font-bold text-primary-foreground mb-4">Welcome back!</h2>
//           <p className="text-primary-foreground/70 text-lg">Continue practicing and improving your interview skills with AI-powered feedback.</p>
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
//           <h1 className="text-3xl font-display font-bold mb-2">Log in</h1>
//           <p className="text-muted-foreground mb-8">Enter your credentials to access your dashboard</p>
//           <form onSubmit={handleSubmit} className="space-y-5">
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
//                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//                 <Input id="password" type="password" placeholder="••••••••" className="pl-10" value={password} onChange={(e) => setPassword(e.target.value)} required />
//               </div>
//             </div>
//             <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
//               {loading ? "Logging in..." : "Log in"} <ArrowRight className="w-4 h-4" />
//             </Button>
//           </form>
//           <p className="text-center text-sm text-muted-foreground mt-6">
//             Don't have an account?{" "}
//             <Link to="/signup" className="text-primary font-medium hover:underline">Sign up</Link>
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
import { Sparkles, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   try {
  //     await login(email, password);
  //     navigate("/dashboard");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    await login(email, password);
    navigate("/dashboard");
  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-surface flex">
      <div className="hidden lg:flex flex-1 bg-gradient-primary items-center justify-center p-12">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-primary-foreground/20 flex items-center justify-center mb-8">
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-4xl font-display font-bold text-primary-foreground mb-4">Welcome back!</h2>
          <p className="text-primary-foreground/70 text-lg">Continue practicing and improving your interview skills.</p>
        </motion.div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg">AceInterview</span>
          </Link>
          <h1 className="text-3xl font-display font-bold mb-2">Log in</h1>
          <p className="text-muted-foreground mb-8">Enter your credentials to access your dashboard</p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="you@example.com" className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>
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
                onChange={(e) => setPassword(e.target.value)}
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
            </div>
            <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Log in"} <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

{/* ✅ ERROR MESSAGE DISPLAY */}
{error && (
  <p className="text-red-500 text-sm text-center mt-3">
    {error}
  </p>
)}

<p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary font-medium hover:underline">Sign up</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}