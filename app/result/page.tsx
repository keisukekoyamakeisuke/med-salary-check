"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDiagnosisStore } from "@/store/diagnosis";
import { calcDiagnosisResult, formatSalary } from "@/lib/diagnosis-logic";
import { getSalaryProgressionData } from "@/lib/salary-data";
import { SalaryComparisonChart } from "@/components/result/SalaryComparisonChart";
import { SalaryProgressionChart } from "@/components/result/SalaryProgressionChart";
import { ScoreBadge } from "@/components/result/ScoreBadge";
import { AdviceList } from "@/components/result/AdviceList";
import { AgentCta } from "@/components/result/AgentCta";
import { AiAdvice } from "@/components/result/AiAdvice";
import { PROFESSIONS, EXPERIENCE_RANGES } from "@/lib/types";
import type { DiagnosisResult } from "@/lib/types";
import type { ProgressionPoint } from "@/lib/salary-data";

function getProfessionLabel(v: string | null) {
  return PROFESSIONS.find((p) => p.value === v)?.label ?? "";
}
function getExperienceLabel(v: string | null) {
  return EXPERIENCE_RANGES.find((e) => e.value === v)?.label ?? "";
}

export default function ResultPage() {
  const router = useRouter();
  const { answers, reset }            = useDiagnosisStore();
  const [result, setResult]           = useState<DiagnosisResult | null>(null);
  const [progression, setProgression] = useState<ProgressionPoint[]>([]);
  const [copied, setCopied]           = useState(false);
  const [saveState, setSaveState]     = useState<"idle" | "saving" | "saved" | "noauth" | "error">("idle");
  const anonSent                      = useRef(false);

  useEffect(() => {
    const r = calcDiagnosisResult(answers);
    if (!r) { router.replace("/diagnosis"); return; }
    setResult(r);

    if (answers.profession && answers.region && answers.facilityType && answers.employmentType && answers.position) {
      setProgression(getSalaryProgressionData(
        answers.profession, answers.region, answers.facilityType, answers.employmentType, answers.position
      ));
    }

    // 匿名データ送信（1回のみ）
    if (!anonSent.current && answers.currentSalary && answers.profession && answers.region) {
      anonSent.current = true;
      fetch("/api/anonymous-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profession:      answers.profession,
          facilityType:    answers.facilityType,
          region:          answers.region,
          experience:      answers.experience,
          employmentType:  answers.employmentType,
          position:        answers.position,
          salary:          answers.currentSalary,
        }),
      }).catch(() => {});
    }
  }, [answers, router]);

  const handleSave = async () => {
    if (!result) return;
    setSaveState("saving");
    const res = await fetch("/api/results", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profession:      answers.profession,
        facilityType:    answers.facilityType,
        prefecture:      answers.prefecture,
        experience:      answers.experience,
        employmentType:  answers.employmentType,
        position:        answers.position,
        qualifications:  answers.qualifications,
        currentSalary:   answers.currentSalary,
        medianSalary:    result.salaryData.medianSalary,
        nationalAvg:     result.salaryData.nationalAvg,
        evaluation:      result.evaluation,
        difference:      result.difference,
      }),
    });

    if (res.status === 401)      { setSaveState("noauth"); return; }
    if (res.status === 503)      { setSaveState("noauth"); return; }
    if (!res.ok)                 { setSaveState("error");  return; }
    setSaveState("saved");
  };

  const handleRetry = () => { reset(); router.push("/diagnosis"); };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const professionLabel = getProfessionLabel(answers.profession);
  const experienceLabel = getExperienceLabel(answers.experience);

  const twitterText = encodeURIComponent(
    `医療従事者向け年収診断「MedSalary Check」で${professionLabel}の年収診断してみました！ #MedSalaryCheck #年収診断`
  );

  if (!result) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500 text-sm">診断結果を計算中...</p>
      </div>
    );
  }

  const { salaryData, evaluation, difference, advices } = result;
  const isBelow = evaluation === "below";

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-100 px-4 py-4">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🩺</span>
            <span className="text-base font-bold text-slate-800">MedSalary Check</span>
          </div>
          <a href="/auth/login" className="text-xs text-blue-600 hover:underline border border-blue-200 rounded-lg px-3 py-1.5">
            ログイン / 登録
          </a>
        </div>
      </header>

      <main className="px-4 py-8 max-w-xl mx-auto space-y-6">
        {/* タイトル + 保存ボタン */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">あなたの年収診断結果</h1>
            <p className="text-sm text-slate-500 mt-1">
              {professionLabel} ／ 経験{experienceLabel} ／ {answers.prefecture}
            </p>
          </div>
          <div className="flex-shrink-0">
            {saveState === "idle" && (
              <button
                onClick={handleSave}
                className="text-xs bg-white border border-slate-200 text-slate-600 font-medium px-3 py-2 rounded-xl hover:border-blue-300 hover:text-blue-600 transition-colors"
              >
                💾 保存
              </button>
            )}
            {saveState === "saving" && (
              <span className="text-xs text-slate-400">保存中...</span>
            )}
            {saveState === "saved" && (
              <a href="/mypage" className="text-xs text-emerald-600 font-medium">✓ 保存済み →</a>
            )}
            {saveState === "noauth" && (
              <a href="/auth/login" className="text-xs text-blue-600 hover:underline">
                ログインして保存
              </a>
            )}
            {saveState === "error" && (
              <span className="text-xs text-red-500">保存失敗</span>
            )}
          </div>
        </div>

        {/* 相場より低い場合：緊急CTA */}
        {isBelow && <AgentCta urgent professionLabel={professionLabel} />}

        {/* 年収比較カード */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
          {answers.currentSalary != null && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">現在の年収</span>
              <span className="text-xl font-bold text-slate-800">{formatSalary(answers.currentSalary)}</span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500">同条件の相場（中央値）</span>
            <span className="text-xl font-bold text-blue-700">{formatSalary(salaryData.medianSalary)}</span>
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

        {/* 年収比較グラフ */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <p className="text-xs font-semibold text-slate-500 mb-4">年収比較グラフ</p>
          <SalaryComparisonChart currentSalary={answers.currentSalary} salaryData={salaryData} />
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

        {/* 年収推移グラフ */}
        {progression.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <p className="text-xs font-semibold text-slate-500 mb-1">
              {professionLabel}の年収推移（経験年数別）
            </p>
            <p className="text-xs text-slate-400 mb-4">同条件のままキャリアを積むと？</p>
            <SalaryProgressionChart data={progression} currentExperienceLabel={experienceLabel} />
          </div>
        )}

        {/* Claude AI 個別アドバイス（NEW: v2.0） */}
        <AiAdvice
          answers={answers}
          medianSalary={salaryData.medianSalary}
          evaluation={evaluation}
          difference={difference}
        />

        {/* 静的アドバイス */}
        <div>
          <h2 className="text-base font-bold text-slate-800 mb-3">年収アップのためのアドバイス</h2>
          <AdviceList advices={advices} />
        </div>

        {/* 転職エージェントCTA（相場以上の場合） */}
        {!isBelow && <AgentCta professionLabel={professionLabel} />}

        {/* 匿名データ活用のご案内 */}
        {answers.currentSalary != null && (
          <p className="text-[10px] text-slate-400 text-center px-2">
            ※ あなたの年収データは個人を特定できない形で匿名集計され、相場データの精度向上に活用されます
          </p>
        )}

        {/* シェア */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <p className="text-xs font-semibold text-slate-500 mb-3">結果をシェア</p>
          <div className="flex gap-2.5 flex-wrap">
            <a
              href={`https://twitter.com/intent/tweet?text=${twitterText}`}
              target="_blank" rel="noopener noreferrer"
              className="flex-1 min-w-[120px] bg-black text-white text-xs font-bold py-3 rounded-xl text-center hover:bg-gray-800 transition-colors"
            >
              X でシェア
            </a>
            <a
              href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(
                typeof window !== "undefined" ? window.location.href : ""
              )}`}
              target="_blank" rel="noopener noreferrer"
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
          <button onClick={handleRetry} className="text-sm text-blue-600 hover:underline">
            ← 最初からやり直す
          </button>
        </div>
      </main>
    </div>
  );
}
