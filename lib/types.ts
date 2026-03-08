export type Profession =
  | "doctor"
  | "dentist"
  | "nurse"
  | "assistant_nurse"
  | "pharmacist"
  | "pt"
  | "ot"
  | "st"
  | "radiologist"
  | "clinical_lab_tech"
  | "dietitian"
  | "medical_clerk";

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

export const PROFESSIONS: { value: Profession; label: string; icon: string }[] = [
  { value: "doctor",          label: "医師",         icon: "🩺" },
  { value: "dentist",         label: "歯科医師",     icon: "🦷" },
  { value: "nurse",           label: "看護師",       icon: "💉" },
  { value: "assistant_nurse", label: "准看護師",     icon: "🏥" },
  { value: "pharmacist",      label: "薬剤師",       icon: "💊" },
  { value: "pt",              label: "理学療法士",   icon: "🦴" },
  { value: "ot",              label: "作業療法士",   icon: "🖐️" },
  { value: "st",              label: "言語聴覚士",   icon: "🗣️" },
  { value: "radiologist",     label: "放射線技師",   icon: "🔬" },
  { value: "clinical_lab_tech", label: "臨床検査技師", icon: "🧪" },
  { value: "dietitian",       label: "管理栄養士",   icon: "🥗" },
  { value: "medical_clerk",   label: "医療事務",     icon: "📋" },
];

export const FACILITY_TYPES: { value: FacilityType; label: string }[] = [
  { value: "university_hospital", label: "大学病院・特定機能病院" },
  { value: "general_hospital",    label: "総合病院（200床以上）" },
  { value: "small_hospital",      label: "中小病院（200床未満）" },
  { value: "clinic",              label: "クリニック・診療所" },
  { value: "nursing_home",        label: "介護施設・老人ホーム" },
  { value: "home_care",           label: "訪問看護・在宅医療" },
  { value: "pharmacy",            label: "調剤薬局" },
  { value: "drugstore",           label: "ドラッグストア" },
  { value: "other",               label: "その他" },
];

export const EXPERIENCE_RANGES: { value: ExperienceRange; label: string }[] = [
  { value: "lt1",   label: "1年未満" },
  { value: "1to3",  label: "1〜3年" },
  { value: "4to7",  label: "4〜7年" },
  { value: "8to14", label: "8〜14年" },
  { value: "gte15", label: "15年以上" },
];

export const EMPLOYMENT_TYPES: { value: EmploymentType; label: string }[] = [
  { value: "full_time",  label: "正社員・常勤" },
  { value: "part_time",  label: "非常勤・パート" },
  { value: "dispatch",   label: "派遣" },
  { value: "freelance",  label: "業務委託・フリーランス" },
  { value: "public",     label: "公務員" },
];

export const POSITIONS: { value: Position; label: string }[] = [
  { value: "staff",          label: "スタッフ（一般）" },
  { value: "chief",          label: "主任・チーフ" },
  { value: "manager",        label: "係長・師長相当" },
  { value: "senior_manager", label: "部長・科長相当" },
  { value: "executive",      label: "管理職（院長補佐・事務長等）" },
];

export const QUALIFICATIONS_BY_PROFESSION: Record<Profession, { value: string; label: string }[]> = {
  doctor: [
    { value: "board_certified",  label: "専門医資格" },
    { value: "phd",              label: "博士号（医学）" },
    { value: "mba",              label: "MBA" },
    { value: "subspecialty",     label: "サブスペシャルティ専門医" },
  ],
  dentist: [
    { value: "orthodontist",     label: "矯正歯科専門医" },
    { value: "oral_surgeon",     label: "口腔外科専門医" },
    { value: "implant_cert",     label: "インプラント認定医" },
    { value: "pediatric_dent",   label: "小児歯科専門医" },
  ],
  nurse: [
    { value: "certified_nurse",    label: "認定看護師" },
    { value: "specialist_nurse",   label: "専門看護師" },
    { value: "specific_practice",  label: "特定行為研修修了" },
    { value: "public_health_nurse", label: "保健師" },
    { value: "midwife",            label: "助産師" },
    { value: "care_manager",       label: "介護支援専門員（ケアマネ）" },
  ],
  assistant_nurse: [
    { value: "care_manager",       label: "介護支援専門員（ケアマネ）" },
    { value: "nurse_upgrade",      label: "看護師免許取得済み" },
    { value: "home_helper",        label: "訪問介護員（ホームヘルパー）" },
  ],
  pharmacist: [
    { value: "hospital_pharmacist",   label: "病院薬剤師認定" },
    { value: "oncology_pharmacist",   label: "がん専門薬剤師" },
    { value: "infection_pharmacist",  label: "感染制御専門薬剤師" },
    { value: "clinical_pharmacist",   label: "薬剤師認定制度認定薬剤師" },
    { value: "mba",                   label: "MBA" },
  ],
  pt: [
    { value: "certified_pt",      label: "認定理学療法士" },
    { value: "specialist_pt",     label: "専門理学療法士" },
    { value: "sports_instructor", label: "スポーツインストラクター" },
    { value: "care_manager",      label: "介護支援専門員（ケアマネ）" },
  ],
  ot: [
    { value: "certified_ot",      label: "認定作業療法士" },
    { value: "specialist_ot",     label: "専門作業療法士" },
    { value: "care_manager",      label: "介護支援専門員（ケアマネ）" },
  ],
  st: [
    { value: "certified_st",      label: "認定言語聴覚士" },
    { value: "dysphagia_cert",    label: "摂食嚥下認定" },
    { value: "care_manager",      label: "介護支援専門員（ケアマネ）" },
  ],
  radiologist: [
    { value: "radiation_oncology", label: "放射線治療専門放射線師" },
    { value: "mri_cert",           label: "MRI安全管理責任者" },
    { value: "nuclear_med",        label: "核医学専門技師" },
  ],
  clinical_lab_tech: [
    { value: "microbiology_cert",  label: "臨床微生物検査技師" },
    { value: "cytologist",         label: "細胞検査士" },
    { value: "genetics_cert",      label: "遺伝子分析科学認定士" },
  ],
  dietitian: [
    { value: "nst_cert",           label: "NST専門療法士" },
    { value: "sports_dietitian",   label: "公認スポーツ栄養士" },
    { value: "care_manager",       label: "介護支援専門員（ケアマネ）" },
  ],
  medical_clerk: [
    { value: "medical_coding",     label: "診療報酬請求事務能力認定" },
    { value: "medical_secretary",  label: "医療秘書技能検定" },
    { value: "medical_info",       label: "医療情報技師" },
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

const URBAN_PREFECTURES    = ["東京都", "大阪府", "愛知県", "神奈川県", "埼玉県", "千葉県"];
const SUBURBAN_PREFECTURES = ["北海道", "宮城県", "福岡県", "広島県", "京都府", "兵庫県", "静岡県", "新潟県"];

export function getRegionFromPrefecture(prefecture: string): Region {
  if (URBAN_PREFECTURES.includes(prefecture))    return "urban";
  if (SUBURBAN_PREFECTURES.includes(prefecture)) return "suburban";
  return "rural";
}
