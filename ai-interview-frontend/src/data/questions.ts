export interface InterviewQuestion {
  id: number;
  role: string;
  category: string;
  question: string;
  difficulty: "easy" | "medium" | "hard";
  expectedTopics: string[];
}


export interface InterviewResponse {
  questionId:   number;
  questionText: string;
  answer:       string;
  score:        number;
  feedback: {
    relevance:            number;
    technicalAccuracy:    number;
    communicationClarity: number;
    // confidence:           number;
    // grammar:              number;
    overallScore:         number;
    strengths:            string[];
    improvements:         string[];
    suggestions:          string[];
    missingTopics?: string[];
    coveredTopics?:       string[];
  };
}
export interface VideoScores {
  eyeContactScore:  number;
  postureScore:     number;
  confidenceScore:  number;
}
export interface InterviewSession {
  id:           string;
  role:         string;
  date:         string;
  responses:    InterviewResponse[];
  averageScore: number;
  status:       "in_progress" | "completed";
  videoScores?: VideoScores;   // ← ADD THIS
}

export const ROLES = [
  { id: "software_developer", label: "Software Developer", icon: "💻", color: "from-primary to-primary/70" },
  { id: "data_analyst", label: "Data Analyst", icon: "📊", color: "from-info to-info/70" },
  { id: "product_manager", label: "Product Manager", icon: "📋", color: "from-accent to-accent/70" },
  { id: "devops_engineer", label: "DevOps Engineer", icon: "⚙️", color: "from-warning to-warning/70" },
  { id: "ml_engineer", label: "ML Engineer", icon: "🤖", color: "from-success to-success/70" },
  { id: "frontend_developer", label: "Frontend Developer", icon: "🎨", color: "from-destructive to-destructive/70" },
] as const;
export const QUESTIONS_DB: InterviewQuestion[] = [
  // ================= SOFTWARE DEVELOPER (10) =================
  { id: 1, role: "software_developer", category: "DSA", question: "Explain the difference between a stack and a queue. When would you use each?", difficulty: "easy", expectedTopics: ["LIFO", "FIFO", "use cases", "data structure"] },
  { id: 2, role: "software_developer", category: "OOP", question: "What are the four pillars of Object-Oriented Programming? Explain with examples.", difficulty: "medium", expectedTopics: ["encapsulation", "inheritance", "polymorphism", "abstraction"] },
  { id: 3, role: "software_developer", category: "System Design", question: "How would you design a URL shortener like bit.ly?", difficulty: "hard", expectedTopics: ["hashing", "database", "redirection", "scalability", "analytics"] },
  { id: 4, role: "software_developer", category: "Web", question: "Explain the difference between REST and GraphQL APIs.", difficulty: "medium", expectedTopics: ["endpoints", "query", "over-fetching", "schema", "flexibility"] },
  { id: 5, role: "software_developer", category: "Database", question: "What is database normalization? Explain first, second, and third normal forms.", difficulty: "medium", expectedTopics: ["1NF", "2NF", "3NF", "redundancy", "functional dependency"] },

  { id: 6, role: "software_developer", category: "DSA", question: "What is time complexity? Explain Big-O notation with examples.", difficulty: "easy", expectedTopics: ["Big-O", "time complexity", "performance", "algorithms"] },
  { id: 7, role: "software_developer", category: "System Design", question: "How would you design a scalable chat application?", difficulty: "hard", expectedTopics: ["websockets", "real-time", "scaling", "database", "message queue"] },
  { id: 8, role: "software_developer", category: "OOP", question: "What is the difference between abstract class and interface?", difficulty: "medium", expectedTopics: ["abstraction", "inheritance", "methods", "implementation"] },
  { id: 9, role: "software_developer", category: "Database", question: "What is indexing in databases and why is it important?", difficulty: "medium", expectedTopics: ["index", "query optimization", "performance", "B-tree"] },
  { id: 10, role: "software_developer", category: "Web", question: "What happens when you type a URL in the browser?", difficulty: "hard", expectedTopics: ["DNS", "HTTP", "TCP/IP", "server", "rendering"] },

  // ================= DATA ANALYST (10) =================
  { id: 11, role: "data_analyst", category: "SQL", question: "Explain the difference between INNER JOIN, LEFT JOIN, and FULL OUTER JOIN with examples.", difficulty: "easy", expectedTopics: ["join types", "matching rows", "null values", "Venn diagram"] },
  { id: 12, role: "data_analyst", category: "Statistics", question: "What is the Central Limit Theorem and why is it important in data analysis?", difficulty: "medium", expectedTopics: ["normal distribution", "sample size", "mean", "standard deviation"] },
  { id: 13, role: "data_analyst", category: "Visualization", question: "How would you choose the right chart type for presenting data? Give examples.", difficulty: "easy", expectedTopics: ["bar chart", "line chart", "scatter plot", "pie chart", "audience"] },

  { id: 14, role: "data_analyst", category: "SQL", question: "What is the difference between WHERE and HAVING clause?", difficulty: "easy", expectedTopics: ["filtering", "group by", "aggregation"] },
  { id: 15, role: "data_analyst", category: "Statistics", question: "Explain mean, median, and mode with examples.", difficulty: "easy", expectedTopics: ["central tendency", "distribution"] },
  { id: 16, role: "data_analyst", category: "Python", question: "How is Pandas used in data analysis?", difficulty: "medium", expectedTopics: ["dataframe", "cleaning", "analysis"] },
  { id: 17, role: "data_analyst", category: "Visualization", question: "What are the best practices for dashboard design?", difficulty: "medium", expectedTopics: ["clarity", "layout", "KPIs", "user experience"] },
  { id: 18, role: "data_analyst", category: "SQL", question: "What are window functions in SQL?", difficulty: "hard", expectedTopics: ["rank", "partition", "over clause"] },
  { id: 19, role: "data_analyst", category: "Statistics", question: "What is hypothesis testing?", difficulty: "medium", expectedTopics: ["null hypothesis", "p-value", "significance"] },
  { id: 20, role: "data_analyst", category: "Excel", question: "How do pivot tables help in analysis?", difficulty: "easy", expectedTopics: ["aggregation", "summarization"] },

  // ================= PRODUCT MANAGER (10) =================
  { id: 21, role: "product_manager", category: "Strategy", question: "How would you prioritize features for a new product release?", difficulty: "medium", expectedTopics: ["MoSCoW", "RICE", "user impact", "business value", "effort"] },
  { id: 22, role: "product_manager", category: "Metrics", question: "What KPIs would you track for a mobile app launch?", difficulty: "medium", expectedTopics: ["DAU", "retention", "conversion", "NPS", "churn rate"] },

  { id: 23, role: "product_manager", category: "Product Sense", question: "How would you improve Instagram?", difficulty: "medium", expectedTopics: ["user experience", "features", "engagement"] },
  { id: 24, role: "product_manager", category: "Execution", question: "How do you handle missed deadlines?", difficulty: "easy", expectedTopics: ["communication", "planning"] },
  { id: 25, role: "product_manager", category: "Strategy", question: "What is product-market fit?", difficulty: "medium", expectedTopics: ["market", "demand", "user satisfaction"] },
  { id: 26, role: "product_manager", category: "Analytics", question: "How do you analyze a drop in user retention?", difficulty: "hard", expectedTopics: ["data analysis", "funnels", "cohorts"] },
  { id: 27, role: "product_manager", category: "UX", question: "What makes a good user experience?", difficulty: "easy", expectedTopics: ["usability", "design", "feedback"] },
  { id: 28, role: "product_manager", category: "Stakeholders", question: "How do you handle conflicting stakeholder requirements?", difficulty: "medium", expectedTopics: ["negotiation", "prioritization"] },
  { id: 29, role: "product_manager", category: "Roadmap", question: "What is a product roadmap?", difficulty: "easy", expectedTopics: ["planning", "timeline"] },
  { id: 30, role: "product_manager", category: "Launch", question: "How would you launch a new feature?", difficulty: "medium", expectedTopics: ["testing", "marketing", "rollout"] },

  // ================= DEVOPS ENGINEER (10) =================
  { id: 31, role: "devops_engineer", category: "CI/CD", question: "Explain a CI/CD pipeline and its stages.", difficulty: "medium", expectedTopics: ["build", "test", "deploy", "automation", "integration"] },
  { id: 32, role: "devops_engineer", category: "Containers", question: "What is Docker and how does it differ from virtual machines?", difficulty: "easy", expectedTopics: ["containerization", "images", "lightweight", "isolation", "kernel"] },

  { id: 33, role: "devops_engineer", category: "Cloud", question: "What is AWS EC2?", difficulty: "easy", expectedTopics: ["virtual machine", "cloud"] },
  { id: 34, role: "devops_engineer", category: "CI/CD", question: "What tools are used in CI/CD?", difficulty: "easy", expectedTopics: ["Jenkins", "GitHub Actions"] },
  { id: 35, role: "devops_engineer", category: "Monitoring", question: "What is monitoring in DevOps?", difficulty: "medium", expectedTopics: ["logs", "metrics", "alerts"] },
  { id: 36, role: "devops_engineer", category: "Containers", question: "What is Kubernetes?", difficulty: "medium", expectedTopics: ["orchestration", "pods", "scaling"] },
  { id: 37, role: "devops_engineer", category: "Security", question: "What is DevSecOps?", difficulty: "medium", expectedTopics: ["security", "integration"] },
  { id: 38, role: "devops_engineer", category: "Networking", question: "Explain load balancing.", difficulty: "easy", expectedTopics: ["traffic", "distribution"] },
  { id: 39, role: "devops_engineer", category: "Infrastructure", question: "What is Infrastructure as Code?", difficulty: "medium", expectedTopics: ["Terraform", "automation"] },
  { id: 40, role: "devops_engineer", category: "Cloud", question: "What is serverless computing?", difficulty: "medium", expectedTopics: ["Lambda", "event-driven"] },

  // ================= ML ENGINEER (10) =================
  { id: 41, role: "ml_engineer", category: "Fundamentals", question: "Explain the bias-variance tradeoff in machine learning.", difficulty: "medium", expectedTopics: ["underfitting", "overfitting", "generalization", "model complexity"] },
  { id: 42, role: "ml_engineer", category: "Deep Learning", question: "What is a convolutional neural network and where is it used?", difficulty: "medium", expectedTopics: ["convolution", "pooling", "feature extraction", "image recognition"] },

  { id: 43, role: "ml_engineer", category: "ML Basics", question: "What is supervised vs unsupervised learning?", difficulty: "easy", expectedTopics: ["labels", "clustering"] },
  { id: 44, role: "ml_engineer", category: "Evaluation", question: "What is precision and recall?", difficulty: "medium", expectedTopics: ["metrics", "classification"] },
  { id: 45, role: "ml_engineer", category: "Models", question: "Explain decision trees.", difficulty: "easy", expectedTopics: ["nodes", "splitting"] },
  { id: 46, role: "ml_engineer", category: "Optimization", question: "What is gradient descent?", difficulty: "medium", expectedTopics: ["learning rate", "optimization"] },
  { id: 47, role: "ml_engineer", category: "Deep Learning", question: "What are activation functions?", difficulty: "medium", expectedTopics: ["relu", "sigmoid"] },
  { id: 48, role: "ml_engineer", category: "NLP", question: "What is NLP?", difficulty: "easy", expectedTopics: ["text processing"] },
  { id: 49, role: "ml_engineer", category: "Overfitting", question: "How do you prevent overfitting?", difficulty: "medium", expectedTopics: ["regularization", "dropout"] },
  { id: 50, role: "ml_engineer", category: "Deployment", question: "How do you deploy ML models?", difficulty: "hard", expectedTopics: ["API", "scaling"] },

  // ================= FRONTEND DEVELOPER (10) =================
  { id: 51, role: "frontend_developer", category: "React", question: "Explain the virtual DOM and how React uses it for efficient rendering.", difficulty: "medium", expectedTopics: ["diffing", "reconciliation", "performance", "real DOM", "batch updates"] },
  { id: 52, role: "frontend_developer", category: "CSS", question: "What is the difference between Flexbox and CSS Grid? When would you use each?", difficulty: "easy", expectedTopics: ["one-dimensional", "two-dimensional", "layout", "alignment", "responsive"] },

  { id: 53, role: "frontend_developer", category: "JavaScript", question: "What is closure in JavaScript?", difficulty: "medium", expectedTopics: ["scope", "function"] },
  { id: 54, role: "frontend_developer", category: "React", question: "What are React hooks?", difficulty: "easy", expectedTopics: ["useState", "useEffect"] },
  { id: 55, role: "frontend_developer", category: "Performance", question: "How do you optimize frontend performance?", difficulty: "medium", expectedTopics: ["lazy loading", "caching"] },
  { id: 56, role: "frontend_developer", category: "CSS", question: "What is responsive design?", difficulty: "easy", expectedTopics: ["media queries"] },
  { id: 57, role: "frontend_developer", category: "JavaScript", question: "Explain event bubbling.", difficulty: "medium", expectedTopics: ["event propagation"] },
  { id: 58, role: "frontend_developer", category: "Web", question: "What is CORS?", difficulty: "medium", expectedTopics: ["cross-origin"] },
  { id: 59, role: "frontend_developer", category: "React", question: "What is state vs props?", difficulty: "easy", expectedTopics: ["data flow"] },
  { id: 60, role: "frontend_developer", category: "Testing", question: "How do you test frontend applications?", difficulty: "medium", expectedTopics: ["jest", "testing library"] },
];