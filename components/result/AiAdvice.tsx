"use client";

import { useState, useRef } from "react";
import type { DiagnosisAnswers } from "@/lib/types";

interface Props {
  answers: DiagnosisAnswers;
  medianSalary: number;
  evaluation: "above" | "average" | "below";
  difference: number;
}

type State = "idle" | "loading" | "streaming" | "done" | "error";

// Minimal markdown renderer (bold, headings, lists)
function renderMarkdown(text: string) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];

  lines.forEach((line, i) => {
    if (/^## (.+)/.test(line)) {
      elements.push(
        <h3 key={i} className="text-sm font-bold text-slate-800 mt-4 mb-1">
          {line.replace(/^## /, "")}
        </h3>
      );
    } else if (/^### (.+)/.test(line)) {
      elements.push(
        <h4 key={i} className="text-xs font-bold text-blue-700 mt-3 mb-0.5">
          {line.replace(/^### /, "")}
        </h4>
      );
    } else if (/^[-*] (.+)/.test(line)) {
      const content = line.replace(/^[-*] /, "");
      elements.push(
        <li key={i} className="text-sm text-slate-700 leading-relaxed ml-3 list-disc">
          {renderInline(content)}
        </li>
      );
    } else if (/^\d+\. (.+)/.test(line)) {
      const content = line.replace(/^\d+\. /, "");
      elements.push(
        <li key={i} className="text-sm text-slate-700 leading-relaxed ml-3 list-decimal">
          {renderInline(content)}
        </li>
      );
    } else if (line.trim() === "") {
      elements.push(<div key={i} className="h-1" />);
    } else {
      elements.push(
        <p key={i} className="text-sm text-slate-700 leading-relaxed">
          {renderInline(line)}
        </p>
      );
    }
  });

  return elements;
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    /^\*\*[^*]+\*\*$/.test(part) ? (
      <strong key={i} className="font-semibold text-slate-800">
        {part.replace(/\*\*/g, "")}
      </strong>
    ) : (
      part
    )
  );
}

export function AiAdvice({ answers, medianSalary, evaluation, difference }: Props) {
  const [state, setState]   = useState<State>("idle");
  const [text, setText]     = useState("");
  const abortRef            = useRef<AbortController | null>(null);

  const generate = async () => {
    setState("loading");
    setText("");
    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/ai-advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...answers, medianSalary, evaluation, difference }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const msg = await res.text();
        setText(msg || "エラーが発生しました");
        setState("error");
        return;
      }

      if (!res.body) { setState("error"); return; }

      setState("streaming");
      const reader  = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setText((prev) => prev + decoder.decode(value, { stream: true }));
      }
      setState("done");
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setState("error");
    }
  };

  const reset = () => {
    abortRef.current?.abort();
    setState("idle");
    setText("");
  };

  if (state === "idle") {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-5">
        <div className="flex items-start gap-3 mb-4">
          <span className="text-2xl">🤖</span>
          <div>
            <p className="font-bold text-blue-800 text-sm">Claude AI による個別アドバイス</p>
            <p className="text-xs text-blue-600 mt-0.5">
              あなたの職種・経験・相場データを基に、AIが専用のキャリアアドバイスを生成します
            </p>
          </div>
        </div>
        <button
          onClick={generate}
          className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-colors text-sm shadow-md"
        >
          ✨ AI個別アドバイスを生成する（無料）
        </button>
        <p className="text-[10px] text-blue-500 text-center mt-2">
          Anthropic Claude Sonnet 4.6 が回答を生成します
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-blue-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">🤖</span>
          <p className="font-bold text-slate-800 text-sm">Claude AI 個別アドバイス</p>
          {state === "streaming" && (
            <span className="flex gap-0.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </span>
          )}
        </div>
        {(state === "done" || state === "error") && (
          <button onClick={reset} className="text-xs text-slate-400 hover:text-slate-600">
            再生成
          </button>
        )}
      </div>

      {state === "loading" && (
        <div className="flex items-center gap-3 py-6 justify-center">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-slate-500">AIがアドバイスを生成しています...</span>
        </div>
      )}

      {(state === "streaming" || state === "done") && text && (
        <div className="prose prose-sm max-w-none">{renderMarkdown(text)}</div>
      )}

      {state === "error" && (
        <p className="text-sm text-red-600 bg-red-50 rounded-xl p-3">
          {text || "エラーが発生しました。API キーの設定を確認するか、しばらく後に再試行してください。"}
        </p>
      )}
    </div>
  );
}
