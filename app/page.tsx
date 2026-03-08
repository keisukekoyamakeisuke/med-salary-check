import Link from "next/link";

const PROFESSIONS = [
  { icon: "🩺", label: "医師" },
  { icon: "🦷", label: "歯科医師" },
  { icon: "💉", label: "看護師" },
  { icon: "🏥", label: "准看護師" },
  { icon: "💊", label: "薬剤師" },
  { icon: "🦴", label: "理学療法士" },
  { icon: "🖐️", label: "作業療法士" },
  { icon: "🗣️", label: "言語聴覚士" },
  { icon: "🔬", label: "放射線技師" },
  { icon: "🧪", label: "臨床検査技師" },
  { icon: "🥗", label: "管理栄養士" },
  { icon: "📋", label: "医療事務" },
];

const STEPS = [
  { num: "1", title: "職種・勤務情報を入力", desc: "8つの質問に選択式で回答（約3分）" },
  { num: "2", title: "AIが相場を算出", desc: "職種・地域・経験年数から市場相場を即時計算" },
  { num: "3", title: "結果＆アドバイスを確認", desc: "グラフで可視化、具体的な改善提案を表示" },
];

const FAQS = [
  {
    q: "個人情報は必要ですか？",
    a: "不要です。名前・メールアドレスなど個人を特定できる情報は一切収集しません。",
  },
  {
    q: "データの精度はどうですか？",
    a: "厚生労働省「賃金構造基本統計調査」をベースに、職種・施設タイプ・地域・経験年数などの条件で補正した推計値です。",
  },
  {
    q: "対象の職種はどれですか？",
    a: "医師・歯科医師・看護師・准看護師・薬剤師・理学療法士・作業療法士・言語聴覚士・放射線技師・臨床検査技師・管理栄養士・医療事務の12職種に対応しています。",
  },
  {
    q: "無料ですか？",
    a: "完全無料です。登録も不要でご利用いただけます。",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* ヘッダー */}
      <header className="border-b border-slate-100 px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-2">
          <span className="text-2xl">🩺</span>
          <span className="text-lg font-bold text-slate-800">MedSalary Check</span>
        </div>
      </header>

      {/* ヒーロー */}
      <section className="bg-gradient-to-b from-blue-600 to-blue-700 text-white px-4 py-16">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-blue-200 text-sm font-medium mb-3">医療従事者向け・無料</p>
          <h1 className="text-3xl font-bold leading-tight mb-4">
            あなたの年収、<br />市場相場と比べてみませんか？
          </h1>
          <p className="text-blue-100 text-sm leading-relaxed mb-8">
            看護師・薬剤師・理学療法士の年収を、職種・地域・経験年数で診断。
            転職・給与交渉の判断材料に。
          </p>
          <Link
            href="/diagnosis"
            className="inline-block bg-white text-blue-700 font-bold px-8 py-4 rounded-full text-base shadow-lg hover:shadow-xl transition-shadow"
          >
            無料で診断する →
          </Link>
          <p className="text-blue-200 text-xs mt-4">登録不要・約3分</p>
        </div>
      </section>

      {/* 職種バッジ */}
      <section className="py-8 px-4 bg-slate-50">
        <div className="max-w-xl mx-auto">
          <p className="text-center text-xs text-slate-500 mb-4">対応職種</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {PROFESSIONS.map((p) => (
              <div
                key={p.label}
                className="flex flex-col items-center gap-1 bg-white border border-slate-200 rounded-xl px-2 py-3 text-xs font-medium text-slate-700 shadow-sm"
              >
                <span className="text-xl">{p.icon}</span>
                <span>{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 診断の流れ */}
      <section className="py-12 px-4">
        <div className="max-w-xl mx-auto">
          <h2 className="text-xl font-bold text-center text-slate-800 mb-8">診断の流れ</h2>
          <div className="space-y-4">
            {STEPS.map((step, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center">
                  {step.num}
                </div>
                <div className="pt-1">
                  <p className="font-semibold text-slate-800 text-sm">{step.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 px-4 bg-blue-50">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-slate-700 font-medium mb-4">今すぐ年収を確認しましょう</p>
          <Link
            href="/diagnosis"
            className="inline-block bg-blue-600 text-white font-bold px-8 py-4 rounded-full text-base shadow hover:bg-blue-700 transition-colors"
          >
            診断スタート →
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 px-4">
        <div className="max-w-xl mx-auto">
          <h2 className="text-xl font-bold text-slate-800 mb-6">よくある質問</h2>
          <dl className="space-y-4">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-4">
                <dt className="font-semibold text-slate-800 text-sm mb-2">Q. {faq.q}</dt>
                <dd className="text-sm text-slate-600 leading-relaxed">A. {faq.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* フッター */}
      <footer className="border-t border-slate-100 py-6 px-4 text-center text-xs text-slate-400">
        <p>© 2026 MedSalary Check. 年収データは厚生労働省統計をベースとした推計値です。</p>
      </footer>
    </div>
  );
}
