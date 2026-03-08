import { create } from "zustand";
import type {
  DiagnosisAnswers,
  Profession,
  FacilityType,
  ExperienceRange,
  EmploymentType,
  Position,
  Qualification,
} from "@/lib/types";
import { getRegionFromPrefecture } from "@/lib/types";

const initialAnswers: DiagnosisAnswers = {
  profession: null,
  facilityType: null,
  prefecture: null,
  region: null,
  experience: null,
  employmentType: null,
  position: null,
  qualifications: [],
  currentSalary: null,
  salaryUnknown: false,
};

interface DiagnosisStore {
  currentStep: number;
  answers: DiagnosisAnswers;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setProfession: (v: Profession) => void;
  setFacilityType: (v: FacilityType) => void;
  setPrefecture: (v: string) => void;
  setExperience: (v: ExperienceRange) => void;
  setEmploymentType: (v: EmploymentType) => void;
  setPosition: (v: Position) => void;
  toggleQualification: (v: Qualification) => void;
  setCurrentSalary: (v: number | null) => void;
  setSalaryUnknown: (v: boolean) => void;
  reset: () => void;
}

export const useDiagnosisStore = create<DiagnosisStore>((set) => ({
  currentStep: 1,
  answers: initialAnswers,

  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, 8) })),
  prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 1) })),

  setProfession: (v) =>
    set((s) => ({ answers: { ...s.answers, profession: v, qualifications: [] } })),

  setFacilityType: (v) =>
    set((s) => ({ answers: { ...s.answers, facilityType: v } })),

  setPrefecture: (v) =>
    set((s) => ({
      answers: { ...s.answers, prefecture: v, region: getRegionFromPrefecture(v) },
    })),

  setExperience: (v) =>
    set((s) => ({ answers: { ...s.answers, experience: v } })),

  setEmploymentType: (v) =>
    set((s) => ({ answers: { ...s.answers, employmentType: v } })),

  setPosition: (v) =>
    set((s) => ({ answers: { ...s.answers, position: v } })),

  toggleQualification: (v) =>
    set((s) => {
      const exists = s.answers.qualifications.includes(v);
      const qualifications = exists
        ? s.answers.qualifications.filter((q) => q !== v)
        : [...s.answers.qualifications, v];
      return { answers: { ...s.answers, qualifications } };
    }),

  setCurrentSalary: (v) =>
    set((s) => ({ answers: { ...s.answers, currentSalary: v, salaryUnknown: false } })),

  setSalaryUnknown: (v) =>
    set((s) => ({ answers: { ...s.answers, salaryUnknown: v, currentSalary: v ? null : s.answers.currentSalary } })),

  reset: () => set({ currentStep: 1, answers: initialAnswers }),
}));
