import type { BlockProps } from "@/lib/cms-types";

export function VisionMissionBlock({ block }: BlockProps) {
  if (!block.vision && !block.mission) return null;
  return (
    <section className="section--tight" style={{ paddingTop: 0 }}>
      <div className="wrap vm">
        {block.vision ? <div data-reveal><p className="kicker">{block.visionLabel || "Vision"}</p><p>{block.vision}</p></div> : null}
        {block.mission ? <div data-reveal className="on-dark"><p className="kicker">{block.missionLabel || "Mission"}</p><p>{block.mission}</p></div> : null}
      </div>
    </section>
  );
}
