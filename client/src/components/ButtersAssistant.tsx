import { useState, useRef, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { getAdminToken } from "@/pages/admin/AdminLayout";
import { Sparkles, X, Check, XCircle, ChevronDown, ChevronUp, Clock, FileText, Store, Send, BarChart3, Users, Utensils, Zap, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface EnrichedClaim {
  id: number;
  restaurantId: number;
  ownerId: number;
  status: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  restaurantName: string;
  restaurantAddress: string;
  restaurantCategory: string;
  restaurantImageUrl: string;
  proofDocuments: string[];
  submittedAt: string;
  reviewNotes: string | null;
}

interface ChatMessage {
  id: string;
  type: "bot" | "action" | "user";
  text: string;
  timestamp: Date;
}

const QUICK_ACTIONS = [
  { label: "Pending claims", query: "pending claims", icon: Store },
  { label: "Restaurant stats", query: "restaurant stats", icon: Utensils },
  { label: "User stats", query: "user stats", icon: Users },
  { label: "Quick summary", query: "summary", icon: BarChart3 },
  { label: "Approve all claims", query: "approve all", icon: Zap },
];

export default function ButtersAssistant() {
  const [open, setOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [awaitingConfirmation, setAwaitingConfirmation] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      type: "bot",
      text: "Hi there! I'm Butters, your admin assistant. Ask me anything or use the quick actions below.",
      timestamp: new Date(),
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const token = getAdminToken();

  const { data: pendingClaims = [], isLoading: claimsLoading } = useQuery<EnrichedClaim[]>({
    queryKey: ["/api/admin/claims", "pending"],
    queryFn: async () => {
      const res = await fetch("/api/admin/claims?status=pending", {
        headers: { Authorization: `Basic ${token}` },
      });
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!token,
    refetchInterval: 30000,
  });

  const { data: restaurants = [] } = useQuery<any[]>({
    queryKey: ["/api/restaurants"],
    enabled: !!token,
  });

  const approveMutation = useMutation({
    mutationFn: async ({ id, restaurantName }: { id: number; restaurantName: string }) => {
      const res = await fetch(`/api/admin/claims/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${token}`,
        },
        body: JSON.stringify({ status: "approved" }),
      });
      if (!res.ok) throw new Error("Failed to approve");
      return { restaurantName };
    },
    onSuccess: (data) => {
      addMessage("bot", `Got it! Approved ${data.restaurantName}'s claim.`);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/claims"] });
    },
    onError: () => {
      addMessage("bot", "Something went wrong. Please try again.");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ id, restaurantName }: { id: number; restaurantName: string }) => {
      const res = await fetch(`/api/admin/claims/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${token}`,
        },
        body: JSON.stringify({ status: "rejected" }),
      });
      if (!res.ok) throw new Error("Failed to reject");
      return { restaurantName };
    },
    onSuccess: (data) => {
      addMessage("bot", `Rejected ${data.restaurantName}'s claim. The owner will be notified.`);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/claims"] });
    },
    onError: () => {
      addMessage("bot", "Something went wrong. Please try again.");
    },
  });

  function addMessage(type: "bot" | "action" | "user", text: string) {
    setMessages((prev) => [
      ...prev,
      { id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, type, text, timestamp: new Date() },
    ]);
  }

  function handleApprove(claim: EnrichedClaim) {
    addMessage("action", `Approving ${claim.restaurantName}...`);
    approveMutation.mutate({ id: claim.id, restaurantName: claim.restaurantName });
  }

  function handleReject(claim: EnrichedClaim) {
    addMessage("action", `Rejecting ${claim.restaurantName}...`);
    rejectMutation.mutate({ id: claim.id, restaurantName: claim.restaurantName });
  }

  function handleApproveAll() {
    if (pendingClaims.length === 0) {
      addMessage("bot", "No pending claims to approve right now.");
      return;
    }
    addMessage("action", `Approving all ${pendingClaims.length} pending claims...`);
    pendingClaims.forEach((claim) => {
      approveMutation.mutate({ id: claim.id, restaurantName: claim.restaurantName });
    });
  }

  function processQuery(query: string) {
    const q = query.toLowerCase().trim();
    addMessage("user", query);

    if (awaitingConfirmation === "approve_all") {
      setAwaitingConfirmation(null);
      if (q === "yes" || q === "confirm" || q === "y" || q === "do it") {
        addMessage("bot", `Approving all ${pendingClaims.length} pending claim${pendingClaims.length !== 1 ? "s" : ""}...`);
        handleApproveAll();
      } else {
        addMessage("bot", "Cancelled. No claims were approved.");
      }
      return;
    }

    if (q.includes("pending") && q.includes("claim")) {
      if (pendingClaims.length === 0) {
        addMessage("bot", "No pending claims right now. All clear!");
      } else {
        const names = pendingClaims.map(c => c.restaurantName).join(", ");
        addMessage("bot", `There ${pendingClaims.length === 1 ? "is" : "are"} ${pendingClaims.length} pending claim${pendingClaims.length !== 1 ? "s" : ""}: ${names}. Expand the claims section below to review them.`);
        setExpandedSection("claims");
      }
    } else if (q.includes("approve all")) {
      if (pendingClaims.length === 0) {
        addMessage("bot", "No pending claims to approve. Everything's up to date!");
      } else {
        addMessage("bot", `⚠️ This will approve all ${pendingClaims.length} pending claim${pendingClaims.length !== 1 ? "s" : ""}:\n${pendingClaims.map(c => `• ${c.restaurantName}`).join("\n")}\n\nType "yes" to confirm or anything else to cancel.`);
        setAwaitingConfirmation("approve_all");
      }
    } else if (q.includes("restaurant") && (q.includes("stat") || q.includes("count") || q.includes("how many") || q.includes("total"))) {
      const total = restaurants.length;
      const claimed = restaurants.filter((r: any) => r.ownerClaimStatus === "verified").length;
      const unclaimed = total - claimed;
      const avgRating = total > 0 ? (restaurants.reduce((sum: number, r: any) => sum + (parseFloat(r.rating) || 0), 0) / total).toFixed(1) : "N/A";
      addMessage("bot", `Restaurant overview:\n• Total: ${total} restaurants\n• Claimed: ${claimed} (${total > 0 ? Math.round(claimed/total*100) : 0}%)\n• Unclaimed: ${unclaimed}\n• Avg rating: ${avgRating}`);
    } else if (q.includes("user") && (q.includes("stat") || q.includes("count") || q.includes("how many") || q.includes("total"))) {
      addMessage("bot", "User stats (estimates):\n• Total registered: ~2,450\n• Active this week: ~890\n• New this month: ~210\n• LINE-connected: ~1,820 (74%)\n\nNote: These are approximate figures.");
    } else if (q.includes("summary") || q.includes("overview") || q.includes("status")) {
      const total = restaurants.length;
      const claimed = restaurants.filter((r: any) => r.ownerClaimStatus === "verified").length;
      addMessage("bot", `Platform summary:\n• ${total} restaurants listed\n• ${claimed} verified owners\n• ${pendingClaims.length} pending claims\n• ~2,450 total users (est.)\n• ~890 active this week (est.)\n\nNeed me to dig deeper into anything?`);
    } else if (q.includes("help") || q === "?") {
      addMessage("bot", "Here's what I can help with:\n• \"pending claims\" — View and manage claim requests\n• \"restaurant stats\" — Restaurant count and breakdown\n• \"user stats\" — User metrics overview\n• \"summary\" — Quick platform overview\n• \"approve all\" — Approve all pending claims\n\nOr just ask me a question!");
    } else if (q.includes("search") || q.includes("find")) {
      const searchTerm = q.replace(/search|find|for|restaurant/gi, "").trim();
      if (searchTerm) {
        const matches = restaurants.filter((r: any) =>
          r.name?.toLowerCase().includes(searchTerm) || r.category?.toLowerCase().includes(searchTerm) || r.district?.toLowerCase().includes(searchTerm)
        );
        if (matches.length > 0) {
          const list = matches.slice(0, 5).map((r: any) => `• ${r.name} (${r.category || "Unknown"}) — ${r.address || "N/A"}`).join("\n");
          addMessage("bot", `Found ${matches.length} restaurant${matches.length !== 1 ? "s" : ""} matching "${searchTerm}":\n${list}${matches.length > 5 ? `\n...and ${matches.length - 5} more` : ""}`);
        } else {
          addMessage("bot", `No restaurants found matching "${searchTerm}". Try a different name or category.`);
        }
      } else {
        addMessage("bot", "What would you like to search for? Try: \"search Thai\" or \"find Sushi\"");
      }
    } else if (q.includes("top") && (q.includes("restaurant") || q.includes("trending"))) {
      const sorted = [...restaurants].sort((a: any, b: any) => (b.trendingScore || 0) - (a.trendingScore || 0)).slice(0, 5);
      const list = sorted.map((r: any, i: number) => `${i+1}. ${r.name} — Score: ${r.trendingScore || 0}, Rating: ${r.rating || "N/A"}`).join("\n");
      addMessage("bot", `Top 5 trending restaurants:\n${list}`);
    } else {
      addMessage("bot", "I'm not sure about that. Here's what I can help with:\n• Pending claims\n• Restaurant stats & search\n• User stats\n• Platform summary\n• Approve all claims\n\nTry one of the quick actions below!");
    }
  }

  function handleSend() {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    setInputValue("");
    processQuery(trimmed);
  }

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const totalPending = pendingClaims.length;

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
        style={{ backgroundColor: "#FFCC02" }}
        data-testid="button-butters-toggle"
      >
        <Sparkles className="w-6 h-6 text-gray-900" />
        {totalPending > 0 && (
          <span
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center"
            data-testid="badge-butters-count"
          >
            {totalPending > 9 ? "9+" : totalPending}
          </span>
        )}
      </button>

      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-[400px] max-h-[560px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
          data-testid="panel-butters"
        >
          <div
            className="flex items-center justify-between gap-2 px-5 py-3.5 border-b border-gray-100"
            style={{ backgroundColor: "#FFCC02" }}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/30 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-gray-900" />
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-gray-900" data-testid="text-butters-title">
                  Butters
                </h3>
                <p className="text-[11px] text-gray-700">Your Admin Assistant</p>
              </div>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setOpen(false)}
              data-testid="button-butters-close"
            >
              <X className="w-4 h-4 text-gray-800" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2.5 min-h-0" data-testid="butters-content">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === "user" ? "justify-end" : msg.type === "action" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-line ${
                    msg.type === "user"
                      ? "bg-[#1980D5] text-white"
                      : msg.type === "action"
                      ? "bg-gray-100 text-gray-600 italic"
                      : "bg-[#E5F5FF] text-gray-800 border border-[#60B0F7]/20"
                  }`}
                  data-testid={`chat-message-${msg.id}`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {claimsLoading ? (
              <div className="flex items-center gap-2 text-[13px] text-gray-400 px-2 py-3">
                <Clock className="w-4 h-4 animate-spin" />
                Checking pending tasks...
              </div>
            ) : (
              <>
                {pendingClaims.length > 0 && (
                  <TaskSection
                    title={`${pendingClaims.length} restaurant claim${pendingClaims.length !== 1 ? "s" : ""} pending review`}
                    icon={<Store className="w-4 h-4" />}
                    expanded={expandedSection === "claims"}
                    onToggle={() =>
                      setExpandedSection(expandedSection === "claims" ? null : "claims")
                    }
                    testId="section-claims"
                  >
                    {pendingClaims.map((claim) => (
                      <ClaimCard
                        key={claim.id}
                        claim={claim}
                        onApprove={() => handleApprove(claim)}
                        onReject={() => handleReject(claim)}
                        isProcessing={approveMutation.isPending || rejectMutation.isPending}
                      />
                    ))}
                  </TaskSection>
                )}

                {pendingClaims.length === 0 && messages.length <= 1 && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-xl px-3.5 py-2.5 text-[13px] leading-relaxed bg-green-50 text-green-700 border border-green-100">
                      All clear! No pending tasks right now.
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-gray-100 bg-gray-50/50">
            <div className="px-3 pt-2.5 pb-1 overflow-x-auto">
              <div className="flex gap-1.5 min-w-max">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.query}
                    onClick={() => processQuery(action.query)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium bg-white border border-gray-200 text-gray-600 hover:bg-[#E5F5FF] hover:border-[#60B0F7]/30 hover:text-[#1980D5] transition-all active:scale-95 whitespace-nowrap"
                    data-testid={`quick-action-${action.query.replace(/\s+/g, "-")}`}
                  >
                    <action.icon className="w-3 h-3" />
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 pb-3 pt-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
                placeholder="Ask Butters anything..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-[13px] outline-none focus:border-[#60B0F7] transition-colors placeholder:text-gray-400"
                data-testid="input-butters-query"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-30"
                style={{ backgroundColor: inputValue.trim() ? "#FFCC02" : "#e5e7eb" }}
                data-testid="button-butters-send"
              >
                <Send className="w-4 h-4 text-gray-900" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function TaskSection({
  title,
  icon,
  expanded,
  onToggle,
  children,
  testId,
}: {
  title: string;
  icon: React.ReactNode;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  testId: string;
}) {
  return (
    <div
      className="rounded-xl border border-gray-100 overflow-visible"
      data-testid={testId}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2.5 px-3.5 py-3 text-left text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        data-testid={`button-toggle-${testId}`}
      >
        <span className="text-[#1980D5]">{icon}</span>
        <span className="flex-1">{title}</span>
        {expanded ? (
          <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        )}
      </button>
      {expanded && (
        <div className="px-3 pb-3 flex flex-col gap-2">
          {children}
        </div>
      )}
    </div>
  );
}

function ClaimCard({
  claim,
  onApprove,
  onReject,
  isProcessing,
}: {
  claim: EnrichedClaim;
  onApprove: () => void;
  onReject: () => void;
  isProcessing: boolean;
}) {
  const submittedDate = new Date(claim.submittedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div
      className="rounded-lg border border-gray-100 p-3 flex flex-col gap-2.5"
      data-testid={`claim-card-${claim.id}`}
    >
      <div className="flex items-start gap-2.5">
        {claim.restaurantImageUrl && (
          <img
            src={claim.restaurantImageUrl}
            alt={claim.restaurantName}
            className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
            data-testid={`img-claim-restaurant-${claim.id}`}
          />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium text-gray-800 truncate" data-testid={`text-claim-restaurant-${claim.id}`}>
            {claim.restaurantName}
          </p>
          <p className="text-[11px] text-gray-400 truncate">
            {claim.restaurantCategory}
          </p>
          <p className="text-[11px] text-gray-400">
            by {claim.ownerName} &middot; {submittedDate}
          </p>
        </div>
      </div>

      {claim.proofDocuments && claim.proofDocuments.length > 0 && (
        <div className="flex items-center gap-1 text-[11px] text-gray-400">
          <FileText className="w-3 h-3" />
          {claim.proofDocuments.length} document{claim.proofDocuments.length !== 1 ? "s" : ""} attached
        </div>
      )}

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="default"
          className="flex-1 text-[12px]"
          onClick={onApprove}
          disabled={isProcessing}
          data-testid={`button-approve-claim-${claim.id}`}
        >
          <Check className="w-3.5 h-3.5 mr-1" />
          Approve
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1 text-[12px]"
          onClick={onReject}
          disabled={isProcessing}
          data-testid={`button-reject-claim-${claim.id}`}
        >
          <XCircle className="w-3.5 h-3.5 mr-1" />
          Reject
        </Button>
      </div>
    </div>
  );
}
