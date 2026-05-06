import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, ChevronDown, Loader2, Mail, Paperclip, X, Home, Sparkles, Heart, MessageCircle, Quote, User, AtSign, Phone, Camera, Building2, Tag, Compass, MapPin, Globe, Instagram, Map, Calendar, Briefcase, Send, Lightbulb } from "lucide-react";
import { Mascot, MascotPair, mascotForCategory, type MascotName } from "@/components/Mascot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

type Category = "user_feedback" | "restaurant_partner" | "event_activity_partner" | "general_partner";
type View = "landing" | "form" | "success";

interface FileAttachment {
  fileName: string;
  fileType: string;
  fileSize: number;
  fileDataUrl: string;
}

interface SignedInUser {
  displayName: string;
  lineUserId: string;
  pictureUrl?: string;
}

function getSignedInUser(): SignedInUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("toast_line_profile");
    if (!raw) return null;
    const p = JSON.parse(raw);
    if (!p?.userId || !p?.displayName) return null;
    return { displayName: p.displayName, lineUserId: p.userId, pictureUrl: p.pictureUrl };
  } catch { return null; }
}

function SignedInBanner({ user }: { user: SignedInUser }) {
  return (
    <div className="mb-4 flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-[#FFCC02]/12 border border-[#FFCC02]/30" data-testid="banner-signed-in">
      {user.pictureUrl
        ? <img src={user.pictureUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
        : <div className="w-8 h-8 rounded-full bg-[#FFCC02] flex items-center justify-center text-[13px] font-bold text-[#1a1a1a]">{user.displayName.charAt(0).toUpperCase()}</div>}
      <div className="flex-1 min-w-0">
        <div className="text-[12px] text-muted-foreground leading-tight">Signed in as</div>
        <div className="text-[13px] font-bold text-foreground truncate">{user.displayName}</div>
      </div>
      <div className="text-[11px] font-semibold text-[#1a1a1a] bg-white/70 px-2 py-1 rounded-full">Auto-filled</div>
    </div>
  );
}

const TYPE_CARDS: Array<{
  key: Category;
  title: string;
  description: string;
  mascot: MascotName;
  accent: string;
}> = [
  {
    key: "user_feedback",
    title: "Everyday User",
    description: "Feedback, bugs, ideas, or places you want Toast to know about.",
    mascot: "toast",
    accent: "#FFCC02",
  },
  {
    key: "restaurant_partner",
    title: "Restaurant / Mall / Food Partner",
    description: "List your restaurant, promote your menu, or partner with Toast for food discovery.",
    mascot: "waffle",
    accent: "#F8B500",
  },
  {
    key: "event_activity_partner",
    title: "Events / Activities / Experiences",
    description: "Bring your events, venues, workshops, and activities into Toast's discovery flow.",
    mascot: "popcorn",
    accent: "#E63946",
  },
  {
    key: "general_partner",
    title: "Other Partnerships",
    description: "Brands, apps, creators, sponsors, agencies, and collaboration ideas.",
    mascot: "ticket",
    accent: "#C8A878",
  },
];

const INTRO_COPY: Record<Category, string> = {
  user_feedback: "Help us make Toast less 'where should we eat?' and more 'done, let's go.'",
  restaurant_partner: "Want to show up when hungry groups are deciding? You're in the right place.",
  event_activity_partner: "Toast isn't just about food — it's about what happens after.",
  general_partner: "Got something that makes Toast better, smarter, or more fun? Let's hear it.",
};

const SUCCESS_COPY: Record<Category, string> = {
  user_feedback: "Thanks for helping us make Toast better. Your feedback goes straight into our improvement board.",
  restaurant_partner: "Thanks for reaching out. Our partnerships team will review your business and contact you if there's a fit.",
  event_activity_partner: "Your event/activity info has been received. We'll review how it can fit into Toast's discovery experience.",
  general_partner: "Thanks for the idea. We'll review the opportunity and follow up if it makes sense.",
};

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf",
  "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onerror = () => reject(r.error);
    r.onload = () => resolve(r.result as string);
    r.readAsDataURL(file);
  });
}

function FileUploader({ files, onChange, max = 5 }: { files: FileAttachment[]; onChange: (f: FileAttachment[]) => void; max?: number }) {
  const { toast } = useToast();
  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    e.target.value = "";
    const next = [...files];
    for (const f of selected) {
      if (next.length >= max) { toast({ title: `Max ${max} files`, variant: "destructive" }); break; }
      if (!ALLOWED_TYPES.includes(f.type)) { toast({ title: `${f.name}: file type not allowed`, variant: "destructive" }); continue; }
      if (f.size > MAX_FILE_SIZE) { toast({ title: `${f.name}: max 5MB`, variant: "destructive" }); continue; }
      try {
        const url = await readFileAsDataUrl(f);
        next.push({ fileName: f.name, fileType: f.type, fileSize: f.size, fileDataUrl: url });
      } catch {/* ignore */}
    }
    onChange(next);
  };
  return (
    <div className="space-y-2" data-testid="file-uploader">
      <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border-2 border-dashed border-gray-200 cursor-pointer hover:border-[#FFCC02] hover:bg-[#FFCC02]/5 transition">
        <Paperclip className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-700 font-medium">Attach files (images, PDF, slides) — up to {max}</span>
        <input type="file" multiple className="hidden" onChange={onPick}
          accept={ALLOWED_TYPES.join(",")} data-testid="input-file-upload" />
      </label>
      {files.length > 0 && (
        <ul className="space-y-1">
          {files.map((f, i) => (
            <li key={i} className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-gray-50 text-sm">
              <span className="truncate" title={f.fileName}>{f.fileName}</span>
              <button type="button" onClick={() => onChange(files.filter((_, j) => j !== i))}
                className="text-gray-400 hover:text-red-500" data-testid={`button-remove-file-${i}`}>
                <X className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function RatingScale({ value, onChange, max = 10, testid, lowLabel = "Not great", highLabel = "Loved it" }: { value: number | null; onChange: (n: number) => void; max?: number; testid: string; lowLabel?: string; highLabel?: string }) {
  return (
    <div className="space-y-2" data-testid={testid}>
      <div role="radiogroup" aria-label={`${lowLabel} to ${highLabel}`} className="grid grid-cols-10 gap-1.5">
        {Array.from({ length: max }, (_, i) => i + 1).map(n => (
          <button key={n} type="button" role="radio" aria-checked={value === n} aria-label={`${n} of ${max}`} onClick={() => onChange(n)}
            className={`h-10 rounded-xl text-[13px] font-bold transition-all ${
              value === n
                ? "bg-[#FFCC02] text-[#1a1a1a] shadow-[0_4px_12px_-2px_rgba(255,204,2,0.4)] scale-105"
                : value !== null && n <= (value || 0)
                  ? "bg-[#FFCC02]/30 text-gray-700"
                  : "bg-gray-50 text-gray-400 hover:bg-gray-100"
            }`}
            data-testid={`${testid}-${n}`}>
            {n}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wide text-gray-400 px-0.5">
        <span>😕 {lowLabel}</span>
        <span>{highLabel} 🤩</span>
      </div>
    </div>
  );
}

function YesNoMaybe({ value, onChange, options = ["yes","no","maybe"], testid }: { value: string; onChange: (v: string) => void; options?: string[]; testid: string }) {
  const ICONS: Record<string, string> = { yes: "👍", no: "👎", maybe: "🤔", somewhat: "😐" };
  return (
    <div role="radiogroup" className="grid grid-cols-3 gap-2" data-testid={testid}>
      {options.map(o => (
        <button key={o} type="button" role="radio" aria-checked={value === o} onClick={() => onChange(o)}
          className={`flex items-center justify-center gap-1.5 py-3 rounded-xl text-sm font-semibold capitalize transition-all ${
            value === o
              ? "bg-foreground text-white shadow-sm"
              : "bg-gray-50 text-gray-600 hover:bg-gray-100"
          }`}
          data-testid={`${testid}-${o}`}>
          <span className="text-base" aria-hidden="true">{ICONS[o] || "•"}</span>
          {o.replace("_", " ")}
        </button>
      ))}
    </div>
  );
}

function ProgressBar({ step, total, labels }: { step: number; total: number; labels?: string[] }) {
  const pct = ((step + 1) / total) * 100;
  return (
    <div className="space-y-1.5" data-testid="progress-bar">
      <div className="flex items-center justify-between text-[11px] font-semibold">
        <span className="text-foreground">{labels?.[step] || `Step ${step + 1}`}</span>
        <span className="text-muted-foreground">{step + 1} / {total}</span>
      </div>
      <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <motion.div
          className="h-full bg-[#FFCC02] rounded-full"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 220, damping: 28 }}
        />
      </div>
    </div>
  );
}

function FormStepCard({ icon, title, helper, children, accent = "#FFCC02" }: { icon: React.ReactNode; title: string; helper?: string; children: React.ReactNode; accent?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 280, damping: 26 }}
      className="rounded-[20px] bg-white border border-gray-100/80 shadow-[0_6px_20px_-4px_rgba(0,0,0,0.06),0_2px_6px_-2px_rgba(0,0,0,0.03)] overflow-hidden"
    >
      <div className="px-4 pt-4 pb-3 flex items-start gap-3 border-b border-gray-100/80">
        <div className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${accent}1F`, color: "#1a1a1a" }}>
          {icon}
        </div>
        <div className="flex-1 min-w-0 pt-0.5">
          <h3 className="text-[15px] font-bold tracking-tight text-foreground leading-tight">{title}</h3>
          {helper && <p className="text-[12px] text-muted-foreground leading-snug mt-0.5">{helper}</p>}
        </div>
      </div>
      <div className="p-4 space-y-5">{children}</div>
    </motion.div>
  );
}

function Question({ icon, label, helper, children }: { icon?: React.ReactNode; label: string; helper?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-start gap-2">
        {icon && <div className="shrink-0 mt-0.5 text-muted-foreground/70">{icon}</div>}
        <div className="flex-1 min-w-0">
          <Label className="text-[14px] font-semibold text-foreground leading-snug">{label}</Label>
          {helper && <p className="text-[12px] text-muted-foreground leading-snug mt-0.5">{helper}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

function StyledTextarea(props: React.ComponentProps<typeof Textarea>) {
  return (
    <Textarea
      {...props}
      className={`rounded-2xl bg-[hsl(var(--warm-100))]/50 border-gray-200/70 focus-visible:border-[#FFCC02] focus-visible:ring-[#FFCC02]/20 text-[14px] placeholder:text-gray-400 ${props.className || ""}`}
    />
  );
}

function StyledInput(props: React.ComponentProps<typeof Input> & { adornment?: React.ReactNode }) {
  const { adornment, className, ...rest } = props;
  if (!adornment) return <Input {...rest} className={`rounded-2xl bg-[hsl(var(--warm-100))]/50 border-gray-200/70 h-11 focus-visible:border-[#FFCC02] focus-visible:ring-[#FFCC02]/20 ${className || ""}`} />;
  return (
    <div className="relative">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">{adornment}</div>
      <Input {...rest} className={`rounded-2xl bg-[hsl(var(--warm-100))]/50 border-gray-200/70 h-11 pl-10 focus-visible:border-[#FFCC02] focus-visible:ring-[#FFCC02]/20 ${className || ""}`} />
    </div>
  );
}

function ChipGroup({ value, onChange, options, testid, columns = "auto" }: { value: string; onChange: (v: string) => void; options: string[]; testid: string; columns?: "auto" | 2 }) {
  return (
    <div role="radiogroup" className={columns === 2 ? "grid grid-cols-2 gap-2" : "flex flex-wrap gap-2"} data-testid={testid}>
      {options.map(o => {
        const active = value === o;
        return (
          <button key={o} type="button" role="radio" aria-checked={active} onClick={() => onChange(o)}
            className={`px-3.5 py-2.5 rounded-full text-[13px] font-semibold transition-all border ${
              active
                ? "bg-[#FFCC02] text-[#1a1a1a] border-[#FFCC02] shadow-[0_2px_8px_-2px_rgba(255,204,2,0.4)]"
                : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}>
            {active && <Check className="inline w-3.5 h-3.5 mr-1 -mt-0.5" strokeWidth={3} aria-hidden="true" />}
            {o}
          </button>
        );
      })}
    </div>
  );
}

const DRAFT_KEY = "toast_contact_draft_v1";
function loadDraft(): any { try { return JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}"); } catch { return {}; } }
function saveDraft(data: any) { try { localStorage.setItem(DRAFT_KEY, JSON.stringify(data)); } catch {} }
function clearDraft() { try { localStorage.removeItem(DRAFT_KEY); } catch {} }

// ============================================================================
// USER FEEDBACK MULTI-STEP FORM
// ============================================================================
function UserFeedbackForm({ signedInUser, onCancel, onSubmitted }: { signedInUser: SignedInUser | null; onCancel: () => void; onSubmitted: (cat: Category) => void }) {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [files, setFiles] = useState<FileAttachment[]>([]);
  const [data, setData] = useState<any>(() => {
    const draft = loadDraft().userFeedback || {};
    return {
      overall_satisfaction_score: null, would_use_again: "", would_recommend_to_friends: "", ease_of_use_score: null,
      recommendation_relevance: "", helped_make_decision: "", helped_find_new_restaurants: "", decision_time: "",
      top_two_liked: "", top_two_to_improve: "", favorite_part: "", visual_feedback: "", suggestions: "",
      quote_permission: "", quote_1: "", quote_2: "", quote_3: "",
      name: signedInUser?.displayName || "",
      email: "",
      phone_or_line: "",
      consent: false,
      company_website: "", // honeypot
      ...draft,
    };
  });

  useEffect(() => { saveDraft({ ...loadDraft(), userFeedback: data }); }, [data]);

  const set = (k: string, v: any) => setData((d: any) => ({ ...d, [k]: v }));

  const wantsContact = !!((data.name || "").trim() || (data.email || "").trim() || (data.phone_or_line || "").trim());

  const stepValid = (() => {
    if (step === 0) return data.overall_satisfaction_score && data.would_recommend_to_friends;
    if (step === 1) return true;
    if (step === 2) return !wantsContact || data.consent;
    return false;
  })();

  const next = () => setStep(s => Math.min(s + 1, 2));
  const back = () => setStep(s => Math.max(s - 1, 0));

  const submit = async () => {
    if (!stepValid) return;
    setSubmitting(true);
    try {
      const phone_or_line = (data.phone_or_line || "").trim();
      const looksLikeLine = /^@/.test(phone_or_line) || /line/i.test(phone_or_line);
      const payload = {
        submissionType: "user_feedback",
        name: data.name?.trim() || null,
        email: data.email?.trim() || null,
        phone: looksLikeLine ? null : phone_or_line || null,
        lineId: signedInUser?.lineUserId || (looksLikeLine ? phone_or_line : null),
        message: [data.top_two_liked && `Liked: ${data.top_two_liked}`, data.top_two_to_improve && `Improve: ${data.top_two_to_improve}`,
                  data.favorite_part && `Favorite: ${data.favorite_part}`, data.suggestions && `Suggestions: ${data.suggestions}`]
                  .filter(Boolean).join("\n\n"),
        metadata: {
          overall_satisfaction_score: Number(data.overall_satisfaction_score),
          would_use_again: data.would_use_again, would_recommend_to_friends: data.would_recommend_to_friends,
          ease_of_use_score: Number(data.ease_of_use_score), recommendation_relevance: data.recommendation_relevance,
          helped_make_decision: data.helped_make_decision, helped_find_new_restaurants: data.helped_find_new_restaurants,
          decision_time: data.decision_time, top_two_liked: data.top_two_liked, top_two_to_improve: data.top_two_to_improve,
          favorite_part: data.favorite_part, visual_feedback: data.visual_feedback, suggestions: data.suggestions,
          quote_permission: data.quote_permission, quote_1: data.quote_1, quote_2: data.quote_2, quote_3: data.quote_3,
          ...(signedInUser ? { signed_in: true, line_user_id: signedInUser.lineUserId, line_display_name: signedInUser.displayName } : {}),
        },
        files,
        company_website: data.company_website,
      };
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error((await res.json()).message || "Failed");
      clearDraft();
      onSubmitted("user_feedback");
    } catch (e: any) {
      toast({ title: "Submit failed", description: e.message || "Please try again.", variant: "destructive" });
    } finally { setSubmitting(false); }
  };

  const STEP_LABELS = ["Quick rating", "Help us improve", "Stay in touch (optional)"];

  return (
    <div className="flex flex-col h-full" data-testid="form-user-feedback">
      {/* Compact header */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <button onClick={step === 0 ? onCancel : back} className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-500 hover:text-gray-900 transition" data-testid="button-form-back">
            <ArrowLeft className="w-4 h-4" /> {step === 0 ? "Choose another" : "Back"}
          </button>
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#FFCC02]/15">
            <Mascot name="toast" size="sm" className="!w-5 !h-5" />
            <span className="text-[11px] font-bold uppercase tracking-wide text-gray-900">Everyday User</span>
          </div>
        </div>
        <ProgressBar step={step} total={3} labels={STEP_LABELS} />
      </div>

      {signedInUser && <div className="mb-4"><SignedInBanner user={signedInUser} /></div>}

      <div className="flex-1 overflow-y-auto pb-32">
        <AnimatePresence mode="wait">
          <motion.div key={step} className="space-y-4">
            {step === 0 && (
              <>
                <FormStepCard icon={<Heart className="w-5 h-5" />} title="How do you feel about Toast?" helper="Pick a number that matches your gut.">
                  <Question label="Overall, how would you rate Toast?">
                    <RatingScale value={data.overall_satisfaction_score} onChange={n => set("overall_satisfaction_score", n)} testid="rating-overall" />
                  </Question>
                </FormStepCard>
                <FormStepCard icon={<MessageCircle className="w-5 h-5" />} title="Would you stick with us?" helper="The honest answer is the helpful one.">
                  <Question label="Would you recommend Toast to a friend?">
                    <YesNoMaybe value={data.would_recommend_to_friends} onChange={v => set("would_recommend_to_friends", v)} testid="ynm-recommend" />
                  </Question>
                  <div className="h-px bg-gray-100" />
                  <Question label="Would you use Toast again yourself?" helper="Optional">
                    <YesNoMaybe value={data.would_use_again} onChange={v => set("would_use_again", v)} testid="ynm-would-use-again" />
                  </Question>
                </FormStepCard>
              </>
            )}

            {step === 1 && (
              <>
                <FormStepCard icon={<Compass className="w-5 h-5" />} title="What happened when you used Toast?" helper="All optional — these tell us if Toast actually worked.">
                  <Question label="Did Toast help you decide?">
                    <YesNoMaybe value={data.helped_make_decision} onChange={v => set("helped_make_decision", v)} testid="ynm-decided" />
                  </Question>
                  <div className="h-px bg-gray-100" />
                  <Question label="Did Toast help you find new restaurants?">
                    <YesNoMaybe value={data.helped_find_new_restaurants} onChange={v => set("helped_find_new_restaurants", v)} testid="ynm-new-restaurants" />
                  </Question>
                  <div className="h-px bg-gray-100" />
                  <Question icon={<Calendar className="w-4 h-4" />} label="How fast did you decide?" helper="From open to 'okay let's go'.">
                    <div role="radiogroup" className="grid grid-cols-2 gap-2" data-testid="select-decision-time">
                      {["Under 1 minute","1–3 minutes","3–5 minutes","5–10 minutes","More than 10 minutes","Still couldn't decide"].map(o => {
                        const active = data.decision_time === o;
                        return (
                          <button key={o} type="button" role="radio" aria-checked={active} onClick={() => set("decision_time", o)}
                            className={`px-3 py-3 rounded-xl text-[13px] font-semibold transition border ${active ? "bg-[#FFCC02] text-gray-900 border-[#FFCC02] shadow-[0_2px_8px_-2px_rgba(255,204,2,0.4)]" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"}`}
                            data-testid={`option-decision-time-${o}`}>
                            {o}
                          </button>
                        );
                      })}
                    </div>
                  </Question>
                </FormStepCard>
                <FormStepCard icon={<Lightbulb className="w-5 h-5" />} title="In your own words" helper="The single most useful section. Even one line helps.">
                  <Question icon={<span className="text-base" aria-hidden="true">🛠️</span>} label="What should Toast improve?">
                    <StyledTextarea rows={4} placeholder="What slowed you down, felt confusing, or could be better?" value={data.top_two_to_improve} onChange={e => set("top_two_to_improve", e.target.value)} data-testid="textarea-top-improve" />
                  </Question>
                  <Question icon={<span className="text-base" aria-hidden="true">✨</span>} label="What worked well?" helper="Optional">
                    <StyledTextarea rows={3} placeholder="Anything you liked or want us to keep doing." value={data.top_two_liked} onChange={e => set("top_two_liked", e.target.value)} data-testid="textarea-top-liked" />
                  </Question>
                  <Question icon={<span className="text-base" aria-hidden="true">💡</span>} label="Any ideas or suggestions?" helper="Optional">
                    <StyledTextarea rows={2} placeholder="Big or small — we read everything." value={data.suggestions} onChange={e => set("suggestions", e.target.value)} data-testid="textarea-suggestions" />
                  </Question>
                </FormStepCard>
              </>
            )}

            {step === 2 && (
              <>
                <FormStepCard icon={<User className="w-5 h-5" />} title="Want a follow-up?" helper="Totally optional. Leave blank to submit anonymously.">
                  <Question icon={<User className="w-4 h-4" />} label="Your name" helper="Optional">
                    <StyledInput value={data.name} onChange={e => set("name", e.target.value)} adornment={<User className="w-4 h-4" />} data-testid="input-name" />
                  </Question>
                  <Question icon={<AtSign className="w-4 h-4" />} label="Email or LINE" helper="Optional — only if you'd like a reply.">
                    <StyledInput placeholder="you@email.com or @yourline" value={data.email || data.phone_or_line} onChange={e => {
                      const v = e.target.value;
                      const looksLikeLine = /^@/.test(v) || /line/i.test(v);
                      if (looksLikeLine) { set("phone_or_line", v); set("email", ""); }
                      else { set("email", v); set("phone_or_line", ""); }
                    }} adornment={<AtSign className="w-4 h-4" />} data-testid="input-email" />
                  </Question>
                </FormStepCard>
                <FormStepCard icon={<Camera className="w-5 h-5" />} title="Want to attach something?" helper="Optional — screenshots help a lot for bugs.">
                  <FileUploader files={files} onChange={setFiles} />
                </FormStepCard>
                {wantsContact && (
                  <label className="flex items-start gap-2.5 text-[13px] text-gray-700 px-1">
                    <input type="checkbox" checked={data.consent} onChange={e => set("consent", e.target.checked)} className="mt-0.5 w-4 h-4 accent-[#FFCC02]" data-testid="checkbox-consent" />
                    <span>I'm okay with Toast contacting me about this.</span>
                  </label>
                )}
                {/* Honeypot */}
                <input tabIndex={-1} autoComplete="off" type="text" name="company_website" value={data.company_website} onChange={e => set("company_website", e.target.value)} style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }} aria-hidden="true" />
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="fixed bottom-0 inset-x-0 px-4 py-3 bg-white/95 backdrop-blur border-t border-gray-100 max-w-[480px] mx-auto">
        <Button onClick={step === 2 ? submit : next} disabled={!stepValid || submitting}
          className="w-full h-12 rounded-2xl bg-[#FFCC02] hover:bg-[#FFD633] text-gray-900 font-semibold disabled:opacity-50 shadow-[0_4px_14px_-4px_rgba(255,204,2,0.5)]"
          data-testid="button-form-next">
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : step === 2 ? <><Send className="w-4 h-4 mr-1.5" /> Submit feedback</> : <>Continue <ArrowRight className="w-4 h-4 ml-1" /></>}
        </Button>
      </div>
    </div>
  );
}

// ============================================================================
// CONCISE PARTNER FORM (used for the 3 partner categories)
// ============================================================================
function PartnerForm({ signedInUser, category, onCancel, onSubmitted }: { signedInUser: SignedInUser | null; category: Exclude<Category, "user_feedback">; onCancel: () => void; onSubmitted: (cat: Category) => void }) {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [showOptional, setShowOptional] = useState(false);
  const [files, setFiles] = useState<FileAttachment[]>([]);
  const [data, setData] = useState<any>(() => {
    const draft = loadDraft()[category] || {};
    return {
      name: signedInUser?.displayName || "",
      email_or_line: "",
      role_title: "",
      business_name: "", business_type: "", interest_type: "",
      location: "", number_of_branches: "", website_url: "", instagram_url: "", google_maps_url: "", short_message: "",
      organization_event_or_venue_name: "", experience_type: "", frequency: "", ticketing_link: "",
      company_brand_or_app: "", partnership_type: "", short_pitch: "", website_or_social_link: "", budget_range: "", preferred_contact_method: "",
      company_website: "", // honeypot
      ...draft,
    };
  });

  useEffect(() => { saveDraft({ ...loadDraft(), [category]: data }); }, [data, category]);
  const set = (k: string, v: any) => setData((d: any) => ({ ...d, [k]: v }));

  const valid = (() => {
    if (!data.name?.trim() || !data.email_or_line?.trim()) return false;
    if (category === "restaurant_partner") return data.business_name?.trim() && data.business_type && data.interest_type;
    if (category === "event_activity_partner") return data.organization_event_or_venue_name?.trim() && data.experience_type && data.location?.trim() && data.interest_type;
    if (category === "general_partner") return data.company_brand_or_app?.trim() && data.partnership_type && data.short_pitch?.trim();
    return false;
  })();

  const submit = async () => {
    if (!valid) return;
    setSubmitting(true);
    try {
      const eol = (data.email_or_line || "").trim();
      const isEmail = /@/.test(eol) && !eol.startsWith("@");
      const payload: any = {
        submissionType: category,
        name: data.name.trim(),
        email: isEmail ? eol : null,
        lineId: !isEmail ? eol : null,
        roleTitle: data.role_title || null,
        location: data.location || null,
        websiteUrl: data.website_url || data.website_or_social_link || null,
        instagramUrl: data.instagram_url || null,
        googleMapsUrl: data.google_maps_url || null,
        preferredContactMethod: data.preferred_contact_method || null,
        files,
        company_website: data.company_website,
        metadata: {} as any,
      };
      if (category === "restaurant_partner") {
        payload.companyName = data.business_name;
        payload.businessType = data.business_type;
        payload.interestType = [data.interest_type];
        payload.message = data.short_message || null;
        payload.metadata = { business_type: data.business_type, interest_type: data.interest_type, number_of_branches: data.number_of_branches || null };
      } else if (category === "event_activity_partner") {
        payload.companyName = data.organization_event_or_venue_name;
        payload.businessType = data.experience_type;
        payload.interestType = [data.interest_type];
        payload.message = data.short_message || null;
        payload.metadata = { experience_type: data.experience_type, interest_type: data.interest_type, frequency: data.frequency || null, ticketing_link: data.ticketing_link || null };
      } else {
        payload.companyName = data.company_brand_or_app;
        payload.message = data.short_pitch;
        payload.interestType = [data.partnership_type];
        payload.metadata = { partnership_type: data.partnership_type, budget_range: data.budget_range || null };
      }
      if (signedInUser) {
        payload.metadata = {
          ...payload.metadata,
          signed_in: true,
          line_user_id: signedInUser.lineUserId,
          line_display_name: signedInUser.displayName,
        };
      }
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error((await res.json()).message || "Failed");
      clearDraft();
      onSubmitted(category);
    } catch (e: any) {
      toast({ title: "Submit failed", description: e.message || "Please try again.", variant: "destructive" });
    } finally { setSubmitting(false); }
  };

  const mascotName: MascotName = mascotForCategory(category);
  const titleByCat: Record<Category, string> = {
    user_feedback: "Everyday User Feedback",
    restaurant_partner: "Restaurant / Food Partner",
    event_activity_partner: "Events / Activities / Experiences",
    general_partner: "Other Partnerships",
  };

  const accentByCat: Record<Category, string> = {
    user_feedback: "#FFCC02",
    restaurant_partner: "#F8B500",
    event_activity_partner: "#E63946",
    general_partner: "#C8A878",
  };
  const accent = accentByCat[category];

  const sectionMeta: Record<Category, { icon: React.ReactNode; title: string; helper: string; chipLabel: string }> = {
    user_feedback: { icon: <Heart className="w-5 h-5" />, title: "About you", helper: "", chipLabel: "User" },
    restaurant_partner: { icon: <Building2 className="w-5 h-5" />, title: "About your business", helper: "Tell us what you run.", chipLabel: "Restaurant" },
    event_activity_partner: { icon: <Calendar className="w-5 h-5" />, title: "About your event or venue", helper: "Tell us what's happening.", chipLabel: "Events" },
    general_partner: { icon: <Briefcase className="w-5 h-5" />, title: "About the partnership", helper: "Pitch us in a few lines.", chipLabel: "Partnership" },
  };
  const meta = sectionMeta[category];

  return (
    <div className="flex flex-col h-full" data-testid={`form-${category}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={onCancel} className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-500 hover:text-gray-900 transition" data-testid="button-form-back">
          <ArrowLeft className="w-4 h-4" /> Choose another
        </button>
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full" style={{ backgroundColor: `${accent}1F` }}>
          <Mascot name={mascotName} size="sm" className="!w-5 !h-5" />
          <span className="text-[11px] font-bold uppercase tracking-wide text-gray-900">{meta.chipLabel}</span>
        </div>
      </div>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[20px] border border-gray-100/80 mb-4 px-4 py-4 flex items-center gap-3"
        style={{ background: `linear-gradient(135deg, ${accent}14 0%, ${accent}06 100%)` }}
      >
        <Mascot name={mascotName} size="md" />
        <div className="flex-1 min-w-0">
          <h2 className="text-[18px] font-bold text-gray-900 leading-tight tracking-tight" data-testid="text-form-title">{titleByCat[category]}</h2>
          <p className="text-[12.5px] text-gray-600 leading-snug mt-0.5">{INTRO_COPY[category]}</p>
        </div>
      </motion.div>

      {signedInUser && <div className="mb-4"><SignedInBanner user={signedInUser} /></div>}

      <div className="flex-1 overflow-y-auto pb-32 space-y-4">
        {/* Section 1 — Identity */}
        <FormStepCard icon={<User className="w-5 h-5" />} title="How can we reach you?" accent={accent}>
          <Question icon={<User className="w-4 h-4" />} label="Your name" helper="Required">
            <StyledInput value={data.name} onChange={e => set("name", e.target.value)} adornment={<User className="w-4 h-4" />} data-testid="input-name" />
          </Question>
          <Question icon={<AtSign className="w-4 h-4" />} label="Email or LINE" helper="Required — whichever's easiest.">
            <StyledInput placeholder="you@company.com or @yourline" value={data.email_or_line} onChange={e => set("email_or_line", e.target.value)} adornment={<AtSign className="w-4 h-4" />} data-testid="input-email-or-line" />
          </Question>
          {category === "restaurant_partner" && (
            <Question icon={<Tag className="w-4 h-4" />} label="Role / title" helper="Optional">
              <StyledInput placeholder="e.g. Owner, Marketing Lead" value={data.role_title} onChange={e => set("role_title", e.target.value)} adornment={<Tag className="w-4 h-4" />} data-testid="input-role-title" />
            </Question>
          )}
        </FormStepCard>

        {/* Section 2 — Category-specific */}
        {category === "restaurant_partner" && (
          <FormStepCard icon={meta.icon} title={meta.title} helper={meta.helper} accent={accent}>
            <Question icon={<Building2 className="w-4 h-4" />} label="Business name" helper="Required">
              <StyledInput placeholder="The official name" value={data.business_name} onChange={e => set("business_name", e.target.value)} adornment={<Building2 className="w-4 h-4" />} data-testid="input-business-name" />
            </Question>
            <Question icon={<Tag className="w-4 h-4" />} label="Business type" helper="Pick one">
              <ChipGroup value={data.business_type} onChange={v => set("business_type", v)} options={["Restaurant","Cafe","Bar","Dessert shop","Food court","Mall","Cloud kitchen","Franchise","Other"]} testid="select-business-type" />
            </Question>
            <Question icon={<Sparkles className="w-4 h-4" />} label="What do you want to do with Toast?" helper="Pick one">
              <ChipGroup value={data.interest_type} onChange={v => set("interest_type", v)} options={["Get listed","Promote my restaurant/menu","Partner as a mall/food court","Reach group decision-makers","Learn about Toast advertising","Other"]} testid="select-interest" />
            </Question>
          </FormStepCard>
        )}

        {category === "event_activity_partner" && (
          <FormStepCard icon={meta.icon} title={meta.title} helper={meta.helper} accent={accent}>
            <Question icon={<Building2 className="w-4 h-4" />} label="Organization / event / venue name" helper="Required">
              <StyledInput placeholder="What should we call it?" value={data.organization_event_or_venue_name} onChange={e => set("organization_event_or_venue_name", e.target.value)} adornment={<Building2 className="w-4 h-4" />} data-testid="input-org-name" />
            </Question>
            <Question icon={<Tag className="w-4 h-4" />} label="Experience type" helper="Pick one">
              <ChipGroup value={data.experience_type} onChange={v => set("experience_type", v)} options={["Event organizer","Activity venue","Workshop","Fitness/wellness","Nightlife","Family activity","Date night activity","Travel/tour","Pop-up event","Other"]} testid="select-experience-type" />
            </Question>
            <Question icon={<MapPin className="w-4 h-4" />} label="Location" helper="Required">
              <StyledInput placeholder="e.g. Sukhumvit, Bangkok" value={data.location} onChange={e => set("location", e.target.value)} adornment={<MapPin className="w-4 h-4" />} data-testid="input-location" />
            </Question>
            <Question icon={<Sparkles className="w-4 h-4" />} label="What do you want to do with Toast?" helper="Pick one">
              <ChipGroup value={data.interest_type} onChange={v => set("interest_type", v)} options={["List my event/activity","Promote my event/activity","Sell tickets/bookings","Reach groups looking for things to do","Partner with Toast","Other"]} testid="select-interest" />
            </Question>
          </FormStepCard>
        )}

        {category === "general_partner" && (
          <FormStepCard icon={meta.icon} title={meta.title} helper={meta.helper} accent={accent}>
            <Question icon={<Building2 className="w-4 h-4" />} label="Company / brand / app" helper="Required">
              <StyledInput placeholder="Who's reaching out?" value={data.company_brand_or_app} onChange={e => set("company_brand_or_app", e.target.value)} adornment={<Building2 className="w-4 h-4" />} data-testid="input-company-brand" />
            </Question>
            <Question icon={<Tag className="w-4 h-4" />} label="Partnership type" helper="Pick one">
              <ChipGroup value={data.partnership_type} onChange={v => set("partnership_type", v)} options={["Brand collaboration","App integration","Sponsorship","Creator/media partnership","Investor/advisor inquiry","Data/API partnership","Other"]} testid="select-partnership-type" />
            </Question>
            <Question icon={<Lightbulb className="w-4 h-4" />} label="Short pitch" helper="A few lines on the idea — bullets are great.">
              <StyledTextarea rows={4} placeholder="What's the opportunity? Why Toast?" value={data.short_pitch} onChange={e => set("short_pitch", e.target.value)} data-testid="textarea-short-pitch" />
            </Question>
          </FormStepCard>
        )}

        {/* Comments + attachments — always visible for restaurant/event */}
        {(category === "restaurant_partner" || category === "event_activity_partner") && (
          <FormStepCard icon={<MessageCircle className="w-5 h-5" />} title="Anything else we should know?" helper="Optional — links, hours, schedule, photos, menu, etc." accent={accent}>
            <Question icon={<MessageCircle className="w-4 h-4" />} label="Comments">
              <StyledTextarea rows={5} placeholder={category === "restaurant_partner"
                ? "Tell us about your restaurant — branches, website, Instagram, Google Maps, anything you'd like us to see."
                : "Tell us about the event — dates, venue, ticketing link, website, socials, anything you'd like us to see."}
                value={data.short_message} onChange={e => set("short_message", e.target.value)} data-testid="textarea-short-message" />
            </Question>
            <Question icon={<Camera className="w-4 h-4" />} label="Attachments" helper="Menu, deck, photos — up to 5 files.">
              <FileUploader files={files} onChange={setFiles} />
            </Question>
          </FormStepCard>
        )}

        {/* Optional details — only for general_partner */}
        {category === "general_partner" && (
          <>
            <button type="button" onClick={() => setShowOptional(s => !s)} className="flex items-center justify-between w-full px-4 py-3.5 rounded-2xl bg-white border border-gray-100/80 hover:border-gray-200 hover:bg-gray-50/50 text-[13px] font-bold text-gray-800 transition shadow-[0_2px_6px_-2px_rgba(0,0,0,0.04)]" data-testid="button-toggle-optional">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" style={{ color: accent }} />
                {showOptional ? "Hide extra details" : "Add more details (optional)"}
              </span>
              <ChevronDown className={`w-4 h-4 transition ${showOptional ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {showOptional && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <FormStepCard icon={<Lightbulb className="w-5 h-5" />} title="More about you" helper="All optional — fill what matters." accent={accent}>
                    <Question icon={<Globe className="w-4 h-4" />} label="Website or social link"><StyledInput placeholder="https://" value={data.website_or_social_link} onChange={e => set("website_or_social_link", e.target.value)} adornment={<Globe className="w-4 h-4" />} data-testid="input-website-social" /></Question>
                    <Question icon={<Tag className="w-4 h-4" />} label="Budget range"><ChipGroup value={data.budget_range} onChange={v => set("budget_range", v)} options={["Not sure yet","Under ฿25,000","฿25,000–฿100,000","฿100,000–฿500,000","฿500,000+"]} testid="select-budget" /></Question>
                    <Question icon={<MessageCircle className="w-4 h-4" />} label="Preferred contact method"><StyledInput placeholder="Email, LINE, Slack…" value={data.preferred_contact_method} onChange={e => set("preferred_contact_method", e.target.value)} adornment={<MessageCircle className="w-4 h-4" />} data-testid="input-preferred-contact" /></Question>
                    <Question icon={<Camera className="w-4 h-4" />} label="Attachments" helper="Deck, photos — up to 5 files."><FileUploader files={files} onChange={setFiles} /></Question>
                  </FormStepCard>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        <input tabIndex={-1} autoComplete="off" type="text" name="company_website" value={data.company_website} onChange={e => set("company_website", e.target.value)} style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }} aria-hidden="true" />
      </div>

      <div className="fixed bottom-0 inset-x-0 px-4 py-3 bg-white/95 backdrop-blur border-t border-gray-100 max-w-[480px] mx-auto">
        <Button onClick={submit} disabled={!valid || submitting}
          className="w-full h-12 rounded-2xl bg-[#FFCC02] hover:bg-[#FFD633] text-gray-900 font-semibold disabled:opacity-50 shadow-[0_4px_14px_-4px_rgba(255,204,2,0.5)]"
          data-testid="button-submit">
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4 mr-1.5" /> Send to Toast</>}
        </Button>
      </div>
    </div>
  );
}

// ============================================================================
// LANDING + SUCCESS + WRAPPER
// ============================================================================
function Landing({ onPick }: { onPick: (c: Category) => void }) {
  const floatVariants = [
    { y: [0, -6, 0], rotate: [0, -3, 0] },
    { y: [0, -8, 0], rotate: [0, 3, 0] },
    { y: [0, -5, 0], rotate: [0, -2, 0] },
    { y: [0, -7, 0], rotate: [0, 2, 0] },
  ];
  const heroChars: MascotName[] = ["toast", "waffle", "popcorn", "ticket"];
  return (
    <div className="pt-2 pb-10 space-y-7" data-testid="contact-landing">
      {/* GREETING */}
      <div className="px-1">
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFCC02]/15 text-[11px] font-bold tracking-wide text-gray-900"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFCC02]" />
          CONTACT TOAST
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
          className="mt-2.5 text-[26px] sm:text-[28px] font-bold text-foreground leading-[1.15] tracking-tight"
          data-testid="text-hero-title"
        >
          Let's make better plans, together.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="mt-1.5 text-[15px] font-medium text-muted-foreground leading-snug"
        >
          Feedback, a restaurant, an event, or a partnership idea — tell us where you fit in and we'll route it to the right team.
        </motion.p>
      </div>

      {/* MASCOT STAGE */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        className="relative overflow-hidden rounded-[20px] bg-white border border-gray-100/80 px-4 pt-5 pb-4 shadow-[0_6px_20px_-4px_rgba(0,0,0,0.06),0_2px_6px_-2px_rgba(0,0,0,0.03)]"
      >
        {/* subtle stage line */}
        <div className="pointer-events-none absolute left-0 right-0 bottom-12 h-px bg-gradient-to-r from-transparent via-gray-200/60 to-transparent" />
        <div className="relative flex justify-center items-end gap-2 h-[140px]">
          {heroChars.map((name, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 18, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.22 + i * 0.07, type: "spring", stiffness: 240, damping: 16 }}
            >
              <motion.div
                animate={floatVariants[i]}
                transition={{ duration: 3.6 + i * 0.3, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                whileHover={{ scale: 1.1, transition: { type: "spring", stiffness: 320 } }}
                className="cursor-pointer"
              >
                <Mascot name={name} size="md" />
              </motion.div>
            </motion.div>
          ))}
        </div>
        {/* reply-time chip */}
        <div className="relative mt-2 flex items-center justify-center">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 border border-gray-100 text-[11px] font-semibold text-gray-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            We typically reply within 2 business days
          </div>
        </div>
      </motion.div>

      {/* SECTION HEADER */}
      <div className="px-1">
        <h2 className="text-[17px] font-bold tracking-tight text-foreground">Pick what fits you</h2>
        <p className="text-[13px] text-muted-foreground mt-0.5">Each route goes to the right team — choose one to begin.</p>
      </div>

      {/* CARDS */}
      <div className="grid gap-3 sm:grid-cols-2">
        {TYPE_CARDS.map((card, i) => (
          <motion.button
            key={card.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 + i * 0.06, type: "spring", stiffness: 240, damping: 22 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onPick(card.key)}
            className="group relative overflow-hidden flex items-center gap-4 p-4 rounded-[20px] bg-white border border-gray-100/80 shadow-[0_6px_20px_-4px_rgba(0,0,0,0.06),0_2px_6px_-2px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_-8px_rgba(0,0,0,0.12)] hover:border-[#FFCC02]/50 text-left transition-all duration-300"
            data-testid={`card-type-${card.key}`}
          >
            <motion.div
              whileHover={{ rotate: [0, -6, 6, -3, 0], transition: { duration: 0.55 } }}
              className="relative shrink-0 w-16 h-16 rounded-2xl bg-[hsl(var(--warm-100))] flex items-center justify-center"
            >
              <Mascot name={card.mascot} size="md" />
            </motion.div>

            <div className="relative flex-1 min-w-0">
              <div className="font-bold text-[15px] tracking-tight text-foreground leading-tight">{card.title}</div>
              <div className="text-[13px] text-muted-foreground mt-1 leading-snug line-clamp-2">{card.description}</div>
            </div>

            <div className="shrink-0 self-center w-8 h-8 rounded-full bg-[#FFCC02]/0 group-hover:bg-[#FFCC02] flex items-center justify-center text-foreground/40 group-hover:text-[#1a1a1a] transition-colors duration-200">
              <ArrowRight className="w-4 h-4" strokeWidth={2.4} />
            </div>
          </motion.button>
        ))}
      </div>

      {/* TRUST FOOTER */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="rounded-[20px] bg-white border border-gray-100/80 p-4 flex items-center gap-3 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.04)]"
      >
        <div className="shrink-0 w-10 h-10 rounded-full bg-[hsl(var(--warm-100))] flex items-center justify-center">
          <Mail className="w-4.5 h-4.5 text-[#1a1a1a]" strokeWidth={2.2} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-bold tracking-tight text-foreground">Real humans, real replies.</div>
          <div className="text-[12px] text-muted-foreground leading-snug">Every submission is read by Toast's team. We never share your info — pinky promise.</div>
        </div>
      </motion.div>
    </div>
  );
}

function Success({ category, onAnother }: { category: Category; onAnother: () => void }) {
  const mascot = mascotForCategory(category);
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center pt-12 pb-20" data-testid="contact-success">
      <motion.div initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
        <div className="relative">
          <Mascot name={mascot} size="xl" />
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}
            className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-[#00B14F] flex items-center justify-center shadow-lg">
            <Check className="w-6 h-6 text-white" strokeWidth={3} />
          </motion.div>
        </div>
      </motion.div>
      <h2 className="mt-6 text-2xl font-extrabold text-gray-900" data-testid="text-success-title">Got it — Toast received your message.</h2>
      <p className="mt-2 text-sm text-gray-500 max-w-sm" data-testid="text-success-body">{SUCCESS_COPY[category]}</p>
      <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <Link href="/">
          <Button className="w-full h-12 rounded-2xl bg-[#FFCC02] hover:bg-[#FFD633] text-gray-900 font-semibold" data-testid="button-back-home">
            <Home className="w-4 h-4 mr-2" /> Back to Toast Home
          </Button>
        </Link>
        <Button variant="outline" onClick={onAnother} className="w-full h-12 rounded-2xl font-semibold" data-testid="button-submit-another">
          Submit another
        </Button>
      </div>
    </motion.div>
  );
}

export default function Contact() {
  const [view, setView] = useState<View>("landing");
  const [category, setCategory] = useState<Category | null>(null);
  const [successCategory, setSuccessCategory] = useState<Category | null>(null);
  const [signedInUser] = useState<SignedInUser | null>(() => getSignedInUser());

  useEffect(() => {
    document.title = "Contact Toast — Let's Make Better Plans Together";
  }, []);

  const reset = () => { setView("landing"); setCategory(null); setSuccessCategory(null); };

  return (
    <div className="min-h-[100dvh] bg-background" data-testid="page-contact">
      <header className="sticky top-0 z-10 px-4 py-3 bg-background/85 backdrop-blur-md border-b border-gray-200/60">
        <div className="max-w-[480px] mx-auto flex items-center">
          <Link href="/">
            <button className="inline-flex items-center gap-1.5 -ml-1 px-2 py-1.5 rounded-full text-sm font-semibold text-foreground/80 hover:text-foreground hover:bg-gray-100 transition-colors" data-testid="link-back-home">
              <ArrowLeft className="w-4 h-4" strokeWidth={2.4} />
              Back to Toast
            </button>
          </Link>
        </div>
      </header>
      <main className="max-w-[480px] mx-auto px-4 py-4">
        <AnimatePresence mode="wait">
          {view === "landing" && (
            <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Landing onPick={c => { setCategory(c); setView("form"); }} />
            </motion.div>
          )}
          {view === "form" && category === "user_feedback" && (
            <motion.div key="user-feedback" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <UserFeedbackForm signedInUser={signedInUser} onCancel={reset} onSubmitted={c => { setSuccessCategory(c); setView("success"); }} />
            </motion.div>
          )}
          {view === "form" && category && category !== "user_feedback" && (
            <motion.div key={category} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <PartnerForm signedInUser={signedInUser} category={category} onCancel={reset} onSubmitted={c => { setSuccessCategory(c); setView("success"); }} />
            </motion.div>
          )}
          {view === "success" && successCategory && (
            <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Success category={successCategory} onAnother={reset} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
