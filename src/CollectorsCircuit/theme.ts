import { loadFont as loadBebasNeue } from "@remotion/google-fonts/BebasNeue";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const bebas = loadBebasNeue();
const inter = loadInter("normal", {
  weights: ["400", "600", "700", "800"],
  subsets: ["latin"],
});

export const fonts = {
  display: bebas.fontFamily,
  body: inter.fontFamily,
};

export const colors = {
  bg: "#07070f",
  panel: "#12122a",
  yellow: "#ffd60a",
  orange: "#ff9e00",
  red: "#ef233c",
  redLight: "#ff5d73",
  blue: "#3a86ff",
  cyan: "#00c2ff",
  teal: "#2ee6a8",
  purple: "#9d4edd",
  white: "#f8f9ff",
  muted: "rgba(248, 249, 255, 0.55)",
};
