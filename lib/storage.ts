import type { Profile, Project } from "@/lib/types";
import { sampleProfile, sampleProjects } from "@/lib/sample-data";

const PROFILE_KEY = "skillsheet_poc_profile";
const PROJECTS_KEY = "skillsheet_poc_projects";

export function loadProfile(): Profile {
  if (typeof window === "undefined") {
    return sampleProfile;
  }
  const stored = window.localStorage.getItem(PROFILE_KEY);
  if (!stored) {
    window.localStorage.setItem(PROFILE_KEY, JSON.stringify(sampleProfile));
    return sampleProfile;
  }
  return JSON.parse(stored) as Profile;
}

export function saveProfile(profile: Profile) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function loadProjects(): Project[] {
  if (typeof window === "undefined") {
    return sampleProjects;
  }
  const stored = window.localStorage.getItem(PROJECTS_KEY);
  if (!stored) {
    window.localStorage.setItem(PROJECTS_KEY, JSON.stringify(sampleProjects));
    return sampleProjects;
  }
  return JSON.parse(stored) as Project[];
}

export function saveProjects(projects: Project[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

export function storageKeys() {
  return { PROFILE_KEY, PROJECTS_KEY };
}
