import "./index.css";
import { Composition } from "remotion";
import { HelloWorld, myCompSchema } from "./HelloWorld";
import { Logo, myCompSchema2 } from "./HelloWorld/Logo";
import { ModuleHeadlineCard } from "./ModuleHeadlineCard";

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
    subtitle: "Full recall reports, in seconds — not days.",
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
} as const;

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
          durationInFrames={90}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={props}
        />
      ))}
    </>
  );
};
