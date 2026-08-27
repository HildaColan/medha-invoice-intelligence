import type { Config } from "tailwindcss";

/**
 * Tailwind is used here purely for layout utilities (flex, grid, spacing,
 * rounded corners, etc.). All brand colors, typography and other design
 * tokens live in `src/theme/tokens.ts` and are applied via inline styles,
 * exactly matching the original design — nothing is redefined here.
 */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
