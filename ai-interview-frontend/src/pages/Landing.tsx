// import { motion } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import { useNavigate } from "react-router-dom";
// import { Mic, Brain, BarChart3, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

// const features = [
//   { icon: Mic, title: "Voice-Powered Answers", desc: "Speak naturally — our speech recognition captures your response in real-time." },
//   { icon: Brain, title: "AI Evaluation Engine", desc: "Advanced NLP model evaluates relevance, accuracy, and communication clarity." },
//   { icon: BarChart3, title: "Detailed Analytics", desc: "Get scores, strengths, and personalized improvement suggestions." },
// ];

// const stats = [
//   { value: "6+", label: "Job Roles" },
//   { value: "50+", label: "Questions" },
//   { value: "3", label: "AI Metrics" },
//   { value: "100%", label: "Free" },
// ];

// export default function Landing() {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen bg-gradient-surface">
//       {/* Nav */}
//       <nav className="fixed top-0 w-full z-50 glass">
//         <div className="container mx-auto flex items-center justify-between h-16 px-6">
//           <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
//             <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
//               <Sparkles className="w-4 h-4 text-primary-foreground" />
//             </div>
//             <span className="font-display font-bold text-lg text-foreground">AceInterview</span>
//           </motion.div>
//           <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
//             <Button variant="ghost" onClick={() => navigate("/login")}>Log in</Button>
//             <Button variant="hero" onClick={() => navigate("/signup")}>Get Started</Button>
//           </motion.div>
//         </div>
//       </nav>

//       {/* Hero */}
//       <section className="pt-32 pb-20 px-6">
//         <div className="container mx-auto text-center max-w-4xl">
//           <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
//             <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
//               <Sparkles className="w-3.5 h-3.5" /> AI-Powered Interview Coach
//             </span>
//             <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6">
//               Ace Your Next
//               <br />
//               <span className="text-gradient">Interview</span>
//             </h1>
//             <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
//               Practice with AI-generated questions tailored to your role, get instant feedback on your answers, and track your improvement over time.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <Button variant="hero" size="xl" onClick={() => navigate("/signup")}>
//                 Start Practicing Free <ArrowRight className="w-5 h-5" />
//               </Button>
//               <Button variant="outline" size="xl" onClick={() => navigate("/login")}>
//                 I have an account
//               </Button>
//             </div>
//           </motion.div>

//           {/* Stats */}
//           <motion.div
//             initial={{ opacity: 0, y: 40 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3, duration: 0.6 }}
//             className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
//           >
//             {stats.map((s, i) => (
//               <div key={i} className="p-6 rounded-2xl bg-card shadow-sm border border-border">
//                 <div className="text-3xl font-display font-bold text-gradient">{s.value}</div>
//                 <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
//               </div>
//             ))}
//           </motion.div>
//         </div>
//       </section>

//       {/* Features */}
//       <section className="py-20 px-6">
//         <div className="container mx-auto max-w-5xl">
//           <motion.div
//             initial={{ opacity: 0 }}
//             whileInView={{ opacity: 1 }}
//             viewport={{ once: true }}
//             className="text-center mb-16"
//           >
//             <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">How It Works</h2>
//             <p className="text-muted-foreground text-lg max-w-xl mx-auto">Three simple steps to better interview performance</p>
//           </motion.div>
//           <div className="grid md:grid-cols-3 gap-8">
//             {features.map((f, i) => (
//               <motion.div
//                 key={i}
//                 initial={{ opacity: 0, y: 30 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: i * 0.15 }}
//                 className="group p-8 rounded-2xl bg-card border border-border hover:shadow-lg hover:border-primary/20 transition-all duration-300"
//               >
//                 <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
//                   <f.icon className="w-6 h-6 text-primary-foreground" />
//                 </div>
//                 <h3 className="text-xl font-display font-semibold mb-3">{f.title}</h3>
//                 <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA */}
//       <section className="py-20 px-6">
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95 }}
//           whileInView={{ opacity: 1, scale: 1 }}
//           viewport={{ once: true }}
//           className="container mx-auto max-w-3xl text-center p-12 rounded-3xl bg-gradient-primary shadow-glow"
//         >
//           <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-4">Ready to Practice?</h2>
//           <p className="text-primary-foreground/80 text-lg mb-8">Join thousands of candidates who improved their interview skills with AI feedback.</p>
//           <Button variant="secondary" size="xl" onClick={() => navigate("/signup")}>
//             Create Free Account <ArrowRight className="w-5 h-5" />
//           </Button>
//         </motion.div>
//       </section>

//       {/* Footer */}
//       <footer className="py-8 px-6 border-t border-border">
//         <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
//           <div className="flex items-center gap-2">
//             <div className="w-6 h-6 rounded bg-gradient-primary flex items-center justify-center">
//               <Sparkles className="w-3 h-3 text-primary-foreground" />
//             </div>
//             <span className="font-display font-semibold text-sm">AceInterview</span>
//           </div>
//           <p className="text-sm text-muted-foreground">© 2026 AI Interview Feedback System. Final Year Project.</p>
//         </div>
//       </footer>
//     </div>
//   );
// }
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Mic, Brain, BarChart3, ArrowRight, Sparkles,
  Camera, ShieldCheck, LayoutDashboard,
} from "lucide-react";

const features = [
  {
    icon: Mic,
    title: "Voice-Powered Answers",
    desc: "Speak naturally — our speech recognition captures your response in real-time.",
  },
  {
  icon: Brain,
  title: "DistilBERT Evaluation Engine",
  desc: "Fine-tuned DistilBERT transformer model evaluates your answers across technical accuracy, communication clarity, confidence, grammar, and relevance.",
},
  {
    icon: BarChart3,
    title: "Detailed Analytics",
    desc: "Get scores, strengths, and personalized improvement suggestions per question.",
  },
  {
    icon: Camera,
    title: "Live Video Analysis",
    desc: "Real-time facial expression detection scores your eye contact, posture, and confidence during the interview.",
  },
  {
    icon: ShieldCheck,
    title: "Anti-Cheat Monitoring",
    desc: "Tab-switch detection, fullscreen enforcement, and face presence monitoring ensure interview integrity.",
  },
  {
    icon: LayoutDashboard,
    title: "Admin Dashboard",
    desc: "Examiners get a full performance overview — candidate rankings, score distributions, and session history.",
  },
];

const stats = [
  { value: "6",   label: "Job Roles" },
  { value: "140+",  label: "Questions" },
  { value: "5+",    label: "Metrics" },
  { value: "100%", label: "Free" },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-surface">

      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 glass">
        <div className="container mx-auto flex items-center justify-between h-16 px-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg text-foreground">AceInterview</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <Button variant="ghost" onClick={() => navigate("/login")}>Log in</Button>
            <Button variant="hero"  onClick={() => navigate("/signup")}>Get Started</Button>
          </motion.div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5" /> AI-Powered Interview Coach
            </span> */}
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6">
              Ace Your Next
              <br />
              <span className="text-gradient">Interview</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                 Practice with role-specific interview questions, get instant feedback powered
                 by a fine-tuned DistilBERT transformer model, and track your improvement over time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" onClick={() => navigate("/signup")}>
                Start Practicing Free <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="xl" onClick={() => navigate("/login")}>
                I have an account
              </Button>
            </div>
          </motion.div>

          {/* STATS */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
          >
            {stats.map((s, i) => (
              <div key={i} className="p-6 rounded-2xl bg-card shadow-sm border border-border">
                <div className="text-3xl font-display font-bold text-gradient">{s.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              A complete Interview preparation platform
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 rounded-2xl bg-card border border-border hover:shadow-lg hover:border-primary/20 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <f.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-display font-semibold mb-3">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-6 bg-card/50">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg">Three simple steps to better interview performance</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Choose a Role",     desc: "Select from Software Developer, Data Analyst, Product Manager and more." },
              { step: "02", title: "Answer Questions",  desc: "Respond via voice or text while AI monitors your expression and presence." },
              { step: "03", title: "Get Feedback",      desc: "Receive detailed scores, strengths, improvements and suggestions instantly." },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center p-8 rounded-2xl bg-card border border-border"
              >
                <div className="text-5xl font-display font-bold text-gradient mb-4">{s.step}</div>
                <h3 className="text-xl font-display font-semibold mb-3">{s.title}</h3>
                <p className="text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="container mx-auto max-w-3xl text-center p-12 rounded-3xl bg-gradient-primary shadow-glow"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-4">
            Ready to Practice?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8">
            Join thousands of candidates who improved their interview skills with AI feedback.
          </p>
          <Button variant="secondary" size="xl" onClick={() => navigate("/signup")}>
            Create Free Account <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-primary flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold text-sm">AceInterview</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 AI Interview Feedback System. Final Year Project.
          </p>
        </div>
      </footer>

    </div>
  );
}