-- ============================================================
-- MedSalary Check v2.0 Supabase Schema
-- Supabaseダッシュボード > SQL Editor で実行してください
-- ============================================================

-- 診断結果保存テーブル
create table if not exists diagnosis_results (
  id            uuid default gen_random_uuid() primary key,
  user_id       uuid references auth.users(id) on delete cascade not null,
  profession    text not null,
  facility_type text not null,
  prefecture    text not null,
  experience    text not null,
  employment_type text not null,
  position      text not null,
  qualifications text[] not null default '{}',
  current_salary integer,
  median_salary  integer not null,
  national_avg   integer not null,
  evaluation    text not null check (evaluation in ('above', 'average', 'below')),
  difference    integer not null,
  created_at    timestamptz default now() not null
);

-- RLS (Row Level Security)
alter table diagnosis_results enable row level security;

create policy "own_results_select" on diagnosis_results
  for select using (auth.uid() = user_id);

create policy "own_results_insert" on diagnosis_results
  for insert with check (auth.uid() = user_id);

create policy "own_results_delete" on diagnosis_results
  for delete using (auth.uid() = user_id);

-- 匿名相場データテーブル（ユーザーデータ集計で相場精度向上に使用）
create table if not exists anonymous_salary_data (
  id              uuid default gen_random_uuid() primary key,
  profession      text not null,
  facility_type   text not null,
  region          text not null,
  experience      text not null,
  employment_type text not null,
  position        text not null,
  salary          integer not null,
  created_at      timestamptz default now() not null
);

-- 匿名データは誰でも insert 可、select は service_role のみ
alter table anonymous_salary_data enable row level security;

create policy "anon_data_insert" on anonymous_salary_data
  for insert with check (true);
