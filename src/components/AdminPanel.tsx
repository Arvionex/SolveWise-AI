import { useState, useEffect } from "react";
import { Problem, UserProfile, Donation } from "../types";
import { Shield, Users, MessageSquare, TrendingUp, Check, X, Download, Heart } from "lucide-react";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from "firebase/firestore";

interface AdminPanelProps {
  lang: string;
  t: (key: string) => string;
}

export function AdminPanel({ lang, t }: AdminPanelProps) {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubProblems = onSnapshot(query(collection(db, "problems"), orderBy("timestamp", "desc")), (snapshot) => {
      setProblems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Problem)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, "problems"));

    const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ ...doc.data() } as UserProfile)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, "users"));

    const unsubDonations = onSnapshot(query(collection(db, "donations"), orderBy("timestamp", "desc")), (snapshot) => {
      setDonations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Donation)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, "donations"));

    setLoading(false);

    return () => {
      unsubProblems();
      unsubUsers();
      unsubDonations();
    };
  }, []);

  const togglePublic = async (id: string, current: boolean) => {
    try {
      await updateDoc(doc(db, "problems", id), { is_public: !current });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, "problems/" + id);
    }
  };

  const exportDonors = () => {
    const headers = ["Name", "Amount", "Message", "Date"];
    const rows = donations.map(d => [
      d.displayName || "Anonymous",
      d.amount,
      d.message || "",
      new Date(d.timestamp).toLocaleDateString()
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "donors_list.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="w-8 h-8 text-blue-600" />
        <h2 className="text-3xl font-extrabold text-slate-900">Admin Dashboard</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-6 h-6 text-blue-600" />
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-slate-500 text-sm font-medium">Total Users</p>
          <p className="text-2xl font-bold">{users.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <MessageSquare className="w-6 h-6 text-emerald-600" />
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-slate-500 text-sm font-medium">Problems Solved</p>
          <p className="text-2xl font-bold">{problems.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <Shield className="w-6 h-6 text-amber-600" />
          </div>
          <p className="text-slate-500 text-sm font-medium">Premium Users</p>
          <p className="text-2xl font-bold">{users.filter(u => u.role === "premium").length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <Heart className="w-6 h-6 text-pink-600" />
          </div>
          <p className="text-slate-500 text-sm font-medium">Total Donations</p>
          <p className="text-2xl font-bold">₹{donations.reduce((acc, d) => acc + d.amount, 0)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-lg">Recent Problems</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Problem</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Public</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {problems.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-900 line-clamp-1">{p.problem_text}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {p.is_public ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <X className="w-4 h-4 text-slate-300" />
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => togglePublic(p.id!, p.is_public)}
                        className="text-xs font-bold text-blue-600 hover:underline"
                      >
                        Toggle Public
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-lg">Donations</h3>
            <button 
              onClick={exportDonors}
              className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-all"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Donor</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {donations.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-900">{d.displayName || "Anonymous"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-black text-emerald-600">₹{d.amount}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-slate-500">{new Date(d.timestamp).toLocaleDateString()}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
