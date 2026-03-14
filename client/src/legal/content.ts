import privacyPolicy from "./en/privacy_policy.md?raw";
import termsOfService from "./en/terms_of_service.md?raw";
import restaurantPartnerTerms from "./en/restaurant_partner_terms.md?raw";
import aiTransparencyPolicy from "./en/ai_transparency_policy.md?raw";
import platformLiability from "./en/platform_liability_food_safety.md?raw";
import cookiePolicy from "./en/cookie_policy.md?raw";
import acceptableUsePolicy from "./en/acceptable_use_policy.md?raw";

const contentMap: Record<string, Record<string, string>> = {
  en: {
    privacy_policy: privacyPolicy,
    terms_of_service: termsOfService,
    restaurant_partner_terms: restaurantPartnerTerms,
    ai_transparency_policy: aiTransparencyPolicy,
    platform_liability_food_safety: platformLiability,
    cookie_policy: cookiePolicy,
    acceptable_use_policy: acceptableUsePolicy,
  },
};

export function getLegalContent(docId: string, locale: string = "en"): string {
  const localeContent = contentMap[locale] || contentMap["en"];
  return localeContent[docId] || contentMap["en"][docId] || "";
}
