import type { Profile, Project, SkillCategory } from "@/lib/types";

export const skillCategories: SkillCategory[] = [
  {
    name: "言語",
    items: ["TypeScript", "JavaScript", "Python", "Go", "Java", "Ruby", "C#", "PHP"]
  },
  {
    name: "FW",
    items: ["Next.js", "React", "Vue", "Nuxt", "Laravel", "Spring", "Express", "Django"]
  },
  {
    name: "DB",
    items: ["PostgreSQL", "MySQL", "SQLite", "Redis", "MongoDB", "DynamoDB"]
  },
  {
    name: "クラウド",
    items: ["AWS", "GCP", "Azure", "Vercel", "Firebase"]
  },
  {
    name: "その他",
    items: ["Docker", "Kubernetes", "GitHub Actions", "Terraform", "Figma"]
  }
];

export const sampleProfile: Profile = {
  birthDate: "1994-06-15",
  gender: "男性",
  nationality: "日本",
  nearestStation: "渋谷",
  education: "大学卒",
  certifications: ["AWS Certified Solutions Architect", "基本情報技術者"],
  skillSummary:
    "Webアプリ開発を中心に、要件整理から運用まで一通り対応。直近はNext.jsとAWSを中心にフロント〜インフラまで幅広く担当。",
  skills: {
    言語: {
      TypeScript: "A",
      JavaScript: "A",
      Python: "B",
      Go: "C",
      Java: "C",
      Ruby: "B",
      "C#": "未設定",
      PHP: "D"
    },
    FW: {
      "Next.js": "A",
      React: "A",
      Vue: "B",
      Nuxt: "C",
      Laravel: "B",
      Spring: "C",
      Express: "B",
      Django: "C"
    },
    DB: {
      PostgreSQL: "B",
      MySQL: "B",
      SQLite: "C",
      Redis: "C",
      MongoDB: "D",
      DynamoDB: "C"
    },
    クラウド: {
      AWS: "B",
      GCP: "C",
      Azure: "D",
      Vercel: "B",
      Firebase: "C"
    },
    その他: {
      Docker: "B",
      Kubernetes: "C",
      "GitHub Actions": "B",
      Terraform: "C",
      Figma: "C"
    }
  }
};

export const sampleProjects: Project[] = [
  {
    id: "project-1",
    title: "ECサイトリニューアル",
    periodStart: "2024-01-01",
    periodEnd: "2024-04-30",
    scale: "10人以上",
    role: "SE",
    phases: ["要件定義", "基本設計", "詳細設計", "製造", "テスト"],
    languages: ["TypeScript", "SQL"],
    tools: ["Next.js", "Prisma", "AWS"],
    os: ["Linux"],
    databases: ["PostgreSQL"]
  },
  {
    id: "project-2",
    title: "SaaS分析ダッシュボード",
    periodStart: "2023-07-01",
    periodEnd: "2023-12-31",
    scale: "6-10人",
    role: "PL",
    phases: ["基本設計", "詳細設計", "製造", "テスト"],
    languages: ["TypeScript", "Python"],
    tools: ["React", "FastAPI", "GCP"],
    os: ["Linux"],
    databases: ["BigQuery", "PostgreSQL"]
  },
  {
    id: "project-3",
    title: "モバイルアプリ基盤構築",
    periodStart: "2023-02-01",
    periodEnd: "2023-06-30",
    scale: "3-5人",
    role: "PG",
    phases: ["詳細設計", "製造", "テスト"],
    languages: ["Swift", "Kotlin"],
    tools: ["Firebase", "Figma"],
    os: ["iOS", "Android"],
    databases: ["Firestore"]
  },
  {
    id: "project-4",
    title: "受発注管理システム",
    periodStart: "2022-07-01",
    periodEnd: "2022-12-31",
    scale: "10人以上",
    role: "SE",
    phases: ["要件定義", "基本設計", "詳細設計", "製造", "テスト", "保守"],
    languages: ["Java", "SQL"],
    tools: ["Spring", "Oracle"],
    os: ["Windows", "Linux"],
    databases: ["Oracle"]
  },
  {
    id: "project-5",
    title: "社内ワークフロー自動化",
    periodStart: "2022-01-01",
    periodEnd: "2022-06-30",
    scale: "2人",
    role: "PG",
    phases: ["詳細設計", "製造", "テスト", "保守"],
    languages: ["Python"],
    tools: ["Django", "Docker"],
    os: ["Linux"],
    databases: ["SQLite"]
  },
  {
    id: "project-6",
    title: "マーケ施策管理ツール",
    periodStart: "2021-07-01",
    periodEnd: "2021-12-31",
    scale: "6-10人",
    role: "SE",
    phases: ["基本設計", "詳細設計", "製造", "テスト"],
    languages: ["JavaScript"],
    tools: ["Vue", "Firebase"],
    os: ["Linux"],
    databases: ["Firestore"]
  }
];

export const projectScaleOptions = ["2人", "3-5人", "6-10人", "10人以上"];

export const roles = ["PG", "SE", "PL", "PjM", "PdM"];

export const phaseOptions = [
  "要件定義",
  "基本設計",
  "詳細設計",
  "製造",
  "テスト",
  "保守"
];

export const ratingOptions: Array<Profile["skills"][string][string]> = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "未設定"
];
