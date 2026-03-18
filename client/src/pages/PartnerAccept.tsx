import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { useLineProfile } from "@/hooks/use-line-profile";
import { Heart, Check, X, Loader2, AlertTriangle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

type Status = "loading" | "preview" | "accepting" | "success" | "error" | "expired" | "self";

export default function PartnerAccept() {
  const [, navigate] = useLocation();
  const { profile: lineProfile } = useLineProfile();
  const [status, setStatus] = useState<Status>("loading");
  const [inviteData, setInviteData] = useState<{
    fromDisplayName: string;
    fromPictureUrl: string | null;
    fromUserId: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [partnerResult, setPartnerResult] = useState<{
    partnerDisplayName: string;
    anniversaryDate: string;
  } | null>(null);

  const token = new URLSearchParams(window.location.search).get("token") || "";

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMsg("No invite token provided");
      return;
    }
    fetch(`/api/partner/invite/${encodeURIComponent(token)}`)
      .then(async (res) => {
        if (res.status === 410) { setStatus("expired"); return; }
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setStatus("error");
          setErrorMsg(data.message || "Invalid invite");
          return;
        }
        const data = await res.json();
        if (lineProfile && data.fromUserId === lineProfile.userId) {
          setStatus("self");
          return;
        }
        setInviteData(data);
        setStatus("preview");
      })
      .catch(() => {
        setStatus("error");
        setErrorMsg("Failed to load invite");
      });
  }, [token, lineProfile]);

  const handleAccept = async () => {
    if (!lineProfile || !inviteData) return;
    setStatus("accepting");
    try {
      const res = await apiRequest("POST", "/api/partner/accept", {
        token,
        userId: lineProfile.userId,
        displayName: lineProfile.displayName,
        pictureUrl: lineProfile.pictureUrl || null,
      });
      const data = await res.json();
      setPartnerResult({
        partnerDisplayName: data.partnerDisplayName,
        anniversaryDate: data.anniversaryDate,
      });
      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err?.message || "Failed to accept invite");
    }
  };

  return (
    <div className="w-full min-h-[100dvh] bg-[#FCFCFC] dark:bg-background flex items-center justify-center p-6" data-testid="partner-accept-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-white dark:bg-card rounded-[28px] p-8 text-center border border-black/[0.04] dark:border-border"
        style={{ boxShadow: "0 4px 30px rgba(0,0,0,0.06)" }}
      >
        {status === "loading" && (
          <div className="py-10" data-testid="loading-state">
            <Loader2 className="w-8 h-8 animate-spin text-pink-400 mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Loading invite...</p>
          </div>
        )}

        {status === "preview" && inviteData && (
          <div data-testid="preview-state">
            <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center">
              {inviteData.fromPictureUrl ? (
                <img src={inviteData.fromPictureUrl} alt={inviteData.fromDisplayName} className="w-full h-full object-cover" />
              ) : (
                <Heart className="w-8 h-8 text-pink-400" />
              )}
            </div>
            <h2 className="text-xl font-bold tracking-tight mb-1" data-testid="text-invite-from">
              {inviteData.fromDisplayName}
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              wants to connect as your Toast partner
            </p>

            {!lineProfile ? (
              <div className="bg-amber-50 dark:bg-amber-950/30 rounded-2xl p-4 mb-4">
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Open this link in LINE to accept the partner invite
                </p>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => navigate("/profile")}
                  className="flex-1 py-3.5 rounded-2xl bg-gray-100 dark:bg-muted text-foreground font-semibold text-sm active:scale-[0.97] transition-transform"
                  data-testid="button-decline-partner"
                >
                  Decline
                </button>
                <button
                  onClick={handleAccept}
                  className="flex-1 py-3.5 rounded-2xl text-white font-semibold text-sm active:scale-[0.97] transition-transform flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg, #EC407A, #F06292)", boxShadow: "0 4px 14px rgba(236,64,122,0.3)" }}
                  data-testid="button-accept-partner"
                >
                  <Heart className="w-4 h-4" />
                  Accept
                </button>
              </div>
            )}
          </div>
        )}

        {status === "accepting" && (
          <div className="py-10" data-testid="accepting-state">
            <Loader2 className="w-8 h-8 animate-spin text-pink-400 mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Connecting partners...</p>
          </div>
        )}

        {status === "success" && partnerResult && (
          <div data-testid="success-state">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #EC407A, #F06292)" }}>
              <Check className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold tracking-tight mb-1">Connected!</h2>
            <p className="text-sm text-muted-foreground mb-2">
              You and {partnerResult.partnerDisplayName} are now Toast partners
            </p>
            <p className="text-xs text-pink-400 font-medium mb-6">
              Anniversary: {new Date(partnerResult.anniversaryDate).toLocaleDateString()}
            </p>
            <button
              onClick={() => navigate("/profile")}
              className="w-full py-3.5 rounded-2xl bg-foreground text-white font-semibold text-sm active:scale-[0.97] transition-transform"
              style={{ boxShadow: "0 4px 14px rgba(0,0,0,0.15)" }}
              data-testid="button-go-profile"
            >
              Go to Profile
            </button>
          </div>
        )}

        {status === "expired" && (
          <div data-testid="expired-state">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-amber-500" />
            </div>
            <h2 className="text-xl font-bold tracking-tight mb-1">Invite Expired</h2>
            <p className="text-sm text-muted-foreground mb-6">
              This partner invite has expired. Ask your partner to send a new one.
            </p>
            <button
              onClick={() => navigate("/profile")}
              className="w-full py-3.5 rounded-2xl bg-gray-100 dark:bg-muted text-foreground font-semibold text-sm active:scale-[0.97] transition-transform"
              data-testid="button-back-profile"
            >
              Back to Profile
            </button>
          </div>
        )}

        {status === "self" && (
          <div data-testid="self-state">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center">
              <Heart className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-xl font-bold tracking-tight mb-1">That's Your Invite!</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Share this link with your partner so they can accept it.
            </p>
            <button
              onClick={() => navigate("/profile")}
              className="w-full py-3.5 rounded-2xl bg-gray-100 dark:bg-muted text-foreground font-semibold text-sm active:scale-[0.97] transition-transform"
              data-testid="button-back-profile-self"
            >
              Back to Profile
            </button>
          </div>
        )}

        {status === "error" && (
          <div data-testid="error-state">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 bg-red-100 dark:bg-red-950/30 flex items-center justify-center">
              <X className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-xl font-bold tracking-tight mb-1">Something Went Wrong</h2>
            <p className="text-sm text-muted-foreground mb-6">{errorMsg}</p>
            <button
              onClick={() => navigate("/profile")}
              className="w-full py-3.5 rounded-2xl bg-gray-100 dark:bg-muted text-foreground font-semibold text-sm active:scale-[0.97] transition-transform"
              data-testid="button-back-profile-error"
            >
              Back to Profile
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
