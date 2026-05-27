import type { VercelRequest, VercelResponse } from "@vercel/node";
import { readFileSync } from "fs";
import { join } from "path";

// Routes that belong to the SPA — serve index.html directly, no OG injection needed
const APP_ROUTES = new Set([
  "login",
  "signup",
  "onboarding",
  "dashboard",
  "profiles",
  "analytics",
  "profile",
]);

interface PublicProfile {
  username: string;
  displayName?: string | null;
  bio?: string | null;
  links?: { platform?: string; url: string; title?: string }[];
  projects?: { projectTitle: string }[];
  theme?: string;
}

function escape(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function buildOgHtml(
  baseHtml: string,
  profile: PublicProfile,
  siteUrl: string,
  username: string
): string {
  const displayName = profile.displayName || profile.username || username;
  const bio = profile.bio || `Check out ${displayName}'s links and projects.`;
  const profileUrl = `${siteUrl}/${username}`;

  // og:image is served via Vercel's proxy: /api/og-image/:username → backend SVG endpoint
  // This keeps the og:image on the same domain as the site (better for crawlers)
  const ogImageUrl = `${siteUrl}/api/og-image/${encodeURIComponent(username)}`;

  const dynamicMeta = `
    <!-- Dynamic OG tags injected for @${escape(username)} -->
    <meta property="og:type" content="profile" />
    <meta property="og:url" content="${escape(profileUrl)}" />
    <meta property="og:title" content="${escape(displayName)} | OneProfile" />
    <meta property="og:description" content="${escape(bio.slice(0, 200))}" />
    <meta property="og:image" content="${escape(ogImageUrl)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escape(displayName)}'s OneProfile" />
    <meta property="og:site_name" content="OneProfile" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${escape(profileUrl)}" />
    <meta name="twitter:title" content="${escape(displayName)} | OneProfile" />
    <meta name="twitter:description" content="${escape(bio.slice(0, 200))}" />
    <meta name="twitter:image" content="${escape(ogImageUrl)}" />
    <meta name="twitter:image:alt" content="${escape(displayName)}'s OneProfile" />
    <title>${escape(displayName)} | OneProfile</title>
    <link rel="canonical" href="${escape(profileUrl)}" />`;

  // Remove existing static OG tags and title, inject dynamic ones
  return baseHtml
    .replace(/<title>[^<]*<\/title>/i, "") // remove static title (will be re-injected)
    .replace(/<meta\s+property="og:[^"]*"[^>]*>/gi, "")
    .replace(/<meta\s+property="twitter:[^"]*"[^>]*>/gi, "")
    .replace(/<meta\s+name="twitter:[^"]*"[^>]*>/gi, "")
    .replace(/<link\s+rel="canonical"[^>]*>/gi, "")
    .replace("</head>", `${dynamicMeta}\n</head>`);
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const username = (req.query.username as string) || "";

  // Guard: static asset requests should never reach this handler (vercel.json handles them),
  // but if they do, return 404 rather than serving HTML as an image.
  const STATIC_EXTENSIONS = /\.(png|jpg|jpeg|gif|svg|ico|webp|css|js|json|woff|woff2|ttf|eot|map|txt|pdf|xml)$/i;
  if (STATIC_EXTENSIONS.test(username)) {
    return res.status(404).send("Not found");
  }

  // Pass through known SPA routes
  if (!username || APP_ROUTES.has(username.toLowerCase())) {
    const indexPath = join(process.cwd(), "dist", "index.html");
    const html = readFileSync(indexPath, "utf-8");
    return res.setHeader("Content-Type", "text/html").send(html);
  }

  const backendUrl =
    process.env.BACKEND_URL ||
    process.env.VITE_BACKEND_URL ||
    "https://oneprofilebackend.madebykhushi.dev";

  const siteUrl =
    process.env.VITE_APP_URL
      ? `https://${process.env.VITE_APP_URL.replace(/^https?:\/\//, "")}`
      : "https://oneprofile.madebykhushi.dev";

  // Read built index.html
  const indexPath = join(process.cwd(), "dist", "index.html");
  let baseHtml: string;
  try {
    baseHtml = readFileSync(indexPath, "utf-8");
  } catch {
    return res.status(500).send("Could not read index.html");
  }

  // Try to fetch profile for OG enrichment
  try {
    const response = await fetch(
      `${backendUrl}/api/v1/profile/public/${encodeURIComponent(username)}`,
      { headers: { Accept: "application/json" } }
    );

    if (response.ok) {
      const profile: PublicProfile = await response.json();
      const enrichedHtml = buildOgHtml(baseHtml, profile, siteUrl, username);
      return res
        .setHeader("Content-Type", "text/html")
        .setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=60")
        .send(enrichedHtml);
    }
  } catch {
    // Backend unreachable — fall through to plain index.html
  }

  // Profile not found or backend down → serve plain SPA (will show 404 in-app)
  return res
    .setHeader("Content-Type", "text/html")
    .setHeader("Cache-Control", "no-store")
    .send(baseHtml);
}
