import React from "react";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { CardsScene } from "./CardsScene";
import { CtaScene } from "./CtaScene";
import { HookScene } from "./HookScene";
import { TradeScene } from "./TradeScene";

// 15s Instagram Reels promo (1080x1920 @ 30fps).
// Total = 110 + 125 + 115 + 136 - (3 * 12 transition overlap) = 450 frames.
export const PROMO_DURATION_IN_FRAMES = 450;

export const CollectorsCircuitPromo: React.FC = () => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={110}>
        <HookScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        timing={linearTiming({ durationInFrames: 12 })}
        presentation={fade()}
      />
      <TransitionSeries.Sequence durationInFrames={125}>
        <CardsScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        timing={linearTiming({ durationInFrames: 12 })}
        presentation={fade()}
      />
      <TransitionSeries.Sequence durationInFrames={115}>
        <TradeScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        timing={linearTiming({ durationInFrames: 12 })}
        presentation={fade()}
      />
      <TransitionSeries.Sequence durationInFrames={136}>
        <CtaScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
