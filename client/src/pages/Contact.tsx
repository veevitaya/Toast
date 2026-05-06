import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, ChevronDown, Loader2, Mail, Paperclip, X, Home } from "lucide-react";
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

function RatingScale({ value, onChange, max = 10, testid }: { value: number | null; onChange: (n: number) => void; max?: number; testid: string }) {
  return (
    <div className="flex flex-wrap gap-2" data-testid={testid}>
      {Array.from({ length: max }, (_, i) => i + 1).map(n => (
        <button key={n} type="button" onClick={() => onChange(n)}
          className={`min-w-[44px] h-11 px-3 rounded-xl text-sm font-semibold transition ${
            value === n ? "bg-[#FFCC02] text-gray-900 shadow-sm" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
          }`}
          data-testid={`${testid}-${n}`}>
          {n}
        </button>
      ))}
    </div>
  );
}

function YesNoMaybe({ value, onChange, options = ["yes","no","maybe"], testid }: { value: string; onChange: (v: string) => void; options?: string[]; testid: string }) {
  return (
    <div className="flex gap-2 flex-wrap" data-testid={testid}>
      {options.map(o => (
        <button key={o} type="button" onClick={() => onChange(o)}
          className={`px-4 py-2.5 rounded-xl text-sm font-semibold capitalize transition ${
            value === o ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"
          }`}
          data-testid={`${testid}-${o}`}>
          {o.replace("_", " ")}
        </button>
      ))}
    </div>
  );
}

function ProgressDots({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-1.5" data-testid="progress-dots">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className={`h-1.5 rounded-full transition-all ${i === step ? "w-8 bg-[#FFCC02]" : i < step ? "w-1.5 bg-[#FFCC02]" : "w-1.5 bg-gray-200"}`} />
      ))}
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
function UserFeedbackForm({ onCancel, onSubmitted }: { onCancel: () => void; onSubmitted: (cat: Category) => void }) {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [files, setFiles] = useState<FileAttachment[]>([]);
  const [data, setData] = useState<any>(() => ({
    overall_satisfaction_score: null, would_use_again: "", would_recommend_to_friends: "", ease_of_use_score: null,
    recommendation_relevance: "", helped_make_decision: "", helped_find_new_restaurants: "", decision_time: "",
    top_two_liked: "", top_two_to_improve: "", favorite_part: "", visual_feedback: "", suggestions: "",
    quote_permission: "", quote_1: "", quote_2: "", quote_3: "",
    name: "", email: "", phone_or_line: "", consent: false,
    company_website: "", // honeypot
    ...loadDraft().userFeedback,
  }));

  useEffect(() => { saveDraft({ ...loadDraft(), userFeedback: data }); }, [data]);

  const set = (k: string, v: any) => setData((d: any) => ({ ...d, [k]: v }));

  const stepValid = (() => {
    if (step === 0) return data.overall_satisfaction_score && data.would_use_again && data.would_recommend_to_friends && data.ease_of_use_score;
    if (step === 1) return data.recommendation_relevance && data.helped_make_decision && data.helped_find_new_restaurants && data.decision_time;
    if (step === 2) return (data.top_two_liked || "").trim().length > 0;
    if (step === 3) return data.quote_permission;
    if (step === 4) return (data.name || "").trim() && ((data.email || "").trim() || (data.phone_or_line || "").trim()) && data.consent;
    return false;
  })();

  const next = () => setStep(s => Math.min(s + 1, 4));
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
        lineId: looksLikeLine ? phone_or_line : null,
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

  return (
    <div className="flex flex-col h-full" data-testid="form-user-feedback">
      <div className="flex items-center justify-between mb-4">
        <button onClick={step === 0 ? onCancel : back} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900" data-testid="button-form-back">
          <ArrowLeft className="w-4 h-4" /> {step === 0 ? "Choose another" : "Back"}
        </button>
        <ProgressDots step={step} total={5} />
        <div className="w-20" />
      </div>

      <div className="flex items-center gap-3 mb-6">
        <Mascot name="toast" size="md" />
        <div>
          <h2 className="text-xl font-bold text-gray-900" data-testid="text-form-title">Everyday User Feedback</h2>
          <p className="text-sm text-gray-500">{INTRO_COPY.user_feedback}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-32 space-y-6">
        {step === 0 && (
          <>
            <div>
              <Label className="text-sm font-semibold text-gray-700">Overall, how satisfied are you with Toast?</Label>
              <div className="mt-2"><RatingScale value={data.overall_satisfaction_score} onChange={n => set("overall_satisfaction_score", n)} testid="rating-overall" /></div>
            </div>
            <div>
              <Label className="text-sm font-semibold text-gray-700">Would you use Toast again?</Label>
              <div className="mt-2"><YesNoMaybe value={data.would_use_again} onChange={v => set("would_use_again", v)} testid="ynm-would-use-again" /></div>
            </div>
            <div>
              <Label className="text-sm font-semibold text-gray-700">Would you recommend Toast to your friends?</Label>
              <div className="mt-2"><YesNoMaybe value={data.would_recommend_to_friends} onChange={v => set("would_recommend_to_friends", v)} testid="ynm-recommend" /></div>
            </div>
            <div>
              <Label className="text-sm font-semibold text-gray-700">Was Toast easy to understand and use?</Label>
              <div className="mt-2"><RatingScale value={data.ease_of_use_score} onChange={n => set("ease_of_use_score", n)} testid="rating-ease" /></div>
            </div>
          </>
        )}
        {step === 1 && (
          <>
            <div>
              <Label className="text-sm font-semibold text-gray-700">Did the recommendation feel relevant?</Label>
              <div className="mt-2"><YesNoMaybe value={data.recommendation_relevance} onChange={v => set("recommendation_relevance", v)} options={["yes","no","somewhat"]} testid="ynm-relevance" /></div>
            </div>
            <div>
              <Label className="text-sm font-semibold text-gray-700">Did Toast help you make a decision?</Label>
              <div className="mt-2"><YesNoMaybe value={data.helped_make_decision} onChange={v => set("helped_make_decision", v)} testid="ynm-decided" /></div>
            </div>
            <div>
              <Label className="text-sm font-semibold text-gray-700">Did Toast help you find new restaurant choices?</Label>
              <div className="mt-2"><YesNoMaybe value={data.helped_find_new_restaurants} onChange={v => set("helped_find_new_restaurants", v)} testid="ynm-new-restaurants" /></div>
            </div>
            <div>
              <Label className="text-sm font-semibold text-gray-700">How long did it take to reach a decision?</Label>
              <div className="mt-2 flex flex-wrap gap-2" data-testid="select-decision-time">
                {["Under 1 minute","1–3 minutes","3–5 minutes","5–10 minutes","More than 10 minutes","Still couldn't decide"].map(o => (
                  <button key={o} type="button" onClick={() => set("decision_time", o)}
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition ${data.decision_time === o ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}>
                    {o}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <div><Label>What are the top 2 things you liked?</Label><Textarea className="mt-2 rounded-xl" rows={3} value={data.top_two_liked} onChange={e => set("top_two_liked", e.target.value)} data-testid="textarea-top-liked" /></div>
            <div><Label>What are the top 2 things Toast should improve?</Label><Textarea className="mt-2 rounded-xl" rows={3} value={data.top_two_to_improve} onChange={e => set("top_two_to_improve", e.target.value)} data-testid="textarea-top-improve" /></div>
            <div><Label>What do you like most about Toast?</Label><Textarea className="mt-2 rounded-xl" rows={2} value={data.favorite_part} onChange={e => set("favorite_part", e.target.value)} data-testid="textarea-favorite" /></div>
            <div><Label>How do you feel about the app's visuals?</Label><Textarea className="mt-2 rounded-xl" rows={2} value={data.visual_feedback} onChange={e => set("visual_feedback", e.target.value)} data-testid="textarea-visual" /></div>
            <div><Label>Any suggestions?</Label><Textarea className="mt-2 rounded-xl" rows={2} value={data.suggestions} onChange={e => set("suggestions", e.target.value)} data-testid="textarea-suggestions" /></div>
          </>
        )}
        {step === 3 && (
          <>
            <div>
              <Label className="text-sm font-semibold text-gray-700">Can Toast use short quotes from your feedback?</Label>
              <p className="text-xs text-gray-500 mt-1 mb-3">For internal learning, pitch decks, or marketing.</p>
              <div className="flex flex-col gap-2" data-testid="select-quote-permission">
                {[{v:"yes_with_name", l:"Yes, with my name"}, {v:"yes_anonymous", l:"Yes, anonymously"}, {v:"no", l:"No"}].map(o => (
                  <button key={o.v} type="button" onClick={() => set("quote_permission", o.v)}
                    className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition ${data.quote_permission === o.v ? "bg-[#FFCC02] text-gray-900" : "bg-gray-50 text-gray-700 hover:bg-gray-100"}`}>
                    {o.l}
                  </button>
                ))}
              </div>
            </div>
            {(data.quote_permission === "yes_with_name" || data.quote_permission === "yes_anonymous") && (
              <div className="space-y-2">
                <Input placeholder="Quote 1 (optional)" className="rounded-xl" value={data.quote_1} onChange={e => set("quote_1", e.target.value)} data-testid="input-quote-1" />
                <Input placeholder="Quote 2 (optional)" className="rounded-xl" value={data.quote_2} onChange={e => set("quote_2", e.target.value)} data-testid="input-quote-2" />
                <Input placeholder="Quote 3 (optional)" className="rounded-xl" value={data.quote_3} onChange={e => set("quote_3", e.target.value)} data-testid="input-quote-3" />
              </div>
            )}
          </>
        )}
        {step === 4 && (
          <>
            <div><Label>Your name</Label><Input className="mt-2 rounded-xl" value={data.name} onChange={e => set("name", e.target.value)} data-testid="input-name" /></div>
            <div><Label>Email</Label><Input type="email" className="mt-2 rounded-xl" value={data.email} onChange={e => set("email", e.target.value)} data-testid="input-email" /></div>
            <div><Label>Phone or LINE (optional)</Label><Input className="mt-2 rounded-xl" placeholder="@yourline or +66..." value={data.phone_or_line} onChange={e => set("phone_or_line", e.target.value)} data-testid="input-phone-line" /></div>
            <div><Label>Screenshot or file (optional)</Label><div className="mt-2"><FileUploader files={files} onChange={setFiles} /></div></div>
            <label className="flex items-start gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={data.consent} onChange={e => set("consent", e.target.checked)} className="mt-0.5" data-testid="checkbox-consent" />
              <span>I'm okay with Toast contacting me about this.</span>
            </label>
            {/* Honeypot */}
            <input tabIndex={-1} autoComplete="off" type="text" name="company_website" value={data.company_website} onChange={e => set("company_website", e.target.value)} style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }} aria-hidden="true" />
          </>
        )}
      </div>

      <div className="fixed bottom-0 inset-x-0 px-4 py-3 bg-white/95 backdrop-blur border-t border-gray-100 max-w-[480px] mx-auto">
        <Button onClick={step === 4 ? submit : next} disabled={!stepValid || submitting}
          className="w-full h-12 rounded-2xl bg-[#FFCC02] hover:bg-[#FFD633] text-gray-900 font-semibold disabled:opacity-50"
          data-testid="button-form-next">
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : step === 4 ? "Submit feedback" : <>Next <ArrowRight className="w-4 h-4 ml-1" /></>}
        </Button>
      </div>
    </div>
  );
}

// ============================================================================
// CONCISE PARTNER FORM (used for the 3 partner categories)
// ============================================================================
function PartnerForm({ category, onCancel, onSubmitted }: { category: Exclude<Category, "user_feedback">; onCancel: () => void; onSubmitted: (cat: Category) => void }) {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [showOptional, setShowOptional] = useState(false);
  const [files, setFiles] = useState<FileAttachment[]>([]);
  const [data, setData] = useState<any>(() => ({
    name: "", email_or_line: "", role_title: "",
    business_name: "", business_type: "", interest_type: "",
    location: "", number_of_branches: "", website_url: "", instagram_url: "", google_maps_url: "", short_message: "",
    organization_event_or_venue_name: "", experience_type: "", frequency: "", ticketing_link: "",
    company_brand_or_app: "", partnership_type: "", short_pitch: "", website_or_social_link: "", budget_range: "", preferred_contact_method: "",
    company_website: "", // honeypot
    ...(loadDraft()[category] || {}),
  }));

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

  const Pill = ({ field, options, testid }: { field: string; options: string[]; testid: string }) => (
    <div className="flex flex-wrap gap-2" data-testid={testid}>
      {options.map(o => (
        <button key={o} type="button" onClick={() => set(field, o)}
          className={`px-3 py-2 rounded-xl text-sm font-medium transition ${data[field] === o ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-700 hover:bg-gray-100"}`}>
          {o}
        </button>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col h-full" data-testid={`form-${category}`}>
      <div className="flex items-center justify-between mb-4">
        <button onClick={onCancel} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900" data-testid="button-form-back">
          <ArrowLeft className="w-4 h-4" /> Choose another
        </button>
        <div className="w-20" />
      </div>
      <div className="flex items-center gap-3 mb-6">
        <Mascot name={mascotName} size="md" />
        <div>
          <h2 className="text-xl font-bold text-gray-900" data-testid="text-form-title">{titleByCat[category]}</h2>
          <p className="text-sm text-gray-500">{INTRO_COPY[category]}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-32 space-y-5">
        <div><Label>Your name *</Label><Input className="mt-2 rounded-xl" value={data.name} onChange={e => set("name", e.target.value)} data-testid="input-name" /></div>
        <div><Label>Email or LINE *</Label><Input className="mt-2 rounded-xl" placeholder="you@company.com or @yourline" value={data.email_or_line} onChange={e => set("email_or_line", e.target.value)} data-testid="input-email-or-line" /></div>

        {category === "restaurant_partner" && (
          <>
            <div><Label>Role / title</Label><Input className="mt-2 rounded-xl" value={data.role_title} onChange={e => set("role_title", e.target.value)} data-testid="input-role-title" /></div>
            <div><Label>Business name *</Label><Input className="mt-2 rounded-xl" value={data.business_name} onChange={e => set("business_name", e.target.value)} data-testid="input-business-name" /></div>
            <div><Label>Business type *</Label><div className="mt-2"><Pill field="business_type" options={["Restaurant","Cafe","Bar","Dessert shop","Food court","Mall","Cloud kitchen","Franchise","Other"]} testid="select-business-type" /></div></div>
            <div><Label>What do you want to do with Toast? *</Label><div className="mt-2"><Pill field="interest_type" options={["Get listed","Promote my restaurant/menu","Partner as a mall/food court","Reach group decision-makers","Learn about Toast advertising","Other"]} testid="select-interest" /></div></div>
          </>
        )}
        {category === "event_activity_partner" && (
          <>
            <div><Label>Organization / event / venue name *</Label><Input className="mt-2 rounded-xl" value={data.organization_event_or_venue_name} onChange={e => set("organization_event_or_venue_name", e.target.value)} data-testid="input-org-name" /></div>
            <div><Label>Experience type *</Label><div className="mt-2"><Pill field="experience_type" options={["Event organizer","Activity venue","Workshop","Fitness/wellness","Nightlife","Family activity","Date night activity","Travel/tour","Pop-up event","Other"]} testid="select-experience-type" /></div></div>
            <div><Label>Location *</Label><Input className="mt-2 rounded-xl" value={data.location} onChange={e => set("location", e.target.value)} data-testid="input-location" /></div>
            <div><Label>What do you want to do with Toast? *</Label><div className="mt-2"><Pill field="interest_type" options={["List my event/activity","Promote my event/activity","Sell tickets/bookings","Reach groups looking for things to do","Partner with Toast","Other"]} testid="select-interest" /></div></div>
          </>
        )}
        {category === "general_partner" && (
          <>
            <div><Label>Company / brand / app *</Label><Input className="mt-2 rounded-xl" value={data.company_brand_or_app} onChange={e => set("company_brand_or_app", e.target.value)} data-testid="input-company-brand" /></div>
            <div><Label>Partnership type *</Label><div className="mt-2"><Pill field="partnership_type" options={["Brand collaboration","App integration","Sponsorship","Creator/media partnership","Investor/advisor inquiry","Data/API partnership","Other"]} testid="select-partnership-type" /></div></div>
            <div><Label>Short pitch *</Label><Textarea className="mt-2 rounded-xl" rows={4} value={data.short_pitch} onChange={e => set("short_pitch", e.target.value)} data-testid="textarea-short-pitch" /></div>
          </>
        )}

        <button type="button" onClick={() => setShowOptional(s => !s)} className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-sm font-semibold text-gray-700" data-testid="button-toggle-optional">
          <span>Add more details</span>
          <ChevronDown className={`w-4 h-4 transition ${showOptional ? "rotate-180" : ""}`} />
        </button>

        <AnimatePresence>
          {showOptional && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-4 overflow-hidden">
              {category === "restaurant_partner" && (
                <>
                  <div><Label>Location</Label><Input className="mt-2 rounded-xl" value={data.location} onChange={e => set("location", e.target.value)} data-testid="input-location" /></div>
                  <div><Label>Number of branches</Label><Input className="mt-2 rounded-xl" value={data.number_of_branches} onChange={e => set("number_of_branches", e.target.value)} data-testid="input-branches" /></div>
                  <div><Label>Website</Label><Input className="mt-2 rounded-xl" value={data.website_url} onChange={e => set("website_url", e.target.value)} data-testid="input-website" /></div>
                  <div><Label>Instagram</Label><Input className="mt-2 rounded-xl" value={data.instagram_url} onChange={e => set("instagram_url", e.target.value)} data-testid="input-instagram" /></div>
                  <div><Label>Google Maps link</Label><Input className="mt-2 rounded-xl" value={data.google_maps_url} onChange={e => set("google_maps_url", e.target.value)} data-testid="input-gmaps" /></div>
                </>
              )}
              {category === "event_activity_partner" && (
                <>
                  <div><Label>Frequency</Label><div className="mt-2"><Pill field="frequency" options={["One-time event","Weekly","Monthly","Ongoing venue","Seasonal"]} testid="select-frequency" /></div></div>
                  <div><Label>Website</Label><Input className="mt-2 rounded-xl" value={data.website_url} onChange={e => set("website_url", e.target.value)} data-testid="input-website" /></div>
                  <div><Label>Instagram</Label><Input className="mt-2 rounded-xl" value={data.instagram_url} onChange={e => set("instagram_url", e.target.value)} data-testid="input-instagram" /></div>
                  <div><Label>Ticketing link</Label><Input className="mt-2 rounded-xl" value={data.ticketing_link} onChange={e => set("ticketing_link", e.target.value)} data-testid="input-ticketing" /></div>
                </>
              )}
              {category === "general_partner" && (
                <>
                  <div><Label>Website or social link</Label><Input className="mt-2 rounded-xl" value={data.website_or_social_link} onChange={e => set("website_or_social_link", e.target.value)} data-testid="input-website-social" /></div>
                  <div><Label>Budget range</Label><div className="mt-2"><Pill field="budget_range" options={["Not sure yet","Under ฿25,000","฿25,000–฿100,000","฿100,000–฿500,000","฿500,000+"]} testid="select-budget" /></div></div>
                  <div><Label>Preferred contact method</Label><Input className="mt-2 rounded-xl" value={data.preferred_contact_method} onChange={e => set("preferred_contact_method", e.target.value)} data-testid="input-preferred-contact" /></div>
                </>
              )}
              {(category === "restaurant_partner" || category === "event_activity_partner") && (
                <div><Label>Short message</Label><Textarea className="mt-2 rounded-xl" rows={3} value={data.short_message} onChange={e => set("short_message", e.target.value)} data-testid="textarea-short-message" /></div>
              )}
              <div><Label>Attachments (menu, deck, photos…)</Label><div className="mt-2"><FileUploader files={files} onChange={setFiles} /></div></div>
            </motion.div>
          )}
        </AnimatePresence>

        <input tabIndex={-1} autoComplete="off" type="text" name="company_website" value={data.company_website} onChange={e => set("company_website", e.target.value)} style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }} aria-hidden="true" />
      </div>

      <div className="fixed bottom-0 inset-x-0 px-4 py-3 bg-white/95 backdrop-blur border-t border-gray-100 max-w-[480px] mx-auto">
        <Button onClick={submit} disabled={!valid || submitting}
          className="w-full h-12 rounded-2xl bg-[#FFCC02] hover:bg-[#FFD633] text-gray-900 font-semibold disabled:opacity-50"
          data-testid="button-submit">
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit"}
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
              <UserFeedbackForm onCancel={reset} onSubmitted={c => { setSuccessCategory(c); setView("success"); }} />
            </motion.div>
          )}
          {view === "form" && category && category !== "user_feedback" && (
            <motion.div key={category} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <PartnerForm category={category} onCancel={reset} onSubmitted={c => { setSuccessCategory(c); setView("success"); }} />
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
