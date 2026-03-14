import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { ArrowLeft, ChevronRight, Shield } from "lucide-react";
import { LEGAL_DOCUMENTS, LEGAL_EFFECTIVE_DATE } from "@/legal/config";
import { useLanguage } from "@/i18n/LanguageProvider";

export default function LegalCenter() {
  const [, navigate] = useLocation();
  const { t } = useLanguage();

  return (
    <div className="w-full min-h-[100dvh] bg-[#FCFCFC] dark:bg-background" data-testid="legal-center-page">
      <div className="flex-shrink-0 bg-white/80 dark:bg-card/80 backdrop-blur-md border-b border-gray-100/60 dark:border-border/60 sticky top-0 z-40">
        <div className="flex items-center gap-3 px-5 pt-12 pb-3">
          <button
            onClick={() => navigate("/profile")}
            className="w-9 h-9 rounded-full bg-gray-50 dark:bg-muted hover:bg-gray-100 flex items-center justify-center active:scale-90 transition-all duration-200 flex-shrink-0"
            data-testid="button-legal-back"
          >
            <ArrowLeft className="w-4.5 h-4.5 text-foreground" />
          </button>
          <h1 className="text-[18px] font-bold tracking-tight text-foreground">{t("legal.title")}</h1>
        </div>
      </div>

      <div className="px-5 pt-6 pb-32">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #FFCC02 0%, hsl(40,90%,55%) 100%)" }}
          >
            <Shield className="w-5 h-5 text-[#2d2000]" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-foreground">{t("legal.title")}</h2>
            <p className="text-[12px] text-muted-foreground leading-snug mt-0.5">{t("legal.subtitle")}</p>
          </div>
        </div>

        <div className="mt-5">
          <div
            className="bg-white dark:bg-card rounded-2xl overflow-hidden border border-gray-100 dark:border-border"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
          >
            {LEGAL_DOCUMENTS.map((doc, idx) => (
              <div key={doc.id}>
                {idx > 0 && <div className="mx-5 h-px bg-gray-100 dark:bg-border" />}
                <motion.button
                  whileTap={{ scale: 0.99 }}
                  onClick={() => navigate(`/legal/${doc.slug}`)}
                  className="w-full px-5 py-4 flex items-center gap-4 active:bg-gray-50/50 dark:active:bg-muted/50 transition-colors text-left"
                  data-testid={`button-legal-${doc.id}`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[14px] text-foreground leading-snug">{t(doc.titleKey)}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{t(doc.subtitleKey)}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
                </motion.button>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-[11px] text-muted-foreground/50 mt-6">
          {t("legal.effective_date_label")}: {LEGAL_EFFECTIVE_DATE}
        </p>
      </div>
    </div>
  );
}
