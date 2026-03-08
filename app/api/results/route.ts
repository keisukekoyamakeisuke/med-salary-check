import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// POST /api/results — 診断結果を保存
export async function POST(request: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const { error } = await supabase.from("diagnosis_results").insert({
    user_id:         user.id,
    profession:      body.profession,
    facility_type:   body.facilityType,
    prefecture:      body.prefecture,
    experience:      body.experience,
    employment_type: body.employmentType,
    position:        body.position,
    qualifications:  body.qualifications ?? [],
    current_salary:  body.currentSalary ?? null,
    median_salary:   body.medianSalary,
    national_avg:    body.nationalAvg,
    evaluation:      body.evaluation,
    difference:      body.difference,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

// GET /api/results — ログイン中ユーザーの結果一覧
export async function GET() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json([], { status: 200 });
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("diagnosis_results")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}
