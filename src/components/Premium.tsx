import { useState } from "react";
import { User } from "firebase/auth";
import { UserProfile, Language } from "../types";
import { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { Check, Zap, Shield, Crown, Loader2 } from "lucide-react";

interface PremiumProps {
  user: User | null;
  profile: UserProfile | null;
  lang: Language;
  t: (key: string) => string;
}

declare const Razorpay: any;

export function Premium({ user, profile, lang, t }: PremiumProps) {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 99 }),
      });
      const order = await response.json();

      const options = {
        key: "YOUR_RAZORPAY_KEY_ID", // This should be in env
        amount: order.amount,
        currency: order.currency,
        name: "SolveWise AI",
        description: "Premium Subscription",
        order_id: order.id,
        handler: async (response: any) => {
          // Update user role in Firestore
          await updateDoc(doc(db, "users", user.uid), {
            role: "premium"
          });
          window.location.reload();
        },
        prefill: {
          email: user.email,
          name: user.displayName,
        },
        theme: { color: "#2563EB" },
      };

      const rzp = new Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-600 px-4 py-2 rounded-full text-sm font-black uppercase tracking-widest mb-6">
          <Crown className="w-4 h-4" />
          Premium Access
        </div>
        <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-6 tracking-tight">{t("premium")}</h2>
        <p className="text-xl text-slate-500 font-medium max-w-xl mx-auto">Unlock the full power of SolveWise AI and get unlimited expert solutions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Free Plan */}
        <div className="glass p-10 rounded-[3rem] border-white/40 shadow-xl flex flex-col hover:shadow-2xl transition-all">
          <h3 className="text-2xl font-black mb-2 text-slate-900 tracking-tight">Basic</h3>
          <div className="flex items-baseline gap-1 mb-8">
            <span className="text-5xl font-black text-slate-900 tracking-tighter">₹0</span>
            <span className="text-slate-400 font-bold">/month</span>
          </div>
          <ul className="space-y-5 mb-10 flex-grow">
            <li className="flex items-center gap-4 text-slate-600 font-bold">
              <div className="p-1 bg-emerald-100 rounded-full"><Check className="w-4 h-4 text-emerald-600" /></div> 5 AI solutions per day
            </li>
            <li className="flex items-center gap-4 text-slate-600 font-bold">
              <div className="p-1 bg-emerald-100 rounded-full"><Check className="w-4 h-4 text-emerald-600" /></div> Standard AI responses
            </li>
            <li className="flex items-center gap-4 text-slate-600 font-bold">
              <div className="p-1 bg-emerald-100 rounded-full"><Check className="w-4 h-4 text-emerald-600" /></div> Community access
            </li>
          </ul>
          <button disabled className="w-full py-4 rounded-2xl font-black bg-slate-100 text-slate-400 tracking-widest uppercase text-xs">
            Current Plan
          </button>
        </div>

        {/* Premium Plan */}
        <div className="gradient-bg p-10 rounded-[3rem] shadow-2xl flex flex-col text-white relative overflow-hidden hover:scale-[1.02] transition-all">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          
          <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/30">
            Most Popular
          </div>
          
          <h3 className="text-2xl font-black mb-2 tracking-tight">Premium</h3>
          <div className="flex items-baseline gap-1 mb-8">
            <span className="text-5xl font-black tracking-tighter">₹99</span>
            <span className="text-blue-100 font-bold">/month</span>
          </div>
          <ul className="space-y-5 mb-10 flex-grow">
            <li className="flex items-center gap-4 text-blue-50 font-bold">
              <div className="p-1 bg-white/20 rounded-full"><Zap className="w-4 h-4 text-amber-300 fill-amber-300" /></div> Unlimited AI solutions
            </li>
            <li className="flex items-center gap-4 text-blue-50 font-bold">
              <div className="p-1 bg-white/20 rounded-full"><Crown className="w-4 h-4 text-amber-300" /></div> Expert-level suggestions
            </li>
            <li className="flex items-center gap-4 text-blue-50 font-bold">
              <div className="p-1 bg-white/20 rounded-full"><Shield className="w-4 h-4 text-blue-200" /></div> Priority AI responses
            </li>
            <li className="flex items-center gap-4 text-blue-50 font-bold">
              <div className="p-1 bg-white/20 rounded-full"><Check className="w-4 h-4 text-blue-200" /></div> Ad-free experience
            </li>
          </ul>
          <button 
            onClick={handleUpgrade}
            disabled={loading || profile?.role === "premium"}
            className="w-full py-4 rounded-2xl font-black bg-white text-blue-600 hover:shadow-xl hover:bg-blue-50 transition-all flex items-center justify-center gap-2 tracking-widest uppercase text-xs"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : profile?.role === "premium" ? "Active" : "Upgrade Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
