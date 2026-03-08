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
  nurse: {
    lt1: 320,
    "1to3": 360,
    "4to7": 420,
    "8to14": 480,
    gte15: 540,
  },
  pharmacist: {
    lt1: 380,
    "1to3": 440,
    "4to7": 510,
    "8to14": 580,
    gte15: 650,
  },
  pt: {
    lt1: 300,
    "1to3": 340,
    "4to7": 390,
    "8to14": 430,
    gte15: 480,
  },
};

const NATIONAL_AVG: Record<Profession, number> = {
  nurse: 508,
  pharmacist: 575,
  pt: 409,
};

// 施設タイプ係数
const FACILITY_MULTIPLIER: Record<FacilityType, number> = {
  university_hospital: 1.15,
  general_hospital: 1.08,
  small_hospital: 1.0,
  clinic: 0.92,
  nursing_home: 0.88,
  home_care: 0.95,
  pharmacy: 1.05,
  drugstore: 0.97,
  other: 1.0,
};

// 地域係数
const REGION_MULTIPLIER: Record<Region, number> = {
  urban: 1.1,
  suburban: 1.0,
  rural: 0.92,
};

// 雇用形態係数
const EMPLOYMENT_MULTIPLIER: Record<EmploymentType, number> = {
  full_time: 1.0,
  part_time: 0.65,
  dispatch: 1.05,
  freelance: 1.1,
  public: 1.03,
};

// 役職係数
const POSITION_MULTIPLIER: Record<Position, number> = {
  staff: 1.0,
  chief: 1.12,
  manager: 1.25,
  senior_manager: 1.45,
  executive: 1.7,
};

export function getSalaryData(
  profession: Profession,
  experience: ExperienceRange,
  region: Region,
  facilityType: FacilityType,
  employmentType: EmploymentType,
  position: Position
): SalaryData {
  const base = BASE_SALARY[profession][experience];
  const facilityMul = FACILITY_MULTIPLIER[facilityType];
  const regionMul = REGION_MULTIPLIER[region];
  const employmentMul = EMPLOYMENT_MULTIPLIER[employmentType];
  const positionMul = POSITION_MULTIPLIER[position];

  const medianSalary = Math.round(base * facilityMul * regionMul * employmentMul * positionMul);
  const avgSalary = Math.round(medianSalary * 1.03);
  const p25Salary = Math.round(medianSalary * 0.85);
  const p75Salary = Math.round(medianSalary * 1.18);
  const nationalAvg = NATIONAL_AVG[profession];

  return {
    avgSalary: avgSalary * 10000,
    medianSalary: medianSalary * 10000,
    p25Salary: p25Salary * 10000,
    p75Salary: p75Salary * 10000,
    nationalAvg: nationalAvg * 10000,
  };
}
