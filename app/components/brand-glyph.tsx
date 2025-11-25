import type React from "react";

export type BrandGlyphProps = React.SVGProps<SVGSVGElement>;

export function BrandGlyph(props: BrandGlyphProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M5 14.5L16 5l11 9.5V26a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2Z"
        className="fill-none stroke-current"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 28v-7.5a1.5 1.5 0 0 1 1.5-1.5h5"
        className="fill-none stroke-current"
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      <path
        d="M13.5 15h4c1.1 0 1.9.6 1.9 1.6 0 .8-.5 1.4-1.4 1.5"
        className="fill-none stroke-current"
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      <text
        x="11"
        y="21"
        fontSize="8"
        fontWeight="700"
        letterSpacing="0.08em"
        className="fill-current"
      >
        FS
      </text>
    </svg>
  );
}

