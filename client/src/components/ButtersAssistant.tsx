import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { getAdminToken } from "@/pages/admin/AdminLayout";
import { Sparkles, X, Check, XCircle, ChevronDown, ChevronUp, Clock, FileText, Store } from "lucide-react";
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
  type: "bot" | "action";
  text: string;
  timestamp: Date;
}

export default function ButtersAssistant() {
  const [open, setOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      type: "bot",
      text: "Hi there! I'm Butters, your admin assistant. Here's what needs your attention today.",
      timestamp: new Date(),
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  function addMessage(type: "bot" | "action", text: string) {
    setMessages((prev) => [
      ...prev,
      { id: `msg-${Date.now()}`, type, text, timestamp: new Date() },
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

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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
          className="fixed bottom-24 right-6 z-50 w-[380px] max-h-[520px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
          data-testid="panel-butters"
        >
          <div
            className="flex items-center justify-between gap-2 px-5 py-4 border-b border-gray-100"
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

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3" data-testid="butters-content">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === "action" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                    msg.type === "action"
                      ? "bg-gray-100 text-gray-700"
                      : "bg-amber-50 text-gray-800 border border-amber-100"
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

                {pendingClaims.length === 0 && (
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
        <span className="text-amber-500">{icon}</span>
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
