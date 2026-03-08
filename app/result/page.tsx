"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDiagnosisStore } from "@/store/diagnosis";
import { calcDiagnosisResult, formatSalary } from "@/lib/diagnosis-logic";
import { SalaryComparisonChart } from "@/components/result/SalaryComparisonChart";
import { ScoreBadge } from "@/components/result/ScoreBadge";
import { AdviceList } from "@/components/result/AdviceList";
import { PROFESSIONS } from "@/lib/types";
import type { DiagnosisResult } from "@/lib/types";

function getProfessionLabel(profession: string | null) {
  return PROFESSIONS.find((p) => p.value === profession)?.label ?? "";
}

function getExperienceLabel(exp: string | null) {
  const map: Record<string, string> = {
    lt1: "1年未満",
    "1to3": "1〜3年",
    "4to7": "4〜7年",
    "8to14": "8〜14年",
    gte15: "15年以上",
  };
  return exp ? map[exp] : "";
}

export default function ResultPage() {
  const router = useRouter();
  const { answers, reset } = useDiagnosisStore();
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const r = calcDiagnosisResult(answers);
    if (!r) {
      router.replace("/diagnosis");
      return;
    }
    setResult(r);
  }, [answers, router]);

  const handleRetry = () => {
    reset();
    router.push("/diagnosis");
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const twitterText = encodeURIComponent(
    `医療従事者向け年収診断「MedSalary Check」で年収診断してみました！ #MedSalaryCheck #看護師 #年収`
  );

  if (!result) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500 text-sm">診断結果を計算中...</p>
      </div>
    );
  }

  const { salaryData, evaluation, difference, advices } = result;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ヘッダー */}
      <header className="bg-white border-b border-slate-100 px-4 py-4">
        <div className="max-w-xl mx-auto flex items-center gap-2">
          <span className="text-xl">🩺</span>
          <span className="text-base font-bold text-slate-800">MedSalary Check</span>
        </div>
      </header>

      <main className="px-4 py-8 max-w-xl mx-auto space-y-6">
        {/* タイトル */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800">あなたの年収診断結果</h1>
          <p className="text-sm text-slate-500 mt-1">
            {getProfessionLabel(answers.profession)} ／ 経験{getExperienceLabel(answers.experience)} ／{" "}
            {answers.prefecture}
          </p>
        </div>

        {/* 年収比較カード */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
          {answers.currentSalary != null && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">現在の年収</span>
              <span className="text-xl font-bold text-slate-800">
                {formatSalary(answers.currentSalary)}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500">同条件の相場（中央値）</span>
            <span className="text-xl font-bold text-blue-700">
              {formatSalary(salaryData.medianSalary)}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs text-slate-400 border-t pt-3">
            <span>全国平均</span>
            <span>{formatSalary(salaryData.nationalAvg)}</span>
          </div>
        </div>

        {/* スコアバッジ */}
        {answers.currentSalary != null && (
          <ScoreBadge evaluation={evaluation} difference={difference} />
        )}

        {/* 相場幅 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <p className="text-xs font-semibold text-slate-500 mb-1">同条件の年収レンジ</p>
          <p className="text-sm text-slate-700">
            <span className="font-semibold">{formatSalary(salaryData.p25Salary)}</span>
            <span className="text-slate-400 mx-2">〜</span>
            <span className="font-semibold">{formatSalary(salaryData.p75Salary)}</span>
            <span className="text-slate-400 text-xs ml-2">（25〜75パーセンタイル）</span>
          </p>
        </div>

        {/* グラフ */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <p className="text-xs font-semibold text-slate-500 mb-4">年収比較グラフ</p>
          <SalaryComparisonChart
            currentSalary={answers.currentSalary}
            salaryData={salaryData}
          />
          <div className="flex gap-4 mt-3 flex-wrap">
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="w-3 h-3 rounded-sm bg-slate-400 inline-block" />全国平均
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="w-3 h-3 rounded-sm bg-blue-500 inline-block" />同条件中央値
            </span>
            {answers.currentSalary != null && (
              <span className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" />あなた
              </span>
            )}
          </div>
        </div>

        {/* アドバイス */}
        <div>
          <h2 className="text-base font-bold text-slate-800 mb-3">年収アップのためのアドバイス</h2>
          <AdviceList advices={advices} />
        </div>

        {/* シェア */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <p className="text-xs font-semibold text-slate-500 mb-3">結果をシェア</p>
          <div className="flex gap-2.5 flex-wrap">
            <a
              href={`https://twitter.com/intent/tweet?text=${twitterText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[120px] bg-black text-white text-xs font-bold py-3 rounded-xl text-center hover:bg-gray-800 transition-colors"
            >
              X でシェア
            </a>
            <a
              href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(
                typeof window !== "undefined" ? window.location.href : ""
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[120px] bg-[#06C755] text-white text-xs font-bold py-3 rounded-xl text-center hover:opacity-90 transition-opacity"
            >
              LINE でシェア
            </a>
            <button
              onClick={handleCopy}
              className="flex-1 min-w-[120px] bg-slate-100 text-slate-700 text-xs font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors"
            >
              {copied ? "コピー完了！" : "URLをコピー"}
            </button>
          </div>
        </div>

        {/* 再診断 */}
        <div className="text-center pb-6">
          <button
            onClick={handleRetry}
            className="text-sm text-blue-600 hover:underline"
          >
            ← 最初からやり直す
          </button>
        </div>
      </main>
    </div>
  );
}
