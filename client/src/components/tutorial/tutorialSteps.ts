import type { TutorialFeatureId } from "@/lib/tutorialState";
import soloVibe from "@/assets/tutorial/solo-1-vibe.jpg";
import soloSwipe from "@/assets/tutorial/solo-2-swipe.jpg";
import soloProfile from "@/assets/tutorial/solo-3-profile.jpg";
import soloPicks from "@/assets/tutorial/solo-4-picks.jpg";
import groupSetup from "@/assets/tutorial/group-1-setup.jpg";
import groupWaiting from "@/assets/tutorial/group-3-waiting.jpg";
import groupSwipe from "@/assets/tutorial/group-4-swipe.jpg";
import trendingShot from "@/assets/tutorial/trending-1.jpg";

export interface TutorialStep {
  title: string;
  subtitle: string;
  mascot?: string;
  bubble?: string;
  cta: string;
  /** Static screenshot rendered as the step background. */
  screenshot: string;
  /** Optional inline illustration node id (handled in overlay). */
  illustration?: "tasteDna" | "confetti" | "phones" | "reroll" | "trendChips";
}

export interface TutorialFlow {
  id: TutorialFeatureId;
  title: string;
  /** Where to land the user after completion / skip. */
  finishPath: string;
  steps: TutorialStep[];
}

export const TUTORIAL_FLOWS: Record<TutorialFeatureId, TutorialFlow> = {
  solo: {
    id: "solo",
    title: "Solo Play",
    finishPath: "/solo",
    steps: [
      {
        title: "Pick your vibe.",
        subtitle: "Tell Toast what kind of meal you're feeling.",
        mascot: "toast",
        bubble: "Start with your mood. Toast gets smarter from there.",
        cta: "Next",
        screenshot: soloVibe,
      },
      {
        title: "Swipe what looks good.",
        subtitle: "Right for yes. Left for nope.",
        mascot: "toast",
        bubble: "Yup, that's a yes. No hard feelings on the lefts.",
        cta: "Got it",
        screenshot: soloSwipe,
      },
      {
        title: "Toast learns your Taste DNA.",
        subtitle: "Your swipes turn into better picks.",
        mascot: "toast",
        bubble: "Spicy. Cozy. Noodle mood. Toast remembers.",
        cta: "Show me how",
        screenshot: soloProfile,
        illustration: "tasteDna",
      },
      {
        title: "From craving to place.",
        subtitle: "Toast turns your food mood into real spots nearby.",
        mascot: "toast",
        bubble: "You swipe the food. Toast finds the place.",
        cta: "Start Solo Play",
        screenshot: soloPicks,
      },
    ],
  },
  group: {
    id: "group",
    title: "Group Play",
    finishPath: "/group/setup",
    steps: [
      {
        title: "Set the food mission.",
        subtitle: "Pick the basics before inviting the hungry ones.",
        mascot: "popcorn",
        bubble: "The host sets the rules. Everyone else brings opinions.",
        cta: "Next",
        screenshot: groupSetup,
      },
      {
        title: "Invite through LINE.",
        subtitle: "Send the session link straight to your friends.",
        mascot: "popcorn",
        bubble: "Tap. Send. Wait for the chaos.",
        cta: "Next",
        screenshot: groupSetup,
      },
      {
        title: "Wait for the crew.",
        subtitle: "Friends appear here before swiping starts.",
        mascot: "popcorn",
        bubble: "Start when enough people are in.",
        cta: "Start demo swipe",
        screenshot: groupWaiting,
      },
      {
        title: "Everyone swipes separately.",
        subtitle: "No pressure. No awkward voting yet.",
        mascot: "popcorn",
        bubble: "Toast looks for overlap.",
        cta: "Find match",
        screenshot: groupSwipe,
        illustration: "phones",
      },
      {
        title: "Match found.",
        subtitle: "Toast found something the group can agree on.",
        mascot: "popcorn",
        bubble: "Finally. A decision without 47 messages.",
        cta: "Next",
        screenshot: groupSwipe,
        illustration: "confetti",
      },
      {
        title: "No match? No problem.",
        subtitle: "Adjust the rules and Toast will try again.",
        mascot: "popcorn",
        bubble: "Toast helps the group escape decision jail.",
        cta: "Start Group Play",
        screenshot: groupSwipe,
        illustration: "reroll",
      },
    ],
  },
  trending: {
    id: "trending",
    title: "Trending",
    finishPath: "/trending",
    steps: [
      {
        title: "See what's hot.",
        subtitle: "Menus and places people are loving right now.",
        mascot: "toast",
        bubble: "Trending. Popular nearby. Group favorite.",
        cta: "Next",
        screenshot: trendingShot,
      },
      {
        title: "Tap anything that catches your eye.",
        subtitle: "Toast can turn trends into your next meal.",
        mascot: "toast",
        bubble: "Tags, prices, and the spots serving it — all in one tap.",
        cta: "Next",
        screenshot: trendingShot,
      },
      {
        title: "Use it your way.",
        subtitle: "Start solo or send it to the group.",
        mascot: "toast",
        bubble: "Trends are just the shortcut. You still get to choose.",
        cta: "Explore Trending",
        screenshot: trendingShot,
        illustration: "trendChips",
      },
    ],
  },
};
