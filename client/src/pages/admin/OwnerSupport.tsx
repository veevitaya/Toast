import { useState } from "react";
import { HelpCircle, MessageCircle, Book, Search, ExternalLink, Clock, CheckCircle, AlertCircle, ChevronRight } from "lucide-react";

const SUPPORT_TICKETS = [
  { id: "TK-124", subject: "Menu images not updating", status: "open" as const, priority: "medium" as const, created: "Mar 10, 2026", lastReply: "1h ago" },
  { id: "TK-118", subject: "Delivery link not working for LINE MAN", status: "resolved" as const, priority: "high" as const, created: "Mar 5, 2026", lastReply: "2d ago" },
  { id: "TK-112", subject: "How to set up promotions?", status: "resolved" as const, priority: "low" as const, created: "Feb 28, 2026", lastReply: "1w ago" },
];

const FAQ_ITEMS = [
  { q: "How do I update my restaurant hours?", a: "Go to Menu & Hours → Operating Hours and click Edit. Changes are reflected within 5 minutes." },
  { q: "How do delivery links work?", a: "We generate deep links to Grab, LINE MAN, and Robinhood. Add your restaurant URL from each platform in Settings." },
  { q: "What is the Opportunity Score?", a: "It measures how well your listing is optimized. Complete recommendations in Insights to improve your score." },
  { q: "How do I respond to reviews?", a: "Go to Reviews → click any review → type your response. Responses appear publicly within 24 hours." },
  { q: "What are vibe tags?", a: "Tags like 'date night', 'street food', 'instagrammable' help users discover your restaurant. You can edit them in Settings." },
];

const ONBOARDING_STEPS = [
  { label: "Create account", done: true },
  { label: "Verify ownership", done: true },
  { label: "Add restaurant photos", done: true },
  { label: "Set operating hours", done: true },
  { label: "Add delivery links", done: false },
  { label: "Create first promotion", done: false },
  { label: "Set vibe tags", done: false },
];

export default function OwnerSupport() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const completedSteps = ONBOARDING_STEPS.filter(s => s.done).length;
  const totalSteps = ONBOARDING_STEPS.length;

  return (
    <div className="space-y-8" data-testid="owner-support-page">
      <div className="flex items-center gap-3">
        <HelpCircle className="w-5 h-5" style={{ color: "#00B14F" }} />
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Support</h2>
          <p className="text-xs text-muted-foreground">Help center, support tickets, and onboarding progress</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-6" data-testid="card-faq">
            <div className="border-l-[3px] pl-3 mb-5" style={{ borderColor: "#00B14F" }}>
              <h3 className="text-[15px] font-semibold text-gray-800">Help Center</h3>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Frequently asked questions</p>
            </div>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search help articles..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300" data-testid="input-search-faq" />
            </div>
            <div className="space-y-1.5">
              {FAQ_ITEMS.filter(f => !searchQuery || f.q.toLowerCase().includes(searchQuery.toLowerCase())).map((faq, i) => (
                <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
                  <button onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 transition-colors" data-testid={`faq-item-${i}`}>
                    <Book className="w-4 h-4 text-[#00B14F] flex-shrink-0" />
                    <span className="flex-1 text-sm font-medium text-gray-800">{faq.q}</span>
                    <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${expandedFaq === i ? "rotate-90" : ""}`} />
                  </button>
                  {expandedFaq === i && (
                    <div className="px-4 pb-3 pt-0 ml-7">
                      <p className="text-sm text-gray-600">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6" data-testid="card-tickets">
            <div className="flex items-center justify-between mb-5">
              <div className="border-l-[3px] pl-3" style={{ borderColor: "#00B14F" }}>
                <h3 className="text-[15px] font-semibold text-gray-800">Support Tickets</h3>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Your requests</p>
              </div>
              <button className="text-xs font-medium px-3 py-1.5 rounded-lg bg-[#00B14F] text-white hover:bg-[#00A046] transition-colors" data-testid="btn-new-ticket">
                New Ticket
              </button>
            </div>
            <div className="space-y-2">
              {SUPPORT_TICKETS.map(ticket => (
                <div key={ticket.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors cursor-pointer" data-testid={`ticket-${ticket.id}`}>
                  {ticket.status === "open" ?
                    <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" /> :
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  }
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-gray-400">{ticket.id}</span>
                      <span className="text-sm font-medium text-gray-800 truncate">{ticket.subject}</span>
                    </div>
                    <div className="flex gap-2 text-[10px] text-gray-400 mt-0.5">
                      <span>Created: {ticket.created}</span>
                      <span>Last reply: {ticket.lastReply}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    ticket.status === "open" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"
                  }`}>{ticket.status}</span>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-6" data-testid="card-onboarding">
            <div className="border-l-[3px] pl-3 mb-5" style={{ borderColor: "#00B14F" }}>
              <h3 className="text-[15px] font-semibold text-gray-800">Onboarding</h3>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">{completedSteps}/{totalSteps} complete</p>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden mb-4">
              <div className="h-full rounded-full bg-[#00B14F] transition-all" style={{ width: `${(completedSteps / totalSteps) * 100}%` }} />
            </div>
            <div className="space-y-2">
              {ONBOARDING_STEPS.map((step, i) => (
                <div key={i} className="flex items-center gap-3 py-1.5">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${step.done ? "bg-[#00B14F]" : "border-2 border-gray-200"}`}>
                    {step.done && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <span className={`text-sm ${step.done ? "text-gray-400 line-through" : "text-gray-800 font-medium"}`}>{step.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6" data-testid="card-contact">
            <div className="border-l-[3px] pl-3 mb-5" style={{ borderColor: "#00B14F" }}>
              <h3 className="text-[15px] font-semibold text-gray-800">Contact Us</h3>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Direct support</p>
            </div>
            <div className="space-y-3">
              <a href="https://line.me/ti/p/@toastbkk" target="_blank" rel="noopener" className="flex items-center gap-3 p-3 rounded-xl bg-[#06C755]/10 hover:bg-[#06C755]/20 transition-colors" data-testid="link-line-support">
                <MessageCircle className="w-4 h-4 text-[#06C755]" />
                <span className="text-sm font-medium text-gray-800">LINE Chat</span>
                <ExternalLink className="w-3.5 h-3.5 text-gray-400 ml-auto" />
              </a>
              <a href="mailto:support@toastbkk.com" className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors" data-testid="link-email-support">
                <MessageCircle className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-800">Email Support</span>
                <ExternalLink className="w-3.5 h-3.5 text-gray-400 ml-auto" />
              </a>
            </div>
            <p className="text-[10px] text-gray-400 mt-3 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Response time: within 24 hours
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
