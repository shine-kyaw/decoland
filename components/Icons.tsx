type P = { size?: number };
const base = (size = 18) => ({
  width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
  strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true,
});

export const Arrow = ({ size = 16 }: P) => (
  <svg {...base(size)}><path d="M4 12h15M13 6l6 6-6 6" /></svg>
);
export const Phone = ({ size }: P) => (
  <svg {...base(size)}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" /></svg>
);
export const Chat = ({ size }: P) => (
  <svg {...base(size)}><path d="M4 5h16v11H9l-5 4V5Z" /><path d="M8 10h8M8 13h5" /></svg>
);
export const Viber = ({ size }: P) => (
  <svg {...base(size)}><path d="M12 3c5 0 8 2.5 8 7.5S17 18 12 18l-4 3v-3.6C5.6 16.3 4 14 4 10.5 4 5.5 7 3 12 3Z" /><path d="M10 8.5c.4 2.3 2 4 4.3 4.6" /></svg>
);
export const Mail = ({ size }: P) => (
  <svg {...base(size)}><rect x="3" y="5" width="18" height="14" rx="1" /><path d="m4 6 8 7 8-7" /></svg>
);
export const External = ({ size = 16 }: P) => (
  <svg {...base(size)}><path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6" /></svg>
);
