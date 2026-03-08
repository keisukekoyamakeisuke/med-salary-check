"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState<string | null>(null);
  const [done, setDone]         = useState(false);
  const [loading, setLoading]   = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    setDone(true);
  };

  if (done) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <span className="text-5xl mb-4 block">📧</span>
          <h2 className="text-xl font-bold text-slate-800 mb-2">確認メールを送信しました</h2>
          <p className="text-sm text-slate-500 mb-6">
            {email} に確認メールを送りました。メール内のリンクをクリックして登録を完了してください。
          </p>
          <Link href="/auth/login" className="text-blue-600 text-sm hover:underline">
            ログインページへ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-100 px-4 py-4">
        <div className="max-w-xl mx-auto flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">🩺</span>
            <span className="text-base font-bold text-slate-800">MedSalary Check</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-slate-800 mb-2 text-center">新規登録</h1>
          <p className="text-sm text-slate-500 text-center mb-8">
            無料で診断結果を保存・管理できます
          </p>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                メールアドレス
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-500"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                パスワード（8文字以上）
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-500"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? "登録中..." : "無料で登録する"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            すでにアカウントをお持ちの方は{" "}
            <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
              ログイン
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
