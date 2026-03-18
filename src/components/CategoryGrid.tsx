import { CATEGORIES } from "../constants";
import * as Icons from "lucide-react";

interface CategoryGridProps {
  t: (key: string) => string;
  setView: (view: any) => void;
  setSelectedCategory: (cat: string) => void;
}

export function CategoryGrid({ t, setView, setSelectedCategory }: CategoryGridProps) {
  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-8 px-2">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">{t("categories")}</h2>
        <div className="h-1 w-12 bg-blue-600 rounded-full"></div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {CATEGORIES.map((cat) => {
          const IconComponent = (Icons as any)[cat.icon];
          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setView("solver");
              }}
              className={`relative overflow-hidden bg-gradient-to-br ${cat.color} p-6 rounded-[2rem] shadow-lg hover:shadow-xl transition-all text-left group aspect-square flex flex-col justify-between`}
            >
              {/* Decorative Circle */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-500" />
              
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white shadow-inner">
                {IconComponent && <IconComponent className="w-6 h-6" />}
              </div>
              
              <div>
                <span className="font-black text-white text-lg block leading-tight">
                  {(cat.label as any)[t("appName") === "SolveWise AI" ? "en" : "hi"]}
                </span>
                <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest mt-1">
                  Explore Solutions
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <button 
          onClick={() => setView("community")}
          className="glass p-8 rounded-[2.5rem] flex items-center justify-between group hover:border-emerald-200 transition-all shadow-xl"
        >
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-3xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-inner">
              <Icons.Users className="w-8 h-8" />
            </div>
            <div className="text-left">
              <h3 className="font-black text-xl text-slate-900">{t("community")}</h3>
              <p className="text-sm font-medium text-slate-500">See what others are solving</p>
            </div>
          </div>
          <Icons.ArrowRight className="w-6 h-6 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-2 transition-all" />
        </button>

        <button 
          onClick={() => setView("donation")}
          className="glass p-8 rounded-[2.5rem] flex items-center justify-between group hover:border-pink-200 transition-all shadow-xl"
        >
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-pink-100 rounded-3xl flex items-center justify-center text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-all shadow-inner">
              <Icons.Heart className="w-8 h-8" />
            </div>
            <div className="text-left">
              <h3 className="font-black text-xl text-slate-900">{t("donation")}</h3>
              <p className="text-sm font-medium text-slate-500">Support our mission</p>
            </div>
          </div>
          <Icons.ArrowRight className="w-6 h-6 text-slate-300 group-hover:text-pink-600 group-hover:translate-x-2 transition-all" />
        </button>
      </div>
    </div>
  );
}
