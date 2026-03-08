interface Props {
  urgent?: boolean;
  professionLabel: string;
}

const AGENTS = [
  { name: "マイナビ看護師",    desc: "医療・看護専門。非公開求人多数",      href: "#" },
  { name: "ナース人材バンク",  desc: "登録無料・転職サポート実績No.1",       href: "#" },
  { name: "薬キャリAGENT",    desc: "薬剤師・医療技術職に特化",            href: "#" },
];

export function AgentCta({ urgent, professionLabel }: Props) {
  if (urgent) {
    return (
      <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-5">
        <div className="flex items-start gap-3 mb-4">
          <span className="text-2xl">💡</span>
          <div>
            <p className="font-bold text-amber-800 text-sm">年収アップのチャンスかもしれません</p>
            <p className="text-xs text-amber-700 mt-1 leading-relaxed">
              あなたの年収は市場相場より低い傾向にあります。
              医療特化型の転職エージェントに無料相談するだけで、好条件の非公開求人が見つかるケースが多くあります。
            </p>
          </div>
        </div>
        <div className="space-y-2 mb-4">
          {AGENTS.map((a) => (
            <a
              key={a.name}
              href={a.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-amber-200 hover:border-amber-400 transition-colors group"
            >
              <div>
                <p className="text-sm font-semibold text-slate-800 group-hover:text-amber-700">{a.name}</p>
                <p className="text-xs text-slate-500">{a.desc}</p>
              </div>
              <span className="text-amber-600 text-xs font-bold">無料相談 →</span>
            </a>
          ))}
        </div>
        <p className="text-[10px] text-amber-600 text-center">
          ※ 転職・相談は完全無料。エージェントが求人企業から紹介料を受け取る仕組みです。
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-semibold text-slate-500 mb-1">さらに年収を上げたい方へ</p>
      <p className="text-sm text-slate-700 mb-4">
        {professionLabel}に特化した転職エージェントに相談してみませんか？登録・相談は無料です。
      </p>
      <div className="space-y-2 mb-3">
        {AGENTS.map((a) => (
          <a
            key={a.name}
            href={a.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-colors group"
          >
            <div>
              <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-700">{a.name}</p>
              <p className="text-xs text-slate-500">{a.desc}</p>
            </div>
            <span className="text-blue-600 text-xs font-bold">無料相談 →</span>
          </a>
        ))}
      </div>
      <p className="text-[10px] text-slate-400 text-center">
        ※ 転職・相談は完全無料。エージェントが求人企業から紹介料を受け取る仕組みです。
      </p>
    </div>
  );
}
