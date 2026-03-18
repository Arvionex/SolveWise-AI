import { UserProfile, Language } from "../types";
import { Globe, LogIn, LogOut, Menu, X, Shield } from "lucide-react";
import { useState } from "react";

interface NavbarProps {
  user: any;
  profile: UserProfile | null;
  lang: Language;
  setLang: (lang: Language) => void;
  handleLogin: () => void;
  handleLogout: () => void;
  setView: (view: any) => void;
  t: (key: string) => string;
}

export function Navbar({ user, profile, lang, setLang, handleLogin, handleLogout, setView, t }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button onClick={() => setView("home")} className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                <Shield className="w-6 h-6" />
              </div>
              <span className="text-xl font-black text-slate-900 tracking-tight">{t("appName")}</span>
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => setView("community")} className="text-slate-600 hover:text-blue-600 font-bold transition-colors">{t("community")}</button>
            <button onClick={() => setView("history")} className="text-slate-600 hover:text-blue-600 font-bold transition-colors">{t("history")}</button>
            <button onClick={() => setView("premium")} className="text-slate-600 hover:text-blue-600 font-bold transition-colors">{t("premium")}</button>
            <button onClick={() => setView("donation")} className="text-slate-600 hover:text-blue-600 font-bold transition-colors">{t("donation")}</button>
            
            <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
              <button 
                onClick={() => setLang(lang === "en" ? "hi" : "en")}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-200 transition-all"
              >
                <Globe className="w-4 h-4" />
                {lang === "en" ? "Hindi" : "English"}
              </button>

              {user ? (
                <div className="flex items-center gap-4">
                  {user.email === "9211ravikumar2@gmail.com" && (
                    <button 
                      onClick={() => setView("admin")} 
                      className="flex items-center gap-2 bg-amber-100 text-amber-600 px-4 py-2 rounded-xl font-black text-xs tracking-widest hover:bg-amber-200 transition-all shadow-sm"
                    >
                      <Shield className="w-4 h-4" />
                      ADMIN
                    </button>
                  )}
                  <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 font-bold hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button onClick={handleLogin} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md">
                  <LogIn className="w-5 h-5" />
                  {t("login")}
                </button>
              )}
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 p-4 space-y-4 shadow-xl">
          <button onClick={() => { setView("community"); setIsOpen(false); }} className="block w-full text-left py-2 font-bold text-slate-700">{t("community")}</button>
          <button onClick={() => { setView("history"); setIsOpen(false); }} className="block w-full text-left py-2 font-bold text-slate-700">{t("history")}</button>
          <button onClick={() => { setView("premium"); setIsOpen(false); }} className="block w-full text-left py-2 font-bold text-slate-700">{t("premium")}</button>
          <button onClick={() => { setView("donation"); setIsOpen(false); }} className="block w-full text-left py-2 font-bold text-slate-700">{t("donation")}</button>
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-4">
            <button onClick={() => setLang(lang === "en" ? "hi" : "en")} className="flex items-center gap-2 font-bold text-slate-700">
              <Globe className="w-5 h-5" /> {lang === "en" ? "Hindi" : "English"}
            </button>
            {user ? (
              <div className="flex flex-col gap-4">
                {user.email === "9211ravikumar2@gmail.com" && (
                  <button 
                    onClick={() => { setView("admin"); setIsOpen(false); }} 
                    className="flex items-center gap-2 bg-amber-100 text-amber-600 px-4 py-3 rounded-xl font-black text-sm tracking-widest"
                  >
                    <Shield className="w-5 h-5" />
                    ADMIN PANEL
                  </button>
                )}
                <button onClick={handleLogout} className="text-red-500 font-bold text-left px-4 py-2">{t("logout")}</button>
              </div>
            ) : (
              <button onClick={() => { handleLogin(); setIsOpen(false); }} className="bg-blue-600 text-white py-3 rounded-xl font-bold w-full">{t("login")}</button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
