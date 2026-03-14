export interface LegalDocument {
  id: string;
  slug: string;
  titleKey: string;
  subtitleKey: string;
  effectiveDate: string;
  owner: string;
  ownerShort: string;
}

export const LEGAL_EFFECTIVE_DATE = "March 14, 2026";
export const LEGAL_OWNER = "Prodigy Dreamground Co., Ltd. (ProDG)";
export const LEGAL_OWNER_SHORT = "ProDG";
export const LEGAL_CONTACT_PRIVACY = "privacy@toastapp.com";
export const LEGAL_CONTACT_LEGAL = "legal@toastapp.com";

export const LEGAL_DOCUMENTS: LegalDocument[] = [
  {
    id: "privacy_policy",
    slug: "privacy-policy",
    titleKey: "legal.privacy_policy",
    subtitleKey: "legal.privacy_policy_desc",
    effectiveDate: LEGAL_EFFECTIVE_DATE,
    owner: LEGAL_OWNER,
    ownerShort: LEGAL_OWNER_SHORT,
  },
  {
    id: "terms_of_service",
    slug: "terms-of-service",
    titleKey: "legal.terms_of_service",
    subtitleKey: "legal.terms_of_service_desc",
    effectiveDate: LEGAL_EFFECTIVE_DATE,
    owner: LEGAL_OWNER,
    ownerShort: LEGAL_OWNER_SHORT,
  },
  {
    id: "restaurant_partner_terms",
    slug: "restaurant-partner-terms",
    titleKey: "legal.restaurant_partner_terms",
    subtitleKey: "legal.restaurant_partner_terms_desc",
    effectiveDate: LEGAL_EFFECTIVE_DATE,
    owner: LEGAL_OWNER,
    ownerShort: LEGAL_OWNER_SHORT,
  },
  {
    id: "ai_transparency_policy",
    slug: "ai-transparency-policy",
    titleKey: "legal.ai_transparency_policy",
    subtitleKey: "legal.ai_transparency_policy_desc",
    effectiveDate: LEGAL_EFFECTIVE_DATE,
    owner: LEGAL_OWNER,
    ownerShort: LEGAL_OWNER_SHORT,
  },
  {
    id: "platform_liability_food_safety",
    slug: "platform-liability",
    titleKey: "legal.platform_liability",
    subtitleKey: "legal.platform_liability_desc",
    effectiveDate: LEGAL_EFFECTIVE_DATE,
    owner: LEGAL_OWNER,
    ownerShort: LEGAL_OWNER_SHORT,
  },
  {
    id: "cookie_policy",
    slug: "cookie-policy",
    titleKey: "legal.cookie_policy",
    subtitleKey: "legal.cookie_policy_desc",
    effectiveDate: LEGAL_EFFECTIVE_DATE,
    owner: LEGAL_OWNER,
    ownerShort: LEGAL_OWNER_SHORT,
  },
  {
    id: "acceptable_use_policy",
    slug: "acceptable-use-policy",
    titleKey: "legal.acceptable_use_policy",
    subtitleKey: "legal.acceptable_use_policy_desc",
    effectiveDate: LEGAL_EFFECTIVE_DATE,
    owner: LEGAL_OWNER,
    ownerShort: LEGAL_OWNER_SHORT,
  },
];

export function getLegalDocBySlug(slug: string): LegalDocument | undefined {
  return LEGAL_DOCUMENTS.find(d => d.slug === slug);
}
