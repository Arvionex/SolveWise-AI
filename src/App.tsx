import { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { UserProfile, Language } from "./types";
import { TRANSLATIONS } from "./constants";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { CategoryGrid } from "./components/CategoryGrid";
import { ProblemSolver } from "./components/ProblemSolver";
import { History } from "./components/History";
import { Community } from "./components/Community";
import { Premium } from "./components/Premium";
import { Donation } from "./components/Donation";
import { AdminPanel } from "./components/AdminPanel";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";

function AppContent() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [lang, setLang] = useState<Language>("en");
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("tech");
  
  const navigate = useNavigate();
  const location = useLocation();

  const t = (key: string) => TRANSLATIONS[key]?.[lang] || key;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
        } else {
          const newProfile: UserProfile = {
            uid: user.uid,
            email: user.email || "",
            displayName: user.displayName || "User",
            role: "free",
            createdAt: new Date().toISOString(),
          };
          await setDoc(docRef, newProfile);
          setProfile(newProfile);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = () => signOut(auth);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const setView = (view: string) => {
    if (view === "home") navigate("/");
    else if (view === "solver") navigate("/solve");
    else navigate(`/${view}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Navbar 
        user={user} 
        profile={profile} 
        lang={lang} 
        setLang={setLang} 
        handleLogin={handleLogin} 
        handleLogout={handleLogout} 
        setView={setView}
        t={t}
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={
            <div className="animate-slide-up">
              <Hero t={t} setView={setView} />
              <CategoryGrid t={t} setView={setView} setSelectedCategory={setSelectedCategory} />
            </div>
          } />
          <Route path="/solve" element={
            <ProblemSolver 
              user={user} 
              profile={profile} 
              lang={lang} 
              t={t} 
              category={selectedCategory} 
              setView={setView}
            />
          } />
          <Route path="/history" element={<History user={user} lang={lang} t={t} />} />
          <Route path="/community" element={<Community lang={lang} t={t} />} />
          <Route path="/premium" element={<Premium user={user} profile={profile} lang={lang} t={t} />} />
          <Route path="/donation" element={<Donation user={user} profile={profile} lang={lang} t={t} />} />
          <Route path="/admin" element={profile?.role === "admin" ? <AdminPanel lang={lang} t={t} /> : <div className="text-center py-20 font-black text-slate-300">UNAUTHORIZED</div>} />
        </Routes>
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© 2026 SolveWise AI. {t("tagline")}</p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
