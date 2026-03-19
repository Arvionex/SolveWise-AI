import { useState, useEffect, Component, ErrorInfo, ReactNode, Suspense } from "react";
import { UserProfile, Language } from "./types";
import { TRANSLATIONS } from "./constants";
import { Navbar } from "./components/Navbar";
import { LoginModal } from "./components/LoginModal";
import { Hero } from "./components/Hero";
import { CategoryGrid } from "./components/CategoryGrid";
import { ProblemSolver } from "./components/ProblemSolver";
import { History } from "./components/History";
import { Community } from "./components/Community";
import { Premium } from "./components/Premium";
import { Donation } from "./components/Donation";
import { AdminPanel } from "./components/AdminPanel";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { auth, db, handleFirestoreError, OperationType } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";

// Error Boundary Component
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      let errorMessage = "We've encountered an unexpected error. Please try refreshing the page.";
      let isFirestoreError = false;
      
      try {
        if (this.state.error?.message) {
          const parsed = JSON.parse(this.state.error.message);
          if (parsed.error && parsed.operationType) {
            errorMessage = `Database Error: ${parsed.error}. Operation: ${parsed.operationType}`;
            isFirestoreError = true;
          }
        }
      } catch (e) {
        // Not a JSON error
      }

      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full text-center border border-red-100">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-black text-slate-900 mb-4">Something went wrong</h1>
            <p className="text-slate-500 font-medium mb-8">
              {errorMessage}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg"
            >
              Refresh Page
            </button>
            {process.env.NODE_ENV === 'development' && (
              <pre className="mt-8 p-4 bg-slate-100 rounded-xl text-left text-xs overflow-auto max-h-40 text-red-600 font-mono">
                {this.state.error?.message}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-black uppercase tracking-widest text-xs animate-pulse">Loading SolveWise AI...</p>
      </div>
    </div>
  );
}

function AppContent() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [lang, setLang] = useState<Language>("en");
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("tech");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  const navigate = useNavigate();

  const t = (key: string) => TRANSLATIONS[key]?.[lang] || key;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && firebaseUser.email?.toLowerCase().endsWith("@gmail.com")) {
        const email = firebaseUser.email || "";
        const userDocRef = doc(db, "users", firebaseUser.uid);
        
        try {
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const data = userDoc.data() as UserProfile;
            setUser({ uid: firebaseUser.uid, email: email, displayName: firebaseUser.displayName || data.displayName });
            setProfile(data);
          } else {
            // Create new profile
            const newProfile: UserProfile = {
              uid: firebaseUser.uid,
              email: email,
              displayName: firebaseUser.displayName || email.split("@")[0],
              role: email === "9211ravikumar2@gmail.com" ? "admin" : "free",
              createdAt: new Date().toISOString()
            };
            await setDoc(userDocRef, newProfile);
            setUser({ uid: firebaseUser.uid, email: email, displayName: newProfile.displayName });
            setProfile(newProfile);
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, "users/" + firebaseUser.uid);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Listen for profile changes
  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = onSnapshot(doc(db, "users", user.uid), (doc) => {
      if (doc.exists()) {
        setProfile(doc.data() as UserProfile);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "users/" + user.uid);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return <LoadingFallback />;
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
        handleLogin={() => setIsLoginModalOpen(true)} 
        handleLogout={handleLogout} 
        setView={setView}
        t={t}
      />

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLoginSuccess={handleLoginSuccess} 
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
          <Route path="/admin" element={user?.email === "9211ravikumar2@gmail.com" ? <AdminPanel lang={lang} t={t} /> : <div className="text-center py-20 font-black text-slate-300">UNAUTHORIZED</div>} />
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
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <AppContent />
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
