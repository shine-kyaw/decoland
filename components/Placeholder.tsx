import { SHOW_PLACEHOLDERS } from "@/lib/site";

/**
 * Visible marker for anything the client still has to supply. Never replace
 * one of these with invented content; switch them off for production with
 * NEXT_PUBLIC_SHOW_PLACEHOLDERS=false once the real material is in.
 */
export function Placeholder({ label, inline, style }: { label: string; inline?: boolean; style?: React.CSSProperties }) {
  if (!SHOW_PLACEHOLDERS) return null;
  return (
    <span className={inline ? "ph ph--inline" : "ph"} style={style} role="note">
      [[CLIENT TO SUPPLY: {label}]]
    </span>
  );
}
