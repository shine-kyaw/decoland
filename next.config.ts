import type { NextConfig } from "next";

/*
  Old WordPress URLs (decolandgroup.com, Enfold theme) → their new homes, so
  anything already indexed or linked keeps working after cutover. The old
  site had no language prefix, so every redirect lands on /en.
*/
const legacy: Array<[string, string]> = [
  ["/about-us", "/en/about"],
  ["/affiliated-companies", "/en/group"],
  ["/affiliated-companies/:slug*", "/en/group"],
  ["/csr_activities", "/en/about"],
  ["/csr_activities/:slug*", "/en/about"],
  ["/paper", "/en/paper"],
  ["/paper/:slug*", "/en/paper"],
  ["/stationery", "/en/stationery"],
  ["/stationery/:slug*", "/en/stationery"],
  ["/services", "/en/services"],
  ["/services/:slug*", "/en/services"],
  ["/contact", "/en/contact"],
  ["/cart", "/en"],
  // No privacy page yet (Aster drafts it, Deco-Land approves); until then, contact.
  ["/privacy-policy", "/en/contact"],
];

const config: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      { source: "/", destination: "/en", permanent: false },
      ...legacy.map(([source, destination]) => ({ source, destination, permanent: true })),
    ];
  },
};

export default config;
