import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import { lazy, Suspense } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { SessionBar } from "@/components/SessionBar";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";

const Onboarding = lazy(() => import("@/pages/Onboarding"));
const SoloJourney = lazy(() => import("@/pages/SoloJourney"));
const SoloQuiz = lazy(() => import("@/pages/SoloQuiz"));
const SoloResults = lazy(() => import("@/pages/SoloResults"));
const RestaurantList = lazy(() => import("@/pages/RestaurantList"));
const GroupSetup = lazy(() => import("@/pages/GroupSetup"));
const GroupTaste = lazy(() => import("@/pages/GroupTaste"));
const WaitingRoom = lazy(() => import("@/pages/WaitingRoom"));
const GroupSwipe = lazy(() => import("@/pages/GroupSwipe"));
const SwipePage = lazy(() => import("@/pages/SwipePage"));
const TrendingFeed = lazy(() => import("@/pages/TrendingFeed"));
const RestaurantDetail = lazy(() => import("@/pages/RestaurantDetail"));
const Profile = lazy(() => import("@/pages/Profile"));
const ToastPicks = lazy(() => import("@/pages/ToastPicks"));
const CampaignDetail = lazy(() => import("@/pages/CampaignDetail"));
const SavedLists = lazy(() => import("@/pages/SavedLists"));
const LegalCenter = lazy(() => import("@/pages/LegalCenter"));
const LegalDocumentViewer = lazy(() => import("@/pages/LegalDocumentViewer"));
const PartnerAccept = lazy(() => import("@/pages/PartnerAccept"));
const TeamMemberActivate = lazy(() => import("@/pages/TeamMemberActivate"));
const Contact = lazy(() => import("@/pages/Contact"));
const HelpHub = lazy(() => import("@/pages/HelpHub"));
const AdminContactSubmissions = lazy(() => import("@/pages/admin/AdminContactSubmissions"));

const AdminLogin = lazy(() => import("@/pages/admin/AdminLogin"));
const AdminLayout = lazy(() => import("@/pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const AdminUsers = lazy(() => import("@/pages/admin/AdminUsers"));
const AdminRestaurants = lazy(() => import("@/pages/admin/AdminRestaurants"));
const AdminCampaigns = lazy(() => import("@/pages/admin/AdminCampaigns"));
const AdminBanners = lazy(() => import("@/pages/admin/AdminBanners"));
const AdminAnalytics = lazy(() => import("@/pages/admin/AdminAnalytics"));
const AdminConfig = lazy(() => import("@/pages/admin/AdminConfig"));
const AdminPayments = lazy(() => import("@/pages/admin/AdminPayments"));
const AdminSwipeSessions = lazy(() => import("@/pages/admin/AdminSwipeSessions"));
const AdminMenus = lazy(() => import("@/pages/admin/AdminMenus"));
const AdminOwners = lazy(() => import("@/pages/admin/AdminOwners"));
const AdminPartnerClickouts = lazy(() => import("@/pages/admin/AdminPartnerClickouts"));
const AdminFoodTrends = lazy(() => import("@/pages/admin/AdminFoodTrends"));
const AdminGeography = lazy(() => import("@/pages/admin/AdminGeography"));
const AdminPredictiveIntelligence = lazy(() => import("@/pages/admin/AdminPredictiveIntelligence"));
const AdminDataOps = lazy(() => import("@/pages/admin/AdminDataOps"));
const AdminReports = lazy(() => import("@/pages/admin/AdminReports"));
const AdminAuditLogs = lazy(() => import("@/pages/admin/AdminAuditLogs"));
const AdminOwnerDashboard = lazy(() => import("@/pages/admin/AdminOwnerDashboard"));
const OwnerMenu = lazy(() => import("@/pages/admin/OwnerMenu"));
const OwnerReviews = lazy(() => import("@/pages/admin/OwnerReviews"));
const OwnerPromotions = lazy(() => import("@/pages/admin/OwnerPromotions"));
const OwnerPerformance = lazy(() => import("@/pages/admin/OwnerPerformance"));
const OwnerInsights = lazy(() => import("@/pages/admin/OwnerInsights"));
const OwnerNotifications = lazy(() => import("@/pages/admin/OwnerNotifications"));
const OwnerSupport = lazy(() => import("@/pages/admin/OwnerSupport"));
const OwnerSettings = lazy(() => import("@/pages/admin/OwnerSettings"));
const OwnerDecisionIntelligence = lazy(() => import("@/pages/admin/OwnerDecisionIntelligence"));
const OwnerDeliveryConversions = lazy(() => import("@/pages/admin/OwnerDeliveryConversions"));
const OwnerCustomerInsights = lazy(() => import("@/pages/admin/OwnerCustomerInsights"));
const OwnerBilling = lazy(() => import("@/pages/admin/OwnerBilling"));

function AnimatedPage({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full animate-page-in">
      {children}
    </div>
  );
}

function PageLoader() {
  return (
    <div className="w-full h-[100dvh] flex items-center justify-center bg-[#FCFCFC]">
      <div className="w-7 h-7 rounded-full border-2 border-gray-200 border-t-[#FFCC02] animate-spin" />
    </div>
  );
}

const SESSION_BAR_HIDDEN_PREFIXES = ["/admin", "/onboarding", "/group/waiting", "/group/swipe", "/group/setup", "/group/taste"];

function GlobalSessionBar() {
  const [location] = useLocation();
  const hidden = SESSION_BAR_HIDDEN_PREFIXES.some((p) => location.startsWith(p));
  if (hidden) return null;
  return <SessionBar />;
}

function Router() {
  const [location] = useLocation();

  return (
    <Suspense fallback={<PageLoader />}>
        <GlobalSessionBar />
        <Switch location={location}>
          <Route path="/">
            <AnimatedPage><Home /></AnimatedPage>
          </Route>
          <Route path="/onboarding">
            <AnimatedPage><Onboarding /></AnimatedPage>
          </Route>
          <Route path="/solo">
            <AnimatedPage><SoloJourney /></AnimatedPage>
          </Route>
          <Route path="/solo/quiz">
            <AnimatedPage><SoloQuiz /></AnimatedPage>
          </Route>
          <Route path="/solo/results">
            <AnimatedPage><SoloResults /></AnimatedPage>
          </Route>
          <Route path="/restaurants">
            <AnimatedPage><RestaurantList /></AnimatedPage>
          </Route>
          <Route path="/restaurant/:id">
            <AnimatedPage><RestaurantDetail /></AnimatedPage>
          </Route>
          <Route path="/campaign/:id">
            <AnimatedPage><CampaignDetail /></AnimatedPage>
          </Route>
          <Route path="/group/setup">
            <AnimatedPage><GroupSetup /></AnimatedPage>
          </Route>
          <Route path="/group/taste">
            <AnimatedPage><GroupTaste /></AnimatedPage>
          </Route>
          <Route path="/group/waiting">
            <AnimatedPage><WaitingRoom /></AnimatedPage>
          </Route>
          <Route path="/group/swipe">
            <AnimatedPage><GroupSwipe /></AnimatedPage>
          </Route>
          <Route path="/trending">
            <TrendingFeed />
          </Route>
          <Route path="/swipe">
            <AnimatedPage><SwipePage /></AnimatedPage>
          </Route>
          <Route path="/profile">
            <AnimatedPage><Profile /></AnimatedPage>
          </Route>
          <Route path="/legal">
            <AnimatedPage><LegalCenter /></AnimatedPage>
          </Route>
          <Route path="/legal/:slug">
            <AnimatedPage><LegalDocumentViewer /></AnimatedPage>
          </Route>
          <Route path="/toast-picks">
            <AnimatedPage><ToastPicks /></AnimatedPage>
          </Route>
          <Route path="/saved">
            <AnimatedPage><SavedLists /></AnimatedPage>
          </Route>
          <Route path="/partner/accept">
            <AnimatedPage><PartnerAccept /></AnimatedPage>
          </Route>
          <Route path="/team/activate">
            <Suspense fallback={<PageLoader />}><TeamMemberActivate /></Suspense>
          </Route>
          <Route path="/contact">
            <Suspense fallback={<PageLoader />}><Contact /></Suspense>
          </Route>
          <Route path="/help">
            <Suspense fallback={<PageLoader />}><HelpHub /></Suspense>
          </Route>
          <Route path="/admin/login">
            <AdminLogin />
          </Route>
          <Route path="/admin/dashboard">
            <Suspense fallback={<PageLoader />}><AdminLayout><AdminDashboard /></AdminLayout></Suspense>
          </Route>
          <Route path="/admin/users">
            <Suspense fallback={<PageLoader />}><AdminLayout><AdminUsers /></AdminLayout></Suspense>
          </Route>
          <Route path="/admin/restaurants">
            <Suspense fallback={<PageLoader />}><AdminLayout><AdminRestaurants /></AdminLayout></Suspense>
          </Route>
          <Route path="/admin/campaigns">
            <Suspense fallback={<PageLoader />}><AdminLayout><AdminCampaigns /></AdminLayout></Suspense>
          </Route>
          <Route path="/admin/banners">
            <Suspense fallback={<PageLoader />}><AdminLayout><AdminBanners /></AdminLayout></Suspense>
          </Route>
          <Route path="/admin/analytics">
            <Suspense fallback={<PageLoader />}><AdminLayout><AdminAnalytics /></AdminLayout></Suspense>
          </Route>
          <Route path="/admin/payments">
            <Suspense fallback={<PageLoader />}><AdminLayout><AdminPayments /></AdminLayout></Suspense>
          </Route>
          <Route path="/admin/config">
            <Suspense fallback={<PageLoader />}><AdminLayout><AdminConfig /></AdminLayout></Suspense>
          </Route>
          <Route path="/admin/swipe-sessions">
            <Suspense fallback={<PageLoader />}><AdminLayout><AdminSwipeSessions /></AdminLayout></Suspense>
          </Route>
          <Route path="/admin/menus">
            <Suspense fallback={<PageLoader />}><AdminLayout><AdminMenus /></AdminLayout></Suspense>
          </Route>
          <Route path="/admin/owners">
            <Suspense fallback={<PageLoader />}><AdminLayout><AdminOwners /></AdminLayout></Suspense>
          </Route>
          <Route path="/admin/partner-clickouts">
            <Suspense fallback={<PageLoader />}><AdminLayout><AdminPartnerClickouts /></AdminLayout></Suspense>
          </Route>
          <Route path="/admin/food-trends">
            <Suspense fallback={<PageLoader />}><AdminLayout><AdminFoodTrends /></AdminLayout></Suspense>
          </Route>
          <Route path="/admin/geography">
            <Suspense fallback={<PageLoader />}><AdminLayout><AdminGeography /></AdminLayout></Suspense>
          </Route>
          <Route path="/admin/predictive">
            <Suspense fallback={<PageLoader />}><AdminLayout><AdminPredictiveIntelligence /></AdminLayout></Suspense>
          </Route>
          <Route path="/admin/data-ops">
            <Suspense fallback={<PageLoader />}><AdminLayout><AdminDataOps /></AdminLayout></Suspense>
          </Route>
          <Route path="/admin/integrations">
            <Suspense fallback={<PageLoader />}><AdminLayout><AdminConfig /></AdminLayout></Suspense>
          </Route>
          <Route path="/admin/reports">
            <Suspense fallback={<PageLoader />}><AdminLayout><AdminReports /></AdminLayout></Suspense>
          </Route>
          <Route path="/admin/audit-logs">
            <Suspense fallback={<PageLoader />}><AdminLayout><AdminAuditLogs /></AdminLayout></Suspense>
          </Route>
          <Route path="/admin/contact-submissions">
            <Suspense fallback={<PageLoader />}><AdminLayout><AdminContactSubmissions /></AdminLayout></Suspense>
          </Route>
          <Route path="/admin/my-restaurant">
            <Suspense fallback={<PageLoader />}><AdminLayout><AdminOwnerDashboard /></AdminLayout></Suspense>
          </Route>
          <Route path="/admin/owner/menu">
            <Suspense fallback={<PageLoader />}><AdminLayout><OwnerMenu /></AdminLayout></Suspense>
          </Route>
          <Route path="/admin/owner/reviews">
            <Suspense fallback={<PageLoader />}><AdminLayout><OwnerReviews /></AdminLayout></Suspense>
          </Route>
          <Route path="/admin/owner/promotions">
            <Suspense fallback={<PageLoader />}><AdminLayout><OwnerPromotions /></AdminLayout></Suspense>
          </Route>
          <Route path="/admin/owner/performance">
            <Suspense fallback={<PageLoader />}><AdminLayout><OwnerPerformance /></AdminLayout></Suspense>
          </Route>
          <Route path="/admin/owner/insights">
            <Suspense fallback={<PageLoader />}><AdminLayout><OwnerInsights /></AdminLayout></Suspense>
          </Route>
          <Route path="/admin/owner/notifications">
            <Suspense fallback={<PageLoader />}><AdminLayout><OwnerNotifications /></AdminLayout></Suspense>
          </Route>
          <Route path="/admin/owner/support">
            <Suspense fallback={<PageLoader />}><AdminLayout><OwnerSupport /></AdminLayout></Suspense>
          </Route>
          <Route path="/admin/owner/settings">
            <Suspense fallback={<PageLoader />}><AdminLayout><OwnerSettings /></AdminLayout></Suspense>
          </Route>
          <Route path="/admin/owner/decision-intelligence">
            <Suspense fallback={<PageLoader />}><AdminLayout><OwnerDecisionIntelligence /></AdminLayout></Suspense>
          </Route>
          <Route path="/admin/owner/delivery-conversions">
            <Suspense fallback={<PageLoader />}><AdminLayout><OwnerDeliveryConversions /></AdminLayout></Suspense>
          </Route>
          <Route path="/admin/owner/customer-insights">
            <Suspense fallback={<PageLoader />}><AdminLayout><OwnerCustomerInsights /></AdminLayout></Suspense>
          </Route>
          <Route path="/admin/owner/billing">
            <Suspense fallback={<PageLoader />}><AdminLayout><OwnerBilling /></AdminLayout></Suspense>
          </Route>
          <Route path="/admin">
            <Redirect to="/admin/dashboard" />
          </Route>
          <Route>
            <AnimatedPage><NotFound /></AnimatedPage>
          </Route>
        </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
