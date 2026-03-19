import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

export default function TeamMemberActivate() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [status, setStatus] = useState<"loading" | "valid" | "invalid" | "activated" | "error">("loading");
  const [tokenInfo, setTokenInfo] = useState<{ email: string; displayName: string; role: string; restaurantName?: string } | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const params = new URLSearchParams(window.location.search);
  const token = params.get("token") || "";

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }
    fetch(`/api/owner/team/validate-token/${token}`)
      .then((res) => {
        if (!res.ok) throw new Error("Invalid token");
        return res.json();
      })
      .then((data) => {
        setTokenInfo(data);
        setStatus("valid");
      })
      .catch(() => setStatus("invalid"));
  }, [token]);

  const handleActivate = async () => {
    if (password.length < 6) {
      toast({ title: "Password too short", description: "Please use at least 6 characters.", variant: "destructive" });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: "Passwords don't match", description: "Please make sure both passwords are the same.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/owner/team/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Activation failed" }));
        throw new Error(err.message);
      }
      setStatus("activated");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFCFC] flex items-center justify-center p-4" data-testid="team-activate-page">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm max-w-md w-full p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#FFCC02]/15 flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl font-bold text-[#FFCC02]">T</span>
          </div>
          <h1 className="text-lg font-semibold text-gray-800" data-testid="text-activate-title">Toast Team Activation</h1>
        </div>

        {status === "loading" && (
          <div className="text-center py-8" data-testid="section-loading">
            <Loader2 className="w-8 h-8 animate-spin text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-400">Validating your invitation...</p>
          </div>
        )}

        {status === "invalid" && (
          <div className="text-center py-8" data-testid="section-invalid">
            <XCircle className="w-10 h-10 text-red-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-700">Invalid or Expired Invitation</p>
            <p className="text-xs text-gray-400 mt-1">This invitation link is no longer valid. Please ask your team owner to send a new invite.</p>
          </div>
        )}

        {status === "error" && (
          <div className="text-center py-8" data-testid="section-error">
            <XCircle className="w-10 h-10 text-red-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-700">Activation Failed</p>
            <p className="text-xs text-gray-400 mt-1">Something went wrong. Please try again or contact your team owner.</p>
          </div>
        )}

        {status === "valid" && tokenInfo && (
          <div className="space-y-5" data-testid="section-activate-form">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                You've been invited to join as <span className="font-semibold text-[#00B14F]">{tokenInfo.role}</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">{tokenInfo.email}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-400">Welcome,</p>
              <p className="text-base font-semibold text-gray-800">{tokenInfo.displayName}</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Create Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full text-sm border border-gray-200 rounded-xl pl-9 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#00B14F]/30 focus:border-[#00B14F]"
                    data-testid="input-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
                    data-testid="button-toggle-password"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full text-sm border border-gray-200 rounded-xl pl-9 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#00B14F]/30 focus:border-[#00B14F]"
                    data-testid="input-confirm-password"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleActivate}
              disabled={submitting || !password || !confirmPassword}
              className="w-full bg-[#00B14F] text-white text-sm font-medium rounded-xl py-3 hover:bg-[#00B14F]/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              data-testid="button-activate-account"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              Activate My Account
            </button>
          </div>
        )}

        {status === "activated" && (
          <div className="text-center py-8" data-testid="section-activated">
            <CheckCircle2 className="w-10 h-10 text-[#00B14F] mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-700">Account Activated!</p>
            <p className="text-xs text-gray-400 mt-2">Your team account is now active. You can now log in to the owner dashboard.</p>
            <button
              onClick={() => navigate("/admin/login")}
              className="mt-4 bg-[#FFCC02] text-gray-900 text-sm font-medium rounded-xl px-6 py-2.5 hover:bg-[#FFCC02]/90 transition-colors"
              data-testid="button-go-to-login"
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
