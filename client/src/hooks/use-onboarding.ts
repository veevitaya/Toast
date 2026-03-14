import { useState, useCallback } from "react";

const ONBOARDING_KEY = "toast_user_profile";
const GUEST_KEY = "toast_guest_profile";

export interface OnboardingProfile {
  displayName: string;
  cuisinePreferences: string[];
  dietaryRestrictions: string[];
  defaultBudget: number;
  defaultDistance: string;
  pictureUrl: string;
  partnerName: string;
  partnerPictureUrl: string;
  partnerLinked: boolean;
  onboardingComplete: boolean;
}

export function getOnboardingProfile(): OnboardingProfile | null {
  try {
    const raw = localStorage.getItem(ONBOARDING_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.onboardingComplete && parsed.displayName) return parsed;
    }
  } catch {}
  return null;
}

export function isOnboardingComplete(): boolean {
  return !!getOnboardingProfile();
}

export function getSavedDisplayName(): string | null {
  const profile = getOnboardingProfile();
  return profile?.displayName || null;
}

export function saveOnboardingProfile(data: { displayName: string; cuisinePreferences: string[] }) {
  const existing = (() => {
    try {
      const raw = localStorage.getItem(ONBOARDING_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return {};
  })();

  const profile: OnboardingProfile = {
    ...existing,
    displayName: data.displayName,
    cuisinePreferences: data.cuisinePreferences,
    dietaryRestrictions: existing.dietaryRestrictions || [],
    defaultBudget: existing.defaultBudget || 2,
    defaultDistance: existing.defaultDistance || "3000",
    pictureUrl: existing.pictureUrl || "",
    partnerName: existing.partnerName || "",
    partnerPictureUrl: existing.partnerPictureUrl || "",
    partnerLinked: existing.partnerLinked || false,
    onboardingComplete: true,
  };

  localStorage.setItem(ONBOARDING_KEY, JSON.stringify(profile));

  const guestRaw = localStorage.getItem(GUEST_KEY);
  if (guestRaw) {
    try {
      const guest = JSON.parse(guestRaw);
      guest.displayName = data.displayName;
      localStorage.setItem(GUEST_KEY, JSON.stringify(guest));
    } catch {}
  }
}

export function useOnboarding() {
  const [complete, setComplete] = useState(() => isOnboardingComplete());

  const markComplete = useCallback((data: { displayName: string; cuisinePreferences: string[] }) => {
    saveOnboardingProfile(data);
    setComplete(true);
  }, []);

  return { complete, markComplete, profile: getOnboardingProfile() };
}
