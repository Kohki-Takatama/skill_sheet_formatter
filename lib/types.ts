export type SkillRating = "A" | "B" | "C" | "D" | "E" | "未設定";

export type Profile = {
  birthDate: string;
  gender: string;
  nationality: string;
  nearestStation: string;
  education: string;
  certifications: string[];
  skillSummary: string;
  skills: Record<string, Record<string, SkillRating>>;
};

export type Project = {
  id: string;
  title: string;
  periodStart: string;
  periodEnd: string;
  scale: string;
  role: string;
  phases: string[];
  languages: string[];
  tools: string[];
  os: string[];
  databases: string[];
};

export type SkillCategory = {
  name: string;
  items: string[];
};
