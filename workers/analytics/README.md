# Luowen Analytics Worker

First-party analytics collector for Luowen. It records page views from the
static Astro site, enriches requests with Cloudflare geolocation metadata, and
serves an admin-only summary API for the `/analytics/` dashboard.

## Runtime

- Cloudflare Workers
- Cloudflare D1
- No cookies
- Browser DNT/GPC signals are respected by the site tracker
- Raw IP storage is off by default

## Data Model

Each page view stores:

- Visit time: server receive time and client occurrence time
- Page context: path, normalized path, title, referrer, UTM fields
- Visitor context: salted visitor/session/IP hashes
- Location context from Cloudflare: country, region, city, timezone, colo, ASN
- Client context: language, viewport, screen size, color scheme
- User agent classification: browser and device type

Set `STORE_RAW_IP=true` only if you explicitly need raw IP addresses. The
default keeps `ip_address` empty and uses `ip_hash` for uniqueness.

## Setup

```bash
cd workers/analytics
cp wrangler.example.jsonc wrangler.jsonc
pnpm dlx wrangler d1 create luowen_analytics
```

Copy the returned D1 `database_id` into `wrangler.jsonc`, then run:

```bash
pnpm dlx wrangler d1 migrations apply luowen_analytics --remote
pnpm dlx wrangler secret put ADMIN_TOKEN
pnpm dlx wrangler secret put HASH_SALT
pnpm dlx wrangler deploy --domain analytics.whynotsleep.cc
```

`HASH_SALT` must be at least 16 characters. Collection returns
`hash_salt_missing` until it is configured.

After deployment, set the GitHub repository variable used by the Pages build:

```text
PUBLIC_ANALYTICS_ENDPOINT=https://analytics.whynotsleep.cc
```

The static site only sends pageview events when that public endpoint is present
at build time.

## API

`POST /collect`

Receives pageview events from allowed origins. Returns `202` for accepted or
deduplicated events.

`GET /summary?days=30&limit=20`

Requires `Authorization: Bearer <ADMIN_TOKEN>`. Returns totals, timeline,
hourly distribution, top pages, geography, referrers, devices, browsers, and
recent visits.

`GET /export.csv?days=30&limit=1000`

Requires `Authorization: Bearer <ADMIN_TOKEN>`. Exports recent visit rows as
CSV.

`GET /health`

Unauthenticated health check. It reports whether `HASH_SALT` is configured.

## Operational Notes

- `ALLOWED_ORIGINS` is comma-separated. Keep production entry domains and local
  development origins explicit.
- `DUPLICATE_WINDOW_SECONDS` prevents a single session from double-counting the
  same path during Astro transitions or refresh bursts.
- `RETENTION_DAYS` deletes old rows opportunistically on collection requests.
- Rotate `HASH_SALT` only when you accept losing continuity for unique visitor
  counts.
