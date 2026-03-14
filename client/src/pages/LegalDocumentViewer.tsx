import { useMemo } from "react";
import { motion } from "framer-motion";
import { useLocation, useParams } from "wouter";
import { ArrowLeft, Calendar, Building2, Mail } from "lucide-react";
import { getLegalDocBySlug, LEGAL_CONTACT_PRIVACY, LEGAL_CONTACT_LEGAL } from "@/legal/config";
import { getLegalContent } from "@/legal/content";
import { useLanguage } from "@/i18n/LanguageProvider";

function renderMarkdown(md: string): string {
  let html = md
    .replace(/^### (.+)$/gm, '<h3 class="legal-h3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="legal-h2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="legal-h1">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^\| (.+) \|$/gm, (match) => {
      const cells = match.replace(/^\| | \|$/g, "").split(" | ");
      return `<tr>${cells.map(c => `<td class="legal-td">${c}</td>`).join("")}</tr>`;
    })
    .replace(/^\|[-| ]+\|$/gm, "")
    .replace(/^- (.+)$/gm, '<li class="legal-li">$1</li>');

  html = html.replace(/((?:<li[^>]*>.*<\/li>\n?)+)/g, '<ul class="legal-ul">$1</ul>');
  html = html.replace(/((?:<tr>.*<\/tr>\n?)+)/g, '<table class="legal-table"><tbody>$1</tbody></table>');

  const lines = html.split("\n");
  const result: string[] = [];
  let inParagraph = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (inParagraph) {
        result.push("</p>");
        inParagraph = false;
      }
      continue;
    }
    if (trimmed.startsWith("<h") || trimmed.startsWith("<ul") || trimmed.startsWith("<table") || trimmed.startsWith("<li") || trimmed.startsWith("<tr")) {
      if (inParagraph) {
        result.push("</p>");
        inParagraph = false;
      }
      result.push(trimmed);
      continue;
    }
    if (!inParagraph) {
      result.push('<p class="legal-p">');
      inParagraph = true;
    }
    result.push(trimmed);
  }
  if (inParagraph) result.push("</p>");

  return result.join("\n");
}

export default function LegalDocumentViewer() {
  const [, navigate] = useLocation();
  const params = useParams<{ slug: string }>();
  const slug = params?.slug || "";
  const doc = getLegalDocBySlug(slug);
  const { locale, t } = useLanguage();

  const content = useMemo(() => {
    if (!doc) return "";
    const raw = getLegalContent(doc.id, locale);
    const lines = raw.split("\n");
    const withoutTitle = lines[0]?.startsWith("# ") ? lines.slice(1).join("\n") : raw;
    return renderMarkdown(withoutTitle);
  }, [doc, locale]);

  if (!doc) {
    return (
      <div className="w-full h-[100dvh] bg-[#FCFCFC] dark:bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-bold text-foreground mb-2">Document not found</p>
          <button
            onClick={() => navigate("/legal")}
            className="text-sm text-[#FFCC02] font-semibold"
          >
            Back to Legal Center
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[100dvh] bg-[#FCFCFC] dark:bg-background" data-testid="legal-document-page">
      <div className="flex-shrink-0 bg-white/80 dark:bg-card/80 backdrop-blur-md border-b border-gray-100/60 dark:border-border/60 sticky top-0 z-40">
        <div className="flex items-center gap-3 px-5 pt-12 pb-3">
          <button
            onClick={() => navigate("/legal")}
            className="w-9 h-9 rounded-full bg-gray-50 dark:bg-muted hover:bg-gray-100 flex items-center justify-center active:scale-90 transition-all duration-200 flex-shrink-0"
            data-testid="button-doc-back"
          >
            <ArrowLeft className="w-4.5 h-4.5 text-foreground" />
          </button>
          <h1 className="text-[16px] font-bold tracking-tight text-foreground truncate">{t(doc.titleKey)}</h1>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="px-5 pt-6 pb-32"
      >
        <div
          className="bg-white dark:bg-card rounded-2xl border border-gray-100 dark:border-border p-5 mb-6"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
        >
          <h2 className="text-[20px] font-bold text-foreground tracking-tight leading-tight mb-4" data-testid="text-doc-title">
            {t(doc.titleKey)}
          </h2>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2.5 text-[12px] text-muted-foreground">
              <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{t("legal.effective_date_label")}: {doc.effectiveDate}</span>
            </div>
            <div className="flex items-center gap-2.5 text-[12px] text-muted-foreground">
              <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{doc.owner}</span>
            </div>
          </div>
        </div>

        <div
          className="legal-content"
          dangerouslySetInnerHTML={{ __html: content }}
          data-testid="legal-content-body"
        />

        <div
          className="mt-10 bg-white dark:bg-card rounded-2xl border border-gray-100 dark:border-border p-5"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
        >
          <p className="text-[13px] font-bold text-foreground mb-3">{t("legal.contact_heading")}</p>
          <div className="flex flex-col gap-2.5">
            <a
              href={`mailto:${LEGAL_CONTACT_PRIVACY}`}
              className="flex items-center gap-2.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
            >
              <Mail className="w-3.5 h-3.5 flex-shrink-0" />
              {LEGAL_CONTACT_PRIVACY}
            </a>
            <a
              href={`mailto:${LEGAL_CONTACT_LEGAL}`}
              className="flex items-center gap-2.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
            >
              <Mail className="w-3.5 h-3.5 flex-shrink-0" />
              {LEGAL_CONTACT_LEGAL}
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
