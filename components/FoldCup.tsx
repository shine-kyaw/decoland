/*
  The one signature moment: a paper-cup die line draws itself (cut lines in
  ink, crease lines dashed in logo green), then tips back and the finished
  cup rises in its place. Pure CSS (see .fold in globals.css), no library.
  With reduced motion the finished state shows straight away.

  Geometry (viewBox 520 × 520): the cup wall blank is an annular sector
  centred on (260, 40), outer radius 210, inner 120, spanning 35°–145°.
*/
export function FoldCup({ label }: { label: string }) {
  return (
    <svg className="fold" viewBox="0 0 520 520" role="img" aria-label={label}>
      {/* Registration target, top-right */}
      <g className="reg" transform="translate(478 24)">
        <circle r="9" />
        <path d="M-14 0H14M0 -14V14" />
      </g>

      <g className="net">
        {/* Wall blank */}
        <path className="cut draw" pathLength={1}
          d="M432 160.5 A210 210 0 0 1 88 160.5 L161.7 108.8 A120 120 0 0 0 358.3 108.8 Z" />
        {/* Glue flap crease along the right edge of the blank */}
        <path className="crease draw" pathLength={1} d="M418.5 150 L352 103" />
        {/* Rim curl crease */}
        <path className="crease draw" pathLength={1} d="M405 140 A188 188 0 0 1 115 140" />
        {/* Bottom disc with its fold-under ring */}
        <circle className="cut draw" pathLength={1} cx="260" cy="380" r="76" />
        <circle className="crease draw" pathLength={1} cx="260" cy="380" r="62" />
      </g>

      <ellipse className="shadow" cx="268" cy="452" rx="110" ry="14" />

      <g className="cup">
        {/* Body: rim width 240, base width 160 */}
        <path className="cup-body" d="M140 200 L182 440 Q260 456 338 440 L380 200 Z" />
        {/* Logo-green band with the yellow/green slash from the Deco-Land building */}
        <path className="cup-band" d="M151 262 L369 262 L360 314 L160 314 Z" />
        <path className="cup-slash-y" d="M268 262 L284 262 L272 314 L256 314 Z" />
        <path className="cup-slash-g" d="M290 262 L306 262 L294 314 L278 314 Z" />
        {/* Rim */}
        <ellipse className="cup-rim" cx="260" cy="200" rx="122" ry="24" />
        <ellipse className="cup-inner" cx="260" cy="202" rx="110" ry="17" />
      </g>
    </svg>
  );
}
