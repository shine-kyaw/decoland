import Link from "next/link";
import { en } from "@/lib/content.en";

// not-found has no params, so this page is in English with a Burmese link.
export default function NotFound() {
  return (
    <div className="wrap page-head" style={{ minHeight: "50vh", alignContent: "center" }}>
      <p className="kicker">404</p>
      <h1>{en.notFound.title}</h1>
      <p className="lead">{en.notFound.text}</p>
      <div className="hero__ctas">
        <Link className="btn" href="/en">{en.notFound.back}</Link>
        <Link className="btn btn--ghost" href="/my" lang="my">မြန်မာ</Link>
      </div>
    </div>
  );
}
