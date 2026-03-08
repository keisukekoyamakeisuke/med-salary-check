"use client";

import { useRouter } from "next/navigation";
import { useDiagnosisStore } from "@/store/diagnosis";
import { ProgressBar } from "@/components/diagnosis/ProgressBar";
import { OptionButton } from "@/components/diagnosis/OptionButton";
import { SalarySlider } from "@/components/diagnosis/SalarySlider";
import {
  PROFESSIONS,
  FACILITY_TYPES,
  EXPERIENCE_RANGES,
  EMPLOYMENT_TYPES,
  POSITIONS,
  QUALIFICATIONS_BY_PROFESSION,
  PREFECTURES,
} from "@/lib/types";

const TOTAL_STEPS = 8;

const STEP_TITLES = [
  "職種を選んでください",
  "勤務先のタイプを選んでください",
  "勤務地の都道府県を選んでください",
  "現在の職種での経験年数は？",
  "雇用形態を選んでください",
  "現在の役職・ポジションは？",
  "保有している資格を選んでください（任意）",
  "現在の年収を入力してください",
];

export default function DiagnosisPage() {
  const router = useRouter();
  const {
    currentStep,
    answers,
    nextStep,
    prevStep,
    setProfession,
    setFacilityType,
    setPrefecture,
    setExperience,
    setEmploymentType,
    setPosition,
    toggleQualification,
    setCurrentSalary,
    setSalaryUnknown,
  } = useDiagnosisStore();

  const canNext = (() => {
    if (currentStep === 1) return answers.profession !== null;
    if (currentStep === 2) return answers.facilityType !== null;
    if (currentStep === 3) return answers.prefecture !== null;
    if (currentStep === 4) return answers.experience !== null;
    if (currentStep === 5) return answers.employmentType !== null;
    if (currentStep === 6) return answers.position !== null;
    if (currentStep === 7) return true; // 任意
    if (currentStep === 8) return answers.currentSalary !== null || answers.salaryUnknown;
    return false;
  })();

  const handleNext = () => {
    if (currentStep === TOTAL_STEPS) {
      router.push("/result");
    } else {
      nextStep();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* ヘッダー */}
      <header className="bg-white border-b border-slate-100 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-slate-800">🩺 年収診断</span>
          </div>
          <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
        </div>
      </header>

      {/* 質問カード */}
      <main className="flex-1 px-4 py-8">
        <div className="max-w-xl mx-auto">
          <h2 className="text-lg font-bold text-slate-800 mb-6">
            {STEP_TITLES[currentStep - 1]}
          </h2>

          {/* Step 1: 職種 */}
          {currentStep === 1 && (
            <div className="space-y-2.5">
              {PROFESSIONS.map((p) => (
                <OptionButton
                  key={p.value}
                  label={p.label}
                  selected={answers.profession === p.value}
                  onClick={() => setProfession(p.value)}
                />
              ))}
            </div>
          )}

          {/* Step 2: 施設タイプ */}
          {currentStep === 2 && (
            <div className="space-y-2.5">
              {FACILITY_TYPES.map((f) => (
                <OptionButton
                  key={f.value}
                  label={f.label}
                  selected={answers.facilityType === f.value}
                  onClick={() => setFacilityType(f.value)}
                />
              ))}
            </div>
          )}

          {/* Step 3: 都道府県 */}
          {currentStep === 3 && (
            <div>
              <select
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-700 bg-white focus:outline-none focus:border-blue-500"
                value={answers.prefecture ?? ""}
                onChange={(e) => e.target.value && setPrefecture(e.target.value)}
              >
                <option value="">都道府県を選択</option>
                {PREFECTURES.map((pref) => (
                  <option key={pref} value={pref}>
                    {pref}
                  </option>
                ))}
              </select>
              {answers.prefecture && (
                <p className="text-xs text-slate-500 mt-2 px-1">
                  地域区分:{" "}
                  {answers.region === "urban"
                    ? "都市部"
                    : answers.region === "suburban"
                    ? "地方都市"
                    : "地方"}
                </p>
              )}
            </div>
          )}

          {/* Step 4: 経験年数 */}
          {currentStep === 4 && (
            <div className="space-y-2.5">
              {EXPERIENCE_RANGES.map((e) => (
                <OptionButton
                  key={e.value}
                  label={e.label}
                  selected={answers.experience === e.value}
                  onClick={() => setExperience(e.value)}
                />
              ))}
            </div>
          )}

          {/* Step 5: 雇用形態 */}
          {currentStep === 5 && (
            <div className="space-y-2.5">
              {EMPLOYMENT_TYPES.map((e) => (
                <OptionButton
                  key={e.value}
                  label={e.label}
                  selected={answers.employmentType === e.value}
                  onClick={() => setEmploymentType(e.value)}
                />
              ))}
            </div>
          )}

          {/* Step 6: 役職 */}
          {currentStep === 6 && (
            <div className="space-y-2.5">
              {POSITIONS.map((p) => (
                <OptionButton
                  key={p.value}
                  label={p.label}
                  selected={answers.position === p.value}
                  onClick={() => setPosition(p.value)}
                />
              ))}
            </div>
          )}

          {/* Step 7: 資格（複数選択） */}
          {currentStep === 7 && answers.profession && (
            <div className="space-y-2.5">
              <p className="text-xs text-slate-500 -mt-2 mb-1">複数選択可・スキップしてもOK</p>
              {QUALIFICATIONS_BY_PROFESSION[answers.profession].map((q) => (
                <OptionButton
                  key={q.value}
                  label={q.label}
                  selected={answers.qualifications.includes(q.value)}
                  onClick={() => toggleQualification(q.value)}
                  multi
                />
              ))}
            </div>
          )}

          {/* Step 8: 年収入力 */}
          {currentStep === 8 && (
            <SalarySlider
              value={answers.currentSalary}
              unknown={answers.salaryUnknown}
              onChange={setCurrentSalary}
              onUnknown={setSalaryUnknown}
            />
          )}
        </div>
      </main>

      {/* ナビゲーション */}
      <div className="sticky bottom-0 bg-white border-t border-slate-100 px-4 py-4">
        <div className="max-w-xl mx-auto flex gap-3">
          {currentStep > 1 && (
            <button
              onClick={prevStep}
              className="flex-1 py-3.5 rounded-xl border-2 border-slate-200 text-slate-600 font-medium text-sm hover:bg-slate-50 transition-colors"
            >
              ← 戻る
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!canNext}
            className={`
              flex-[2] py-3.5 rounded-xl font-bold text-sm transition-all
              ${
                canNext
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }
            `}
          >
            {currentStep === TOTAL_STEPS ? "診断結果を見る →" : "次へ →"}
          </button>
        </div>
      </div>
    </div>
  );
}
