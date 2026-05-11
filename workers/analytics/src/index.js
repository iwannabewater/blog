const DEFAULT_ALLOWED_ORIGINS =
  "https://blog.whynotsleep.cc,http://localhost:4321,http://127.0.0.1:4321";
const DEFAULT_RETENTION_DAYS = 365;
const MAX_BODY_BYTES = 8192;
const MAX_EXPORT_ROWS = 5000;

function json(data, init = {}, corsHeaders = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...corsHeaders,
      ...init.headers,
    },
  });
}

function text(data, init = {}, corsHeaders = {}) {
  return new Response(data, {
    ...init,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      ...corsHeaders,
      ...init.headers,
    },
  });
}

function allowedOrigins(env) {
  return (env.ALLOWED_ORIGINS || DEFAULT_ALLOWED_ORIGINS)
    .split(",")
    .map(origin => origin.trim())
    .filter(Boolean);
}

function corsFor(request, env) {
  const origin = request.headers.get("Origin") || "";
  const allowed = allowedOrigins(env);
  const allowOrigin = allowed.includes(origin) ? origin : "";

  if (!allowOrigin) return {};

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function isAllowedOrigin(request, env) {
  const origin = request.headers.get("Origin");
  if (!origin) return true;
  return allowedOrigins(env).includes(origin);
}

function cleanText(value, maxLength = 512) {
  if (typeof value !== "string") return "";
  return value
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function intValue(value, fallback = null) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function boolEnv(value) {
  return String(value || "").toLowerCase() === "true";
}

function hasHashSalt(env) {
  return typeof env.HASH_SALT === "string" && env.HASH_SALT.length >= 16;
}

async function sha256(value) {
  const encoded = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", encoded);
  return [...new Uint8Array(digest)]
    .map(byte => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function hashWithSalt(value, env) {
  const normalized = cleanText(value, 2048);
  if (!normalized) return "";
  return sha256(`${env.HASH_SALT}:${normalized}`);
}

function ipAddress(request) {
  return (
    request.headers.get("CF-Connecting-IP") ||
    request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ||
    ""
  );
}

function geoValue(request, key) {
  const cf = request.cf || {};
  const value = cf[key];
  if (typeof value === "number") return String(value);
  if (typeof value === "string") return cleanText(value, 120);
  return "";
}

function normalizePath(path) {
  const rawPath = cleanText(path, 1024) || "/";
  const parsed = new URL(rawPath, "https://luowen.local");
  const pathname = parsed.pathname || "/";
  const search = parsed.search || "";
  return {
    path: `${pathname}${search}`.slice(0, 1024),
    normalizedPath: pathname.slice(0, 512),
    utmSource: cleanText(parsed.searchParams.get("utm_source"), 160),
    utmMedium: cleanText(parsed.searchParams.get("utm_medium"), 160),
    utmCampaign: cleanText(parsed.searchParams.get("utm_campaign"), 160),
  };
}

function referrerParts(referrer) {
  const cleanReferrer = cleanText(referrer, 1024);
  if (!cleanReferrer) return { referrer: "", referrerHost: "" };

  try {
    const parsed = new URL(cleanReferrer);
    return {
      referrer: parsed.href.slice(0, 1024),
      referrerHost: parsed.hostname.slice(0, 255),
    };
  } catch {
    return { referrer: cleanReferrer, referrerHost: "" };
  }
}

function classifyDevice(userAgent) {
  const ua = userAgent.toLowerCase();
  if (/ipad|tablet|kindle|playbook/.test(ua)) return "tablet";
  if (/mobi|iphone|android/.test(ua)) return "mobile";
  if (ua) return "desktop";
  return "unknown";
}

function classifyBrowser(userAgent) {
  const ua = userAgent.toLowerCase();
  if (ua.includes("edg/")) return "Edge";
  if (ua.includes("firefox/")) return "Firefox";
  if (ua.includes("safari/") && !ua.includes("chrome/")) return "Safari";
  if (ua.includes("chrome/") || ua.includes("chromium/")) return "Chrome";
  if (ua.includes("bot") || ua.includes("crawler") || ua.includes("spider")) {
    return "Bot";
  }
  if (ua) return "Other";
  return "Unknown";
}

function authToken(request) {
  const header = request.headers.get("Authorization") || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : "";
}

function requireAdmin(request, env) {
  return Boolean(env.ADMIN_TOKEN && authToken(request) === env.ADMIN_TOKEN);
}

async function readJson(request) {
  const rawBody = await request.text();
  if (rawBody.length > MAX_BODY_BYTES) {
    throw new Error("payload_too_large");
  }
  return JSON.parse(rawBody);
}

async function collect(request, env, corsHeaders) {
  if (!hasHashSalt(env)) {
    return json(
      { ok: false, error: "hash_salt_missing" },
      { status: 503 },
      corsHeaders
    );
  }

  if (!isAllowedOrigin(request, env)) {
    return json({ ok: false, error: "origin_not_allowed" }, { status: 403 });
  }

  let body;
  try {
    body = await readJson(request);
  } catch {
    return json(
      { ok: false, error: "invalid_json" },
      { status: 400 },
      corsHeaders
    );
  }

  if (body?.type !== "pageview") {
    return json(
      { ok: false, error: "unsupported_event" },
      { status: 400 },
      corsHeaders
    );
  }

  const { path, normalizedPath, utmSource, utmMedium, utmCampaign } =
    normalizePath(body.path);
  const { referrer, referrerHost } = referrerParts(body.referrer);
  const receivedAt = new Date().toISOString();
  const occurredAt = cleanText(body.occurredAt, 64);
  const clientIp = ipAddress(request);
  const userAgent = cleanText(request.headers.get("User-Agent"), 1024);
  const visitorId = cleanText(body.visitorId, 160);
  const sessionId = cleanText(body.sessionId, 160);
  const ipHash = await hashWithSalt(clientIp, env);
  const visitorHash = await hashWithSalt(
    visitorId || `${clientIp}:${userAgent}`,
    env
  );
  const sessionHash = await hashWithSalt(
    sessionId || `${visitorHash}:${path}`,
    env
  );
  const duplicateSeconds = intValue(env.DUPLICATE_WINDOW_SECONDS, 20) || 20;
  const duplicateCutoff = new Date(
    Date.now() - duplicateSeconds * 1000
  ).toISOString();

  const duplicate = await env.DB.prepare(
    `SELECT id
       FROM visits
      WHERE session_id_hash = ?1
        AND path = ?2
        AND received_at >= ?3
      LIMIT 1`
  )
    .bind(sessionHash, path, duplicateCutoff)
    .first();

  if (duplicate) {
    return json({ ok: true, duplicate: true }, { status: 202 }, corsHeaders);
  }

  await env.DB.prepare(
    `INSERT INTO visits (
      id,
      received_at,
      occurred_at,
      event_type,
      path,
      normalized_path,
      title,
      referrer,
      referrer_host,
      utm_source,
      utm_medium,
      utm_campaign,
      visitor_id_hash,
      session_id_hash,
      ip_hash,
      ip_address,
      country,
      region,
      city,
      postal_code,
      continent,
      timezone,
      latitude,
      longitude,
      colo,
      asn,
      as_organization,
      user_agent,
      browser,
      device,
      language,
      languages,
      client_timezone,
      viewport_width,
      viewport_height,
      screen_width,
      screen_height,
      color_scheme
    ) VALUES (
      ?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10,
      ?11, ?12, ?13, ?14, ?15, ?16, ?17, ?18, ?19, ?20,
      ?21, ?22, ?23, ?24, ?25, ?26, ?27, ?28, ?29, ?30,
      ?31, ?32, ?33, ?34, ?35, ?36, ?37, ?38
    )`
  )
    .bind(
      crypto.randomUUID(),
      receivedAt,
      occurredAt,
      "pageview",
      path,
      normalizedPath,
      cleanText(body.title, 300),
      referrer,
      referrerHost,
      utmSource,
      utmMedium,
      utmCampaign,
      visitorHash,
      sessionHash,
      ipHash,
      boolEnv(env.STORE_RAW_IP) ? cleanText(clientIp, 120) : null,
      geoValue(request, "country"),
      geoValue(request, "region"),
      geoValue(request, "city"),
      geoValue(request, "postalCode"),
      geoValue(request, "continent"),
      geoValue(request, "timezone"),
      geoValue(request, "latitude"),
      geoValue(request, "longitude"),
      geoValue(request, "colo"),
      geoValue(request, "asn"),
      geoValue(request, "asOrganization"),
      userAgent,
      classifyBrowser(userAgent),
      classifyDevice(userAgent),
      cleanText(body.language, 80),
      Array.isArray(body.languages)
        ? body.languages.map(item => cleanText(item, 80)).join(",")
        : "",
      cleanText(body.timezone, 120),
      intValue(body.viewport?.width),
      intValue(body.viewport?.height),
      intValue(body.screen?.width),
      intValue(body.screen?.height),
      cleanText(body.colorScheme, 24)
    )
    .run();

  return json({ ok: true }, { status: 202 }, corsHeaders);
}

function boundedDays(searchParams) {
  const days = intValue(searchParams.get("days"), 30) || 30;
  return Math.min(Math.max(days, 1), 366);
}

function boundedLimit(searchParams, fallback = 20, max = 100) {
  const limit = intValue(searchParams.get("limit"), fallback) || fallback;
  return Math.min(Math.max(limit, 1), max);
}

function distinctVisitorSql() {
  return "COALESCE(NULLIF(visitor_id_hash, ''), NULLIF(ip_hash, ''), 'unknown')";
}

async function all(env, sql, ...params) {
  const result = await env.DB.prepare(sql)
    .bind(...params)
    .all();
  return result.results || [];
}

async function summary(request, env, corsHeaders) {
  if (!requireAdmin(request, env)) {
    return json(
      { ok: false, error: "unauthorized" },
      { status: 401 },
      corsHeaders
    );
  }

  const url = new URL(request.url);
  const days = boundedDays(url.searchParams);
  const limit = boundedLimit(url.searchParams);
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  const distinctVisitor = distinctVisitorSql();

  const totals = await env.DB.prepare(
    `SELECT
       COUNT(*) AS pageviews,
       COUNT(DISTINCT ${distinctVisitor}) AS visitors,
       COUNT(DISTINCT NULLIF(session_id_hash, '')) AS sessions
     FROM visits
     WHERE received_at >= ?1`
  )
    .bind(since)
    .first();

  const topPages = await all(
    env,
    `SELECT
       normalized_path AS path,
       COUNT(*) AS pageviews,
       COUNT(DISTINCT ${distinctVisitor}) AS visitors
     FROM visits
     WHERE received_at >= ?1
     GROUP BY normalized_path
     ORDER BY pageviews DESC, visitors DESC
     LIMIT ?2`,
    since,
    limit
  );

  const topCountries = await grouped(env, since, "country", limit);
  const topRegions = await grouped(env, since, "region", limit);
  const topCities = await grouped(env, since, "city", limit);
  const topReferrers = await grouped(env, since, "referrer_host", limit);
  const devices = await grouped(env, since, "device", limit);
  const browsers = await grouped(env, since, "browser", limit);

  const timeline = await all(
    env,
    `SELECT
       substr(received_at, 1, 10) AS day,
       COUNT(*) AS pageviews,
       COUNT(DISTINCT ${distinctVisitor}) AS visitors
     FROM visits
     WHERE received_at >= ?1
     GROUP BY day
     ORDER BY day ASC`,
    since
  );

  const hourly = await all(
    env,
    `SELECT
       substr(received_at, 12, 2) AS hour,
       COUNT(*) AS pageviews
     FROM visits
     WHERE received_at >= ?1
     GROUP BY hour
     ORDER BY hour ASC`,
    since
  );

  const recentVisits = await all(
    env,
    `SELECT
       received_at,
       path,
       title,
       referrer_host,
       country,
       region,
       city,
       ip_address,
       substr(ip_hash, 1, 12) AS ip_hash,
       browser,
       device,
       language
     FROM visits
     WHERE received_at >= ?1
     ORDER BY received_at DESC
     LIMIT ?2`,
    since,
    limit
  );

  return json(
    {
      ok: true,
      days,
      since,
      generatedAt: new Date().toISOString(),
      totals: totals || { pageviews: 0, visitors: 0, sessions: 0 },
      topPages,
      topCountries,
      topRegions,
      topCities,
      topReferrers,
      devices,
      browsers,
      timeline,
      hourly,
      recentVisits,
    },
    {},
    corsHeaders
  );
}

async function grouped(env, since, column, limit) {
  const allowedColumns = new Set([
    "country",
    "region",
    "city",
    "referrer_host",
    "device",
    "browser",
  ]);
  if (!allowedColumns.has(column)) return [];

  return all(
    env,
    `SELECT
       COALESCE(NULLIF(${column}, ''), 'Unknown') AS label,
       COUNT(*) AS pageviews,
       COUNT(DISTINCT ${distinctVisitorSql()}) AS visitors
     FROM visits
     WHERE received_at >= ?1
     GROUP BY label
     ORDER BY pageviews DESC, visitors DESC
     LIMIT ?2`,
    since,
    limit
  );
}

function csvEscape(value) {
  const str = value == null ? "" : String(value);
  if (!/[",\n\r]/.test(str)) return str;
  return `"${str.replace(/"/g, '""')}"`;
}

async function exportCsv(request, env, corsHeaders) {
  if (!requireAdmin(request, env)) {
    return text("unauthorized\n", { status: 401 }, corsHeaders);
  }

  const url = new URL(request.url);
  const days = boundedDays(url.searchParams);
  const limit = boundedLimit(url.searchParams, 1000, MAX_EXPORT_ROWS);
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  const rows = await all(
    env,
    `SELECT
       received_at,
       path,
       title,
       referrer_host,
       country,
       region,
       city,
       ip_address,
       substr(ip_hash, 1, 12) AS ip_hash,
       browser,
       device,
       language
     FROM visits
     WHERE received_at >= ?1
     ORDER BY received_at DESC
     LIMIT ?2`,
    since,
    limit
  );
  const columns = [
    "received_at",
    "path",
    "title",
    "referrer_host",
    "country",
    "region",
    "city",
    "ip_address",
    "ip_hash",
    "browser",
    "device",
    "language",
  ];
  const csv = [
    columns.join(","),
    ...rows.map(row => columns.map(column => csvEscape(row[column])).join(",")),
  ].join("\n");

  return text(
    `${csv}\n`,
    {
      headers: {
        "Content-Disposition": `attachment; filename="luowen-analytics-${days}d.csv"`,
      },
    },
    corsHeaders
  );
}

async function cleanup(env) {
  const retentionDays =
    intValue(env.RETENTION_DAYS, DEFAULT_RETENTION_DAYS) ||
    DEFAULT_RETENTION_DAYS;
  if (retentionDays <= 0) return;

  const cutoff = new Date(
    Date.now() - retentionDays * 24 * 60 * 60 * 1000
  ).toISOString();
  await env.DB.prepare("DELETE FROM visits WHERE received_at < ?1")
    .bind(cutoff)
    .run();
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const corsHeaders = corsFor(request, env);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (url.pathname === "/health") {
      return json(
        {
          ok: true,
          service: "luowen-analytics",
          hashSaltConfigured: hasHashSalt(env),
        },
        {},
        corsHeaders
      );
    }

    if (url.pathname === "/collect" && request.method === "POST") {
      if (Math.random() < 0.01) ctx.waitUntil(cleanup(env));
      return collect(request, env, corsHeaders);
    }

    if (url.pathname === "/summary" && request.method === "GET") {
      return summary(request, env, corsHeaders);
    }

    if (url.pathname === "/export.csv" && request.method === "GET") {
      return exportCsv(request, env, corsHeaders);
    }

    return json(
      { ok: false, error: "not_found" },
      { status: 404 },
      corsHeaders
    );
  },
};
