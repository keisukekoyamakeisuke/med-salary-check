import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// POST /api/anonymous-data — 匿名データの収集（相場精度向上）
export async function POST(request: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ ok: true }); // 未設定時はサイレントスキップ
  }

  const body = await request.json();

  // 年収が入力されている場合のみ保存
  if (!body.salary || !body.profession || !body.region) {
    return NextResponse.json({ ok: true });
  }

  const supabase = createClient();
  await supabase.from("anonymous_salary_data").insert({
    profession:      body.profession,
    facility_type:   body.facilityType,
    region:          body.region,
    experience:      body.experience,
    employment_type: body.employmentType,
    position:        body.position,
    salary:          body.salary,
  });

  return NextResponse.json({ ok: true });
}
