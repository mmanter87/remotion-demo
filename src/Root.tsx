import "./index.css";
import { Composition } from "remotion";
import { HelloWorld, myCompSchema } from "./HelloWorld";
import { Logo, myCompSchema2 } from "./HelloWorld/Logo";
import { ModuleHeadlineCard } from "./ModuleHeadlineCard";
import { OutroCard } from "./OutroCard";
import { SeriesCard } from "./SeriesCard";
import { SQFEpisodeCard, SQFNextCard } from "./SQFSeries";

// SQF Edition 10 educational series (1080x1080, 5s each, chime bookends).
// Slot in the remaining episode by adding an entry here.
const SQF_SPEAKER = {
  speaker: "Jim White",
  speakerRole: "SQF consultant & trainer",
  seriesLabel: "SQF EDITION 10",
  footer: "RECORDED LIVE · EDITION 10 SESSION",
} as const;

const SQF_TOPICS = [
  {
    slug: "MassBalance",
    start: {
      episodeNumber: "01",
      kicker: "THE QUESTION",
      headline: [
        { text: "Does SQF actually require a " },
        { text: "mass balance?", accent: true },
      ],
    },
    endTeaser: "One product, one day — and the whole audit runs off it.",
  },
  {
    slug: "VerticalTrace",
    start: {
      episodeNumber: "02",
      kicker: "THE MECHANISM",
      headline: [
        { text: "One product. One day. " },
        { text: "The whole audit.", accent: true },
      ],
    },
    endTeaser: "When the auditor is wrong, appeal it.",
  },
  {
    slug: "KnowTheCode",
    start: {
      episodeNumber: "03",
      kicker: "THE POSITION",
      headline: [
        { text: "Know the code better than " },
        { text: "your auditor.", accent: true },
      ],
    },
    endTeaser: "Coming next in the Edition 10 series.",
  },
];

// Central place to edit copy for all module cards.
// Swap/add subtitle text here as you learn each module — especially
// Efficiency and Quotes, which are still placeholder copy pending real detail.
export const MODULE_CARDS = {
  Dashboard: {
    moduleLine1: "Dashboard",
    moduleLine2: "Module Overview",
    subtitle: "Your operational control center, in real time.",
  },
  KeychainAI: {
    moduleLine1: "Keychain AI",
    moduleLine2: "Module Overview",
    subtitle: "Your natural-language assistant across the entire platform.",
  },
  Efficiency: {
    moduleLine1: "Efficiency",
    moduleLine2: "Module Overview",
    subtitle: "See how your lines are performing, in real time.", // ⚠ placeholder — confirm real detail
  },
  Quotes: {
    moduleLine1: "Quotes",
    moduleLine2: "Module Overview",
    subtitle: "Send customer quotes directly from the platform.", // ⚠ placeholder — confirm real detail
  },
  Traceability: {
    moduleLine1: "Traceability",
    moduleLine2: "Module Overview",
    subtitle: "End-to-end chain of custody.",
    audioSrc: "jingle.wav",
    audioVolume: 0.5,
  },
  Workflows: {
    moduleLine1: "Workflows",
    moduleLine2: "Module Overview",
    subtitle: "Automate the repeatable, so your team doesn't have to.",
  },
  Purchasing: {
    moduleLine1: "Purchasing",
    moduleLine2: "Module Overview",
    subtitle: "Know what to order, and when, before you run short.",
  },
  Inventory: {
    moduleLine1: "Inventory",
    moduleLine2: "Module Overview",
    subtitle: "Every item tracked in real time, by warehouse, lot, and status.",
  },
  Production: {
    moduleLine1: "Production",
    moduleLine2: "Module Overview",
    subtitle: "The system recommends the best day, line, and time for every run.",
  },
  FoodSafety: {
    moduleLine1: "Food Safety",
    moduleLine2: "Module Overview",
    subtitle: "Digital checklists, fully 21 CFR Part 11 compliant.",
  },
  SalesOrderToWorkOrder: {
    moduleLine1: "Sales Order to Work Order",
    moduleLine2: "Scheduling",
    subtitle: "Turn a signed sales order into a scheduled production run — automatically.",
  },
  FindTheShortage: {
    moduleLine1: "Find the Shortage,",
    moduleLine2: "Before It Stops the Run",
    subtitle: "Live inventory, checked against every scheduled run.",
  },
} as const;

// Per-card duration overrides (in frames at 30fps). Cards not listed here
// run the default 90 frames; longer intros get more breathing room before
// the exit animation so they don't end abruptly.
const CARD_DURATIONS: Partial<Record<keyof typeof MODULE_CARDS, number>> = {
  SalesOrderToWorkOrder: 420,
  FindTheShortage: 180,
  Traceability: 180,
};

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        // You can take the "id" to render a video:
        // npx remotion render HelloWorld
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        // You can override these props for each render:
        // https://www.remotion.dev/docs/parametrized-rendering
        schema={myCompSchema}
        defaultProps={{
          titleText: "Welcome to Remotion",
          titleColor: "#000000",
          logoColor1: "#91EAE4",
          logoColor2: "#86A8E7",
        }}
      />

      {/* Mount any React component to make it show up in the sidebar and work on it individually! */}
      <Composition
        id="OnlyLogo"
        component={Logo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        schema={myCompSchema2}
        defaultProps={{
          logoColor1: "#91dAE2" as const,
          logoColor2: "#86A8E7" as const,
        }}
      />

      {/* One renderable composition per Keychain module card, e.g.:
          npx remotion render HeadlineCard-KeychainAI out/keychain-ai.mp4 */}
      {Object.entries(MODULE_CARDS).map(([key, props]) => (
        <Composition
          key={key}
          id={`HeadlineCard-${key}`}
          component={ModuleHeadlineCard}
          durationInFrames={CARD_DURATIONS[key as keyof typeof MODULE_CARDS] ?? 90}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={props}
        />
      ))}

      {/* SQF Edition 10 educational series — square, 5s, one start + one
          end card per topic, labeled SQF-<Topic>-Start / SQF-<Topic>-End */}
      {SQF_TOPICS.map(({ slug, start }) => (
        <Composition
          key={`${slug}-start`}
          id={`SQF-${slug}-Start`}
          component={SQFEpisodeCard}
          durationInFrames={150}
          fps={30}
          width={1080}
          height={1080}
          defaultProps={{ ...SQF_SPEAKER, ...start }}
        />
      ))}
      {SQF_TOPICS.map(({ slug, endTeaser }) => (
        <Composition
          key={`${slug}-end`}
          id={`SQF-${slug}-End`}
          component={SQFNextCard}
          durationInFrames={150}
          fps={30}
          width={1080}
          height={1080}
          defaultProps={{
            titleLine1: "SQF Edition 10",
            titleLine2: "with Jim White",
            kicker: "NEXT IN THE SERIES",
            teaser: endTeaser,
            stamp: "AUDITS FROM 2 JAN 2027",
          }}
        />
      ))}

      {/* Thumbnail-series intro card (REMOTIONSPEC.md treatment):
          npx remotion render SeriesCard-PurchasePlan out/series-purchase-plan.mp4
          Pass screenshotSrc (a file in public/) to swap the mock UI for a
          real product screenshot. */}
      <Composition
        id="SeriesCard-PurchasePlan"
        component={SeriesCard}
        durationInFrames={210}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          headlineLines: ["Nobody", "added it up."],
          accentLine: "It already did.",
          subLine: "Four runs · sixteen shortages · five orders",
          badgeText: "4 MINUTES",
        }}
      />

      {/* Closing CTA card for the end of every module video:
          npx remotion render OutroCard out/outro.mp4 */}
      <Composition
        id="OutroCard"
        component={OutroCard}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          headlineLine1: "See the Full",
          headlineLine2: "Keychain Suite",
          body: "One CPG-native ERP platform — from quoting to compliance.",
          ctaLabel: "Interested in learning more? Grab time with me directly:",
          email: "michael.manter@keychain.com",
        }}
      />
    </>
  );
};
