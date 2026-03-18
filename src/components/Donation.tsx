import { useState, useEffect } from "react";
import { UserProfile, Language, Donation as DonationType } from "../types";
import { Heart, Trophy, Loader2, CheckCircle2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getMockDonations, addMockDonation } from "../mockData";

interface DonationProps {
  user: any;
  profile: UserProfile | null;
  lang: Language;
  t: (key: string) => string;
}

const GOAL = 50000;

export function Donation({ user, profile, lang, t }: DonationProps) {
  const [amount, setAmount] = useState<number | string>(100);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [donations, setDonations] = useState<DonationType[]>([]);
  const [totalRaised, setTotalRaised] = useState(0);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const d = await getMockDonations();
      setDonations(d.sort((a, b) => b.amount - a.amount).slice(0, 10));
      setTotalRaised(d.reduce((acc, curr) => acc + curr.amount, 0));
    };
    fetchData();
  }, []);

  const handleRazorpayPayment = async (finalAmount: number) => {
    const options = {
      key: "rzp_test_YOUR_KEY_HERE", // User should replace this
      amount: finalAmount * 100,
      currency: "INR",
      name: "SolveWise AI",
      description: "Community Support Donation",
      image: "https://picsum.photos/seed/solvewise/200/200",
      handler: async function (response: any) {
        try {
          await addMockDonation({
            user_id: user?.uid || "anonymous",
            displayName: profile?.displayName || "Anonymous Donor",
            amount: finalAmount,
            message,
            timestamp: new Date().toISOString(),
          });
          setSuccess(true);
          setMessage("");
          setAmount(100);
          setTimeout(() => setSuccess(false), 5000);
        } catch (error) {
          console.error("Failed to save donation", error);
        }
      },
      prefill: {
        name: profile?.displayName || "",
        email: user?.email || "",
      },
      theme: {
        color: "#2563eb",
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  const handleDonate = async () => {
    const finalAmount = Number(amount);
    if (isNaN(finalAmount) || finalAmount <= 0) return;

    setLoading(true);
    try {
      await handleRazorpayPayment(finalAmount);
    } catch (error) {
      console.error("Donation failed", error);
    } finally {
      setLoading(false);
    }
  };

  const progress = Math.min((totalRaised / GOAL) * 100, 100);

  return (
    <div className="max-w-4xl mx-auto py-12">
      <AnimatePresence>
        {success && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <div className="bg-white p-10 rounded-[3rem] shadow-2xl text-center max-w-md border-4 border-emerald-100">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-4">Thank You!</h3>
              <p className="text-slate-500 font-bold mb-8">
                Your support for <span className="text-blue-600">SolveWise AI</span> means the world to us. You're now on our leaderboard!
              </p>
              <button 
                onClick={() => setSuccess(false)}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black hover:bg-slate-800 transition-all"
              >
                Awesome
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center text-pink-600 shadow-inner">
              <Heart className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t("donation")}</h2>
          </div>

          <div className="mb-10">
            <div className="flex justify-between items-end mb-3">
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Community Goal</p>
                <p className="text-2xl font-black text-slate-900">₹{totalRaised.toLocaleString()} <span className="text-slate-300 text-lg">/ ₹{GOAL.toLocaleString()}</span></p>
              </div>
              <p className="text-blue-600 font-black">{Math.round(progress)}%</p>
            </div>
            <div className="h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full gradient-bg"
              />
            </div>
          </div>

          <div className="glass p-8 rounded-[2.5rem] shadow-2xl border-white/40 space-y-6">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Select Amount (₹)</label>
              <div className="grid grid-cols-4 gap-2">
                {[10, 50, 100, 500].map(amt => (
                  <button 
                    key={amt}
                    onClick={() => setAmount(amt)}
                    className={`py-4 rounded-xl font-black transition-all ${amount === amt ? 'bg-blue-600 text-white shadow-lg scale-105' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Custom Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400">₹</span>
                <input 
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full p-4 pl-10 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Message (Optional)</label>
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Leave a message..."
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-none font-medium"
              />
            </div>

            <button 
              onClick={handleDonate}
              disabled={loading || !amount || Number(amount) <= 0}
              className="w-full gradient-bg text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
              Support Now
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 shadow-inner">
              <Trophy className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Top Donors</h2>
          </div>

          <div className="glass rounded-[3rem] shadow-2xl border-white/40 overflow-hidden">
            <div className="divide-y divide-slate-100">
              {donations.length > 0 ? donations.map((d, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={d.id} 
                  className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${i === 0 ? 'bg-amber-100 text-amber-600' : i === 1 ? 'bg-slate-200 text-slate-600' : i === 2 ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-400'}`}>
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-black text-slate-900">{d.displayName}</p>
                      {d.message && <p className="text-xs text-slate-500 font-medium italic">"{d.message}"</p>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-emerald-600 tracking-tighter">₹{d.amount}</p>
                  </div>
                </motion.div>
              )) : (
                <div className="p-12 text-center text-slate-300 font-black uppercase tracking-widest">
                  No donors yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
