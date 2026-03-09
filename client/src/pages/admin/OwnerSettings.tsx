import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAdminSession } from "./AdminLayout";
import { useToast } from "@/hooks/use-toast";
import {
  Settings2,
  User,
  Mail,
  Phone,
  Building,
  ShieldCheck,
  Crown,
  Save,
  Key,
  Bell,
  Globe,
  CreditCard,
  ChevronRight,
} from "lucide-react";

function getOwnerHeaders() {
  const session = getAdminSession();
  if (!session || session.sessionType !== "owner") return {};
  return { "x-owner-token": btoa(`${session.email}:`) };
}

export default function OwnerSettings() {
  const session = getAdminSession();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"profile" | "notifications" | "subscription">("profile");

  const { data: dashData, isLoading } = useQuery<any>({
    queryKey: ["/api/admin/owner/dashboard"],
    queryFn: async () => {
      const res = await fetch("/api/admin/owner/dashboard", {
        headers: getOwnerHeaders() as Record<string, string>,
      });
      if (!res.ok) throw new Error("Failed to load");
      return res.json();
    },
    enabled: session?.sessionType === "owner",
  });

  const owner = dashData?.owner;

  const [profile, setProfile] = useState({
    displayName: "",
    email: "",
    phone: "",
    language: "en",
  });

  const [notifSettings, setNotifSettings] = useState({
    newReviews: true,
    campaignUpdates: true,
    weeklyReport: true,
    milestones: true,
    tips: false,
    lineNotifications: true,
  });

  if (!session || session.sessionType !== "owner") {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400" data-testid="text-access-denied">This page is only accessible to restaurant owners.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-32 animate-pulse" />
        ))}
      </div>
    );
  }

  const tabs = [
    { key: "profile" as const, label: "Profile", icon: User },
    { key: "notifications" as const, label: "Notifications", icon: Bell },
    { key: "subscription" as const, label: "Subscription", icon: CreditCard },
  ];

  const tierInfo: Record<string, { name: string; price: string; features: string[] }> = {
    free: {
      name: "Free",
      price: "฿0/mo",
      features: ["Basic listing", "View analytics", "Reply to reviews"],
    },
    basic: {
      name: "Basic",
      price: "฿990/mo",
      features: ["Everything in Free", "Run promotions", "Priority support", "Verified badge"],
    },
    premium: {
      name: "Premium",
      price: "฿2,490/mo",
      features: ["Everything in Basic", "Featured placement", "Advanced analytics", "Custom branding"],
    },
    enterprise: {
      name: "Enterprise",
      price: "Custom",
      features: ["Everything in Premium", "Multi-location", "Dedicated manager", "API access"],
    },
  };

  const currentTier = owner?.subscriptionTier || "free";

  return (
    <div className="space-y-6" data-testid="owner-settings-page">
      <div className="flex items-center gap-3">
        <Settings2 className="w-5 h-5 text-[#FFCC02]" />
        <div>
          <h2 className="text-xl font-semibold text-gray-800" data-testid="text-settings-title">Settings</h2>
          <p className="text-xs text-gray-400">Manage your account and preferences</p>
        </div>
      </div>

      <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-0.5 w-fit">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`text-xs font-medium px-4 py-2 rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === key
                ? "bg-white text-gray-800 shadow-sm"
                : "text-gray-400 hover:text-gray-600"
            }`}
            data-testid={`tab-${key}`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {activeTab === "profile" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6" data-testid="section-profile-info">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-[3px] h-4 bg-[#FFCC02] rounded-full" />
              <h3 className="text-[15px] font-semibold text-gray-800">Profile Information</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block flex items-center gap-1">
                  <User className="w-3 h-3" /> Display Name
                </label>
                <input
                  type="text"
                  value={profile.displayName || owner?.displayName || ""}
                  onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                  className="w-full text-sm border border-gray-100 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#FFCC02]/30"
                  data-testid="input-display-name"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block flex items-center gap-1">
                  <Mail className="w-3 h-3" /> Email
                </label>
                <input
                  type="email"
                  value={owner?.email || ""}
                  disabled
                  className="w-full text-sm border border-gray-100 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-400"
                  data-testid="input-email"
                />
                <p className="text-[10px] text-gray-300 mt-1">Contact support to change your email</p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block flex items-center gap-1">
                  <Phone className="w-3 h-3" /> Phone Number
                </label>
                <input
                  type="tel"
                  value={profile.phone || owner?.phone || ""}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  placeholder="+66 XXX-XXX-XXXX"
                  className="w-full text-sm border border-gray-100 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#FFCC02]/30"
                  data-testid="input-phone"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block flex items-center gap-1">
                  <Globe className="w-3 h-3" /> Language
                </label>
                <select
                  value={profile.language}
                  onChange={(e) => setProfile({ ...profile, language: e.target.value })}
                  className="w-full text-sm border border-gray-100 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#FFCC02]/30 bg-white"
                  data-testid="select-language"
                >
                  <option value="en">English</option>
                  <option value="th">ไทย (Thai)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end mt-5">
              <button
                onClick={() => toast({ title: "Profile saved", description: "Your changes have been saved." })}
                className="bg-[#FFCC02] text-gray-900 font-medium rounded-xl px-5 py-2 hover:bg-[#FFCC02]/90 transition-colors flex items-center gap-1.5 text-sm shadow-sm"
                data-testid="button-save-profile"
              >
                <Save className="w-3.5 h-3.5" /> Save
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6" data-testid="section-security">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-[3px] h-4 bg-[#6C2BD9] rounded-full" />
              <h3 className="text-[15px] font-semibold text-gray-800">Security</h3>
            </div>
            <button
              onClick={() => toast({ title: "Password reset email sent", description: "Check your email for the reset link." })}
              className="flex items-center justify-between w-full p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
              data-testid="button-change-password"
            >
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700">Change Password</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </button>
          </div>
        </div>
      )}

      {activeTab === "notifications" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6" data-testid="section-notification-settings">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-[3px] h-4 bg-[#FFCC02] rounded-full" />
            <h3 className="text-[15px] font-semibold text-gray-800">Notification Preferences</h3>
          </div>

          <div className="space-y-1">
            {[
              { key: "newReviews" as const, label: "New Reviews", desc: "Get notified when someone reviews your restaurant" },
              { key: "campaignUpdates" as const, label: "Campaign Updates", desc: "Milestone and performance alerts for your promotions" },
              { key: "weeklyReport" as const, label: "Weekly Report", desc: "Receive a weekly summary of your restaurant's performance" },
              { key: "milestones" as const, label: "Milestones", desc: "Celebrate when you hit view, save, or like milestones" },
              { key: "tips" as const, label: "Tips & Suggestions", desc: "Get actionable tips to improve your listing" },
              { key: "lineNotifications" as const, label: "LINE Notifications", desc: "Receive notifications via LINE Official Account" },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm text-gray-700">{label}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifSettings[key]}
                    onChange={(e) => setNotifSettings({ ...notifSettings, [key]: e.target.checked })}
                    className="sr-only peer"
                    data-testid={`toggle-${key}`}
                  />
                  <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-[#FFCC02] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
                </label>
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-5">
            <button
              onClick={() => toast({ title: "Preferences saved" })}
              className="bg-[#FFCC02] text-gray-900 font-medium rounded-xl px-5 py-2 hover:bg-[#FFCC02]/90 transition-colors flex items-center gap-1.5 text-sm shadow-sm"
              data-testid="button-save-notifications"
            >
              <Save className="w-3.5 h-3.5" /> Save
            </button>
          </div>
        </div>
      )}

      {activeTab === "subscription" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6" data-testid="section-current-plan">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-[3px] h-4 bg-[#FFCC02] rounded-full" />
              <h3 className="text-[15px] font-semibold text-gray-800">Current Plan</h3>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-[#FFCC02]/[0.06] border border-[#FFCC02]/20">
              <Crown className="w-5 h-5 text-[#FFCC02]" />
              <div>
                <p className="text-sm font-semibold text-gray-800">{tierInfo[currentTier]?.name || "Free"}</p>
                <p className="text-xs text-gray-500">{tierInfo[currentTier]?.price || "฿0/mo"}</p>
              </div>
              {owner?.isVerified && (
                <span className="ml-auto inline-flex items-center gap-1 text-xs font-medium rounded-full px-2.5 py-0.5 bg-[#00B14F]/10 text-[#00B14F]">
                  <ShieldCheck className="w-3 h-3" /> Verified
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3" data-testid="section-plans">
            {Object.entries(tierInfo).map(([tier, info]) => {
              const isCurrent = tier === currentTier;
              return (
                <div
                  key={tier}
                  className={`rounded-2xl border p-5 transition-all ${
                    isCurrent
                      ? "border-[#FFCC02] bg-[#FFCC02]/[0.04] shadow-sm"
                      : "border-gray-100 bg-white hover:border-gray-200"
                  }`}
                  data-testid={`plan-${tier}`}
                >
                  <p className="text-sm font-semibold text-gray-800">{info.name}</p>
                  <p className="text-lg font-bold text-gray-800 mt-1">{info.price}</p>
                  <ul className="mt-3 space-y-1.5">
                    {info.features.map((f) => (
                      <li key={f} className="text-[11px] text-gray-500 flex items-start gap-1.5">
                        <span className="text-[#00B14F] mt-0.5">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`w-full mt-4 text-xs font-medium rounded-lg py-2 transition-colors ${
                      isCurrent
                        ? "bg-gray-100 text-gray-400 cursor-default"
                        : "bg-[#FFCC02] text-gray-900 hover:bg-[#FFCC02]/90"
                    }`}
                    disabled={isCurrent}
                    onClick={() => !isCurrent && toast({ title: "Upgrade requested", description: "Our team will contact you shortly." })}
                    data-testid={`button-select-${tier}`}
                  >
                    {isCurrent ? "Current Plan" : "Upgrade"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
