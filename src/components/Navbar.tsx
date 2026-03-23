import { UserProfile, Language } from "../types";
import { Globe, Menu, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "./Logo";

interface NavbarProps {
  lang: Language;
  setLang: (lang: Language) => void;
  setView: (view: any) => void;
  t: (key: string) => string;
}

export function Navbar({ lang, setLang, setView, t }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button onClick={() => setView("home")} className="flex items-center">
              <Logo />
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
          </div>
        </div>
      )}
    </nav>
  );
}
