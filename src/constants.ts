import { Language } from "./types";

export const CATEGORIES = [
  { id: "tech", label: { en: "Technology", hi: "तकनीक" }, icon: "Laptop", color: "from-blue-500 to-indigo-600" },
  { id: "home", label: { en: "Home Repair", hi: "घर की मरम्मत" }, icon: "Home", color: "from-orange-500 to-red-600" },
  { id: "career", label: { en: "Career", hi: "करियर" }, icon: "Briefcase", color: "from-emerald-500 to-teal-600" },
  { id: "study", label: { en: "Study", hi: "पढ़ाई" }, icon: "Book", color: "from-purple-500 to-pink-600" },
  { id: "relationship", label: { en: "Relationship", hi: "रिश्ते" }, icon: "Heart", color: "from-rose-500 to-pink-500" },
  { id: "business", label: { en: "Business", hi: "व्यापार" }, icon: "TrendingUp", color: "from-cyan-500 to-blue-600" },
];

export const TRANSLATIONS: Record<string, Record<Language, string>> = {
  appName: { en: "SolveWise AI", hi: "सॉल्ववाइज AI" },
  tagline: { en: "Your AI Problem Solver", hi: "आपका AI समस्या समाधानकर्ता" },
  searchPlaceholder: { en: "Describe your problem...", hi: "अपनी समस्या बताएं..." },
  solveBtn: { en: "Solve Problem", hi: "समाधान पाएं" },
  categories: { en: "Categories", hi: "श्रेणियां" },
  history: { en: "History", hi: "इतिहास" },
  community: { en: "Community", hi: "समुदाय" },
  premium: { en: "Premium", hi: "प्रीमियम" },
  donation: { en: "Donation", hi: "दान" },
  login: { en: "Login", hi: "लॉगिन" },
  logout: { en: "Logout", hi: "लॉगआउट" },
  summary: { en: "Summary", hi: "सारांश" },
  causes: { en: "Possible Causes", hi: "संभावित कारण" },
  steps: { en: "Solution Steps", hi: "समाधान के चरण" },
  cost: { en: "Estimated Cost", hi: "अनुमानित लागत" },
  worker: { en: "Recommended Service", hi: "अनुशंसित सेवा" },
};
