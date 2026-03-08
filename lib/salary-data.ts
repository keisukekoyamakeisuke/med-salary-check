import type {
  Profession,
  FacilityType,
  Region,
  ExperienceRange,
  EmploymentType,
  Position,
  SalaryData,
} from "./types";

// 厚生労働省「賃金構造基本統計調査」ベースの推計値（万円単位）
// 実際のリリース時は正確なデータに置き換えること

const BASE_SALARY: Record<Profession, Record<ExperienceRange, number>> = {
  doctor:           { lt1: 800,  "1to3": 1200, "4to7": 1500, "8to14": 1800, gte15: 2200 },
  dentist:          { lt1: 400,  "1to3": 500,  "4to7": 650,  "8to14": 800,  gte15: 950  },
  nurse:            { lt1: 320,  "1to3": 360,  "4to7": 420,  "8to14": 480,  gte15: 540  },
  assistant_nurse:  { lt1: 280,  "1to3": 310,  "4to7": 360,  "8to14": 400,  gte15: 430  },
  pharmacist:       { lt1: 380,  "1to3": 440,  "4to7": 510,  "8to14": 580,  gte15: 650  },
  pt:               { lt1: 300,  "1to3": 340,  "4to7": 390,  "8to14": 430,  gte15: 480  },
  ot:               { lt1: 295,  "1to3": 335,  "4to7": 385,  "8to14": 420,  gte15: 465  },
  st:               { lt1: 290,  "1to3": 330,  "4to7": 380,  "8to14": 415,  gte15: 460  },
  radiologist:      { lt1: 330,  "1to3": 380,  "4to7": 440,  "8to14": 500,  gte15: 550  },
  clinical_lab_tech:{ lt1: 310,  "1to3": 360,  "4to7": 415,  "8to14": 470,  gte15: 520  },
  dietitian:        { lt1: 270,  "1to3": 310,  "4to7": 360,  "8to14": 410,  gte15: 450  },
  medical_clerk:    { lt1: 230,  "1to3": 260,  "4to7": 300,  "8to14": 340,  gte15: 380  },
};

const NATIONAL_AVG: Record<Profession, number> = {
  doctor:            1491,
  dentist:            720,
  nurse:              508,
  assistant_nurse:    388,
  pharmacist:         575,
  pt:                 409,
  ot:                 397,
  st:                 392,
  radiologist:        490,
  clinical_lab_tech:  460,
  dietitian:          382,
  medical_clerk:      315,
};

const FACILITY_MULTIPLIER: Record<FacilityType, number> = {
  university_hospital: 1.15,
  general_hospital:    1.08,
  small_hospital:      1.0,
  clinic:              0.92,
  nursing_home:        0.88,
  home_care:           0.95,
  pharmacy:            1.05,
  drugstore:           0.97,
  other:               1.0,
};

const REGION_MULTIPLIER: Record<Region, number> = {
  urban:    1.1,
  suburban: 1.0,
  rural:    0.92,
};

const EMPLOYMENT_MULTIPLIER: Record<EmploymentType, number> = {
  full_time:  1.0,
  part_time:  0.65,
  dispatch:   1.05,
  freelance:  1.1,
  public:     1.03,
};

const POSITION_MULTIPLIER: Record<Position, number> = {
  staff:          1.0,
  chief:          1.12,
  manager:        1.25,
  senior_manager: 1.45,
  executive:      1.7,
};

export function getSalaryData(
  profession: Profession,
  experience: ExperienceRange,
  region: Region,
  facilityType: FacilityType,
  employmentType: EmploymentType,
  position: Position
): SalaryData {
  const base        = BASE_SALARY[profession][experience];
  const facilityMul = FACILITY_MULTIPLIER[facilityType];
  const regionMul   = REGION_MULTIPLIER[region];
  const employMul   = EMPLOYMENT_MULTIPLIER[employmentType];
  const posMul      = POSITION_MULTIPLIER[position];

  const medianSalary = Math.round(base * facilityMul * regionMul * employMul * posMul);
  const avgSalary    = Math.round(medianSalary * 1.03);
  const p25Salary    = Math.round(medianSalary * 0.85);
  const p75Salary    = Math.round(medianSalary * 1.18);
  const nationalAvg  = NATIONAL_AVG[profession];

  return {
    avgSalary:    avgSalary    * 10000,
    medianSalary: medianSalary * 10000,
    p25Salary:    p25Salary    * 10000,
    p75Salary:    p75Salary    * 10000,
    nationalAvg:  nationalAvg  * 10000,
  };
}

// 経験年数別の年収推移データ（グラフ用）
export interface ProgressionPoint {
  label: string;
  median: number;
  p25: number;
  p75: number;
  national: number;
}

const EXP_ORDER: ExperienceRange[] = ["lt1", "1to3", "4to7", "8to14", "gte15"];
const EXP_LABELS: Record<ExperienceRange, string> = {
  lt1:   "1年未満",
  "1to3":  "1〜3年",
  "4to7":  "4〜7年",
  "8to14": "8〜14年",
  gte15: "15年以上",
};

export function getSalaryProgressionData(
  profession: Profession,
  region: Region,
  facilityType: FacilityType,
  employmentType: EmploymentType,
  position: Position
): ProgressionPoint[] {
  return EXP_ORDER.map((exp) => {
    const data = getSalaryData(profession, exp, region, facilityType, employmentType, position);
    return {
      label:    EXP_LABELS[exp],
      median:   data.medianSalary / 10000,
      p25:      data.p25Salary    / 10000,
      p75:      data.p75Salary    / 10000,
      national: data.nationalAvg  / 10000,
    };
  });
}
