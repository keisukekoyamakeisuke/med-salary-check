"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PROFESSIONS, EXPERIENCE_RANGES } from "@/lib/types";

interface SavedResult {
  id: string;
  profession: string;
  prefecture: string;
  experience: string;
  current_salary: number | null;
  median_salary: number;
  evaluation: "above" | "average" | "below";
  difference: number;
  created_at: string;
}

const EVAL_CONFIG = {
  above:   { label: "相場より高い", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  average: { label: "相場と同水準", color: "text-blue-700 bg-blue-50 border-blue-200" },
  below:   { label: "相場より低い", color: "text-amber-700 bg-amber-50 border-amber-200" },
};

function fmt(v: number) { return `${Math.round(v / 10000)}万円`; }
function profLabel(v: string) { return PROFESSIONS.find((p) => p.value === v)?.label ?? v; }
function expLabel(v: string)  { return EXPERIENCE_RANGES.find((e) => e.value === v)?.label ?? v; }
function fmtDate(s: string)   { return new Date(s).toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" }); }

export default function MyPage() {
  const router = useRouter();
  const [email, setEmail]       = useState<string | null>(null);
  const [results, setResults]   = useState<SavedResult[]>([]);
  const [loading, setLoading]   = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.replace("/auth/login"); return; }
      setEmail(user.email ?? null);
    });

    fetch("/api/results")
      .then((r) => r.ok ? r.json() : [])
      .then((data) => { setResults(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [router]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("この診断結果を削除しますか？")) return;
    setDeleting(id);
    const supabase = createClient();
    await supabase.from("diagnosis_results").delete().eq("id", id);
    setResults((prev) => prev.filter((r) => r.id !== id));
    setDeleting(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-100 px-4 py-4">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">🩺</span>
            <span className="text-base font-bold text-slate-800">MedSalary Check</span>
          </Link>
          <button onClick={handleLogout} className="text-xs text-slate-500 hover:text-slate-700 border border-slate-200 rounded-lg px-3 py-1.5">
            ログアウト
          </button>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">マイページ</h1>
          {email && <p className="text-sm text-slate-500 mt-1">{email}</p>}
        </div>

        <div className="flex justify-between items-center">
          <h2 className="text-base font-bold text-slate-800">保存した診断結果</h2>
          <Link
            href="/diagnosis"
            className="text-xs bg-blue-600 text-white font-bold px-4 py-2 rounded-full hover:bg-blue-700 transition-colors"
          >
            新しく診断する
          </Link>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        )}

        {!loading && results.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-500 text-sm mb-4">まだ診断結果が保存されていません</p>
            <Link href="/diagnosis" className="text-blue-600 text-sm hover:underline">
              診断を始める →
            </Link>
          </div>
        )}

        <ul className="space-y-3">
          {results.map((r) => {
            const ec = EVAL_CONFIG[r.evaluation];
            const diff = Math.abs(r.difference);
            return (
              <li key={r.id} className="bg-white rounded-2xl border border-slate-200 p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="font-bold text-slate-800 text-sm">{profLabel(r.profession)}</span>
                      <span className="text-xs text-slate-500">{expLabel(r.experience)} / {r.prefecture}</span>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      {r.current_salary != null && (
                        <span className="text-xs text-slate-500">
                          現在: <strong className="text-slate-800">{fmt(r.current_salary)}</strong>
                        </span>
                      )}
                      <span className="text-xs text-slate-500">
                        相場: <strong className="text-blue-700">{fmt(r.median_salary)}</strong>
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${ec.color}`}>
                        {ec.label}
                        {diff > 0 && ` ${r.difference > 0 ? "+" : "▼"}${Math.round(diff / 10000)}万`}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(r.id)}
                    disabled={deleting === r.id}
                    className="ml-2 text-slate-300 hover:text-red-400 text-xs"
                    aria-label="削除"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-2">{fmtDate(r.created_at)}</p>
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}
