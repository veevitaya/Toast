import type { TutorialFeatureId } from "@/lib/tutorialState";

export interface TutorialStep {
  title: string;
  subtitle: string;
  mascot?: string;
  bubble?: string;
  cta: string;
  /** Optional path to navigate to before showing this step. */
  navigateTo?: string;
  /** Optional data-tour attribute value to spotlight. */
  spotlight?: string;
  /** Optional inline illustration node id (handled in overlay). */
  illustration?: "tasteDna" | "confetti" | "phones" | "reroll" | "trendChips";
}

export interface TutorialFlow {
  id: TutorialFeatureId;
  title: string;
  startPath: string;
  /** Where to land the user after the final step's CTA. */
  finishPath: string;
  steps: TutorialStep[];
}

export const TUTORIAL_FLOWS: Record<TutorialFeatureId, TutorialFlow> = {
  solo: {
    id: "solo",
    title: "Solo Play",
    startPath: "/",
    finishPath: "/",
    steps: [
      {
        title: "Pick your vibe.",
        subtitle: "Tell Toast what kind of meal you're feeling.",
        mascot: "toast",
        bubble: "Start with your mood. Toast gets smarter from there.",
        cta: "Next",
        navigateTo: "/",
        spotlight: "toast-decides",
      },
      {
        title: "Swipe what looks good.",
        subtitle: "Right for yes. Left for nope.",
        mascot: "toast",
        bubble: "Yup, that's a yes. No hard feelings on the lefts.",
        cta: "Got it",
        navigateTo: "/swipe?mode=mood",
        spotlight: "swipe-deck",
      },
      {
        title: "Toast learns your Taste DNA.",
        subtitle: "Your swipes turn into better picks.",
        mascot: "toast",
        bubble: "Spicy. Cozy. Noodle mood. Toast remembers.",
        cta: "Show me how",
        navigateTo: "/profile",
        illustration: "tasteDna",
      },
      {
        title: "From craving to place.",
        subtitle: "Toast turns your food mood into real spots nearby.",
        mascot: "toast",
        bubble: "You swipe the food. Toast finds the place.",
        cta: "Start Solo Play",
        navigateTo: "/toast-picks",
      },
    ],
  },
  group: {
    id: "group",
    title: "Group Play",
    startPath: "/group/setup",
    finishPath: "/group/setup",
    steps: [
      {
        title: "Set the food mission.",
        subtitle: "Pick the basics before inviting the hungry ones.",
        mascot: "popcorn",
        bubble: "The host sets the rules. Everyone else brings opinions.",
        cta: "Next",
        navigateTo: "/group/setup",
        spotlight: "group-setup-form",
      },
      {
        title: "Invite through LINE.",
        subtitle: "Send the session link straight to your friends.",
        mascot: "popcorn",
        bubble: "Tap. Send. Wait for the chaos.",
        cta: "Next",
        navigateTo: "/group/setup",
        spotlight: "group-invite",
      },
      {
        title: "Wait for the crew.",
        subtitle: "Friends appear here before swiping starts.",
        mascot: "popcorn",
        bubble: "Start when enough people are in.",
        cta: "Start demo swipe",
        navigateTo: "/group/waiting",
      },
      {
        title: "Everyone swipes separately.",
        subtitle: "No pressure. No awkward voting yet.",
        mascot: "popcorn",
        bubble: "Toast looks for overlap.",
        cta: "Find match",
        navigateTo: "/group/swipe",
        illustration: "phones",
      },
      {
        title: "Match found.",
        subtitle: "Toast found something the group can agree on.",
        mascot: "popcorn",
        bubble: "Finally. A decision without 47 messages.",
        cta: "Next",
        illustration: "confetti",
      },
      {
        title: "No match? No problem.",
        subtitle: "Adjust the rules and Toast will try again.",
        mascot: "popcorn",
        bubble: "Toast helps the group escape decision jail.",
        cta: "Start Group Play",
        illustration: "reroll",
      },
    ],
  },
  trending: {
    id: "trending",
    title: "Trending",
    startPath: "/trending",
    finishPath: "/trending",
    steps: [
      {
        title: "See what's hot.",
        subtitle: "Menus and places people are loving right now.",
        mascot: "toast",
        bubble: "Trending. Popular nearby. Group favorite.",
        cta: "Next",
        navigateTo: "/trending",
        spotlight: "trending-feed",
      },
      {
        title: "Tap anything that catches your eye.",
        subtitle: "Toast can turn trends into your next meal.",
        mascot: "toast",
        bubble: "Tags, prices, and the spots serving it — all in one tap.",
        cta: "Next",
        spotlight: "trending-card",
      },
      {
        title: "Use it your way.",
        subtitle: "Start solo or send it to the group.",
        mascot: "toast",
        bubble: "Trends are just the shortcut. You still get to choose.",
        cta: "Explore Trending",
        illustration: "trendChips",
      },
    ],
  },
};
