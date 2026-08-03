import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadChakraPetch } from "@remotion/google-fonts/ChakraPetch";

// Poster pairing: Anton for oversized slab headlines (card-show poster
// energy), Chakra Petch for techy supporting copy (ui-ux-pro-max "Gaming
// Bold" family). Deliberately NOT Inter/Bebas — see taste-skill §0.D.
const anton = loadAnton();
const chakra = loadChakraPetch("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const fonts = {
  display: anton.fontFamily,
  body: chakra.fontFamily,
};

// Warm near-black card-table palette with gold foil as the hero accent.
// Franchise neons (yellow/red/blue) appear only on the cards themselves.
export const colors = {
  bg: "#0B0A08",
  bgWarm: "#1A150C",
  panel: "#141109",
  cream: "#F5EFE2",
  gold: "#F5C542",
  goldDeep: "#B8860B",
  red: "#E63946",
  yellow: "#FFCB05",
  blue: "#38BDF8",
  muted: "rgba(245,239,226,0.55)",
  faint: "rgba(245,239,226,0.14)",
};

// Beveled gold-foil gradient for headline fills and CTA surfaces.
export const foilGradient = `linear-gradient(100deg, #F9E27A 0%, ${colors.gold} 30%, #D9A81F 52%, ${colors.gold} 70%, #FFF3C4 100%)`;

// Rainbow holo — used ONLY on card borders, where it's authentic.
export const holoGradient = (angleDeg: number) =>
  `conic-gradient(from ${angleDeg}deg, #4FD1EA, #8B5CF6, #F43F5E, ${colors.gold}, #4FD1EA)`;
