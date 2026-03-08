import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { PROFESSIONS, FACILITY_TYPES, EXPERIENCE_RANGES, EMPLOYMENT_TYPES, POSITIONS } from "@/lib/types";

function getLabel<T extends { value: string; label: string }>(list: T[], value: string) {
  return list.find((i) => i.value === value)?.label ?? value;
}

function buildPrompt(body: Record<string, unknown>): string {
  const profession     = getLabel(PROFESSIONS,      String(body.profession ?? ""));
  const facilityType   = getLabel(FACILITY_TYPES,   String(body.facilityType ?? ""));
  const experience     = getLabel(EXPERIENCE_RANGES, String(body.experience ?? ""));
  const employmentType = getLabel(EMPLOYMENT_TYPES,  String(body.employmentType ?? ""));
  const position       = getLabel(POSITIONS,         String(body.position ?? ""));
  const prefecture     = String(body.prefecture ?? "不明");
  const qualifications = (body.qualifications as string[] | undefined)?.join("、") || "なし";
  const currentSalary  = body.currentSalary
    ? `${Math.round(Number(body.currentSalary) / 10000)}万円`
    : "未入力";
  const medianSalary   = `${Math.round(Number(body.medianSalary) / 10000)}万円`;
  const evaluation     = body.evaluation === "above" ? "相場より高い" : body.evaluation === "below" ? "相場より低い" : "相場と同水準";
  const diffNum        = Number(body.difference ?? 0);
  const difference     = diffNum !== 0
    ? `${diffNum > 0 ? "+" : ""}${Math.round(diffNum / 10000)}万円`
    : "―";

  return `あなたは医療従事者のキャリア・年収アドバイザーです。以下の診断結果を基に、この方だけに向けた具体的で実践的な年収アップアドバイスを日本語で提供してください。

## 診断プロフィール
- 職種: ${profession}
- 勤務先: ${facilityType}
- 勤務地: ${prefecture}
- 経験年数: ${experience}
- 雇用形態: ${employmentType}
- 役職: ${position}
- 保有資格: ${qualifications}
- 現在の年収: ${currentSalary}
- 同条件の市場相場（中央値）: ${medianSalary}
- 相場との比較: ${evaluation}（差額: ${difference}）

## 回答の要件
- この方のプロフィールに完全に特化した内容にしてください（一般論は不要）
- 以下の3つの観点から、合計4〜6点のアドバイスを提供してください:
  1. **今すぐできるアクション**（転職準備・資格・交渉など）
  2. **1〜3年の中期キャリアプラン**
  3. **年収交渉・転職のタイミングと戦略**
- 各アドバイスには具体的な数字（期待年収増加額、必要期間など）を含めてください
- マークダウン形式（見出し・箇条書き）で見やすく整理してください
- 励ましや希望を持てるトーンで、前向きに締めてください`;
}

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response("ANTHROPIC_API_KEY が設定されていません", { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await client.messages.stream({
          model: "claude-sonnet-4-6",
          max_tokens: 1500,
          messages: [{ role: "user", content: buildPrompt(body) }],
        });

        for await (const chunk of response) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
      } catch {
        controller.enqueue(
          encoder.encode("\n\n※ AI アドバイスの生成中にエラーが発生しました。しばらく後に再試行してください。")
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      "X-Accel-Buffering": "no",
    },
  });
}
