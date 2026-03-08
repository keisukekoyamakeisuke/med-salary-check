export type Profession = "nurse" | "pharmacist" | "pt";

export type FacilityType =
  | "university_hospital"
  | "general_hospital"
  | "small_hospital"
  | "clinic"
  | "nursing_home"
  | "home_care"
  | "pharmacy"
  | "drugstore"
  | "other";

export type Region = "urban" | "suburban" | "rural";

export type ExperienceRange = "lt1" | "1to3" | "4to7" | "8to14" | "gte15";

export type EmploymentType = "full_time" | "part_time" | "dispatch" | "freelance" | "public";

export type Position = "staff" | "chief" | "manager" | "senior_manager" | "executive";

export type Qualification = string;

export interface DiagnosisAnswers {
  profession: Profession | null;
  facilityType: FacilityType | null;
  prefecture: string | null;
  region: Region | null;
  experience: ExperienceRange | null;
  employmentType: EmploymentType | null;
  position: Position | null;
  qualifications: Qualification[];
  currentSalary: number | null;
  salaryUnknown: boolean;
}

export interface SalaryData {
  avgSalary: number;
  medianSalary: number;
  p25Salary: number;
  p75Salary: number;
  nationalAvg: number;
}

export interface DiagnosisResult {
  answers: DiagnosisAnswers;
  salaryData: SalaryData;
  evaluation: "above" | "average" | "below";
  difference: number;
  advices: Advice[];
}

export interface Advice {
  priority: number;
  title: string;
  description: string;
  impact: string;
}

export const PROFESSIONS: { value: Profession; label: string }[] = [
  { value: "nurse", label: "看護師" },
  { value: "pharmacist", label: "薬剤師" },
  { value: "pt", label: "理学療法士" },
];

export const FACILITY_TYPES: { value: FacilityType; label: string }[] = [
  { value: "university_hospital", label: "大学病院・特定機能病院" },
  { value: "general_hospital", label: "総合病院（200床以上）" },
  { value: "small_hospital", label: "中小病院（200床未満）" },
  { value: "clinic", label: "クリニック・診療所" },
  { value: "nursing_home", label: "介護施設・老人ホーム" },
  { value: "home_care", label: "訪問看護・在宅医療" },
  { value: "pharmacy", label: "調剤薬局" },
  { value: "drugstore", label: "ドラッグストア" },
  { value: "other", label: "その他" },
];

export const EXPERIENCE_RANGES: { value: ExperienceRange; label: string }[] = [
  { value: "lt1", label: "1年未満" },
  { value: "1to3", label: "1〜3年" },
  { value: "4to7", label: "4〜7年" },
  { value: "8to14", label: "8〜14年" },
  { value: "gte15", label: "15年以上" },
];

export const EMPLOYMENT_TYPES: { value: EmploymentType; label: string }[] = [
  { value: "full_time", label: "正社員・常勤" },
  { value: "part_time", label: "非常勤・パート" },
  { value: "dispatch", label: "派遣" },
  { value: "freelance", label: "業務委託・フリーランス" },
  { value: "public", label: "公務員" },
];

export const POSITIONS: { value: Position; label: string }[] = [
  { value: "staff", label: "スタッフ（一般）" },
  { value: "chief", label: "主任・チーフ" },
  { value: "manager", label: "係長・師長相当" },
  { value: "senior_manager", label: "部長・科長相当" },
  { value: "executive", label: "管理職（院長補佐・事務長等）" },
];

export const QUALIFICATIONS_BY_PROFESSION: Record<Profession, { value: string; label: string }[]> = {
  nurse: [
    { value: "certified_nurse", label: "認定看護師" },
    { value: "specialist_nurse", label: "専門看護師" },
    { value: "specific_practice", label: "特定行為研修修了" },
    { value: "public_health_nurse", label: "保健師" },
    { value: "midwife", label: "助産師" },
    { value: "care_manager", label: "介護支援専門員（ケアマネ）" },
  ],
  pharmacist: [
    { value: "hospital_pharmacist", label: "病院薬剤師認定" },
    { value: "oncology_pharmacist", label: "がん専門薬剤師" },
    { value: "infection_pharmacist", label: "感染制御専門薬剤師" },
    { value: "clinical_pharmacist", label: "薬剤師認定制度認定薬剤師" },
    { value: "mba", label: "MBA" },
  ],
  pt: [
    { value: "sports_instructor", label: "スポーツインストラクター" },
    { value: "certified_pt", label: "認定理学療法士" },
    { value: "specialist_pt", label: "専門理学療法士" },
    { value: "care_manager", label: "介護支援専門員（ケアマネ）" },
  ],
};

export const PREFECTURES = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県",
  "岐阜県", "静岡県", "愛知県", "三重県",
  "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県",
  "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県",
  "福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県",
];

const URBAN_PREFECTURES = ["東京都", "大阪府", "愛知県", "神奈川県", "埼玉県", "千葉県"];
const SUBURBAN_PREFECTURES = [
  "北海道", "宮城県", "福岡県", "広島県", "京都府", "兵庫県", "静岡県", "新潟県",
];

export function getRegionFromPrefecture(prefecture: string): Region {
  if (URBAN_PREFECTURES.includes(prefecture)) return "urban";
  if (SUBURBAN_PREFECTURES.includes(prefecture)) return "suburban";
  return "rural";
}
