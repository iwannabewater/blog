CREATE TABLE IF NOT EXISTS visits (
  id TEXT PRIMARY KEY,
  received_at TEXT NOT NULL,
  occurred_at TEXT,
  event_type TEXT NOT NULL DEFAULT 'pageview',
  path TEXT NOT NULL,
  normalized_path TEXT NOT NULL,
  title TEXT,
  referrer TEXT,
  referrer_host TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  visitor_id_hash TEXT,
  session_id_hash TEXT,
  ip_hash TEXT,
  ip_address TEXT,
  country TEXT,
  region TEXT,
  city TEXT,
  postal_code TEXT,
  continent TEXT,
  timezone TEXT,
  latitude TEXT,
  longitude TEXT,
  colo TEXT,
  asn TEXT,
  as_organization TEXT,
  user_agent TEXT,
  browser TEXT,
  device TEXT,
  language TEXT,
  languages TEXT,
  client_timezone TEXT,
  viewport_width INTEGER,
  viewport_height INTEGER,
  screen_width INTEGER,
  screen_height INTEGER,
  color_scheme TEXT
);

CREATE INDEX IF NOT EXISTS idx_visits_received_at
  ON visits (received_at);

CREATE INDEX IF NOT EXISTS idx_visits_path_received_at
  ON visits (normalized_path, received_at);

CREATE INDEX IF NOT EXISTS idx_visits_location_received_at
  ON visits (country, region, city, received_at);

CREATE INDEX IF NOT EXISTS idx_visits_session_path_recent
  ON visits (session_id_hash, path, received_at);

CREATE INDEX IF NOT EXISTS idx_visits_visitor_received_at
  ON visits (visitor_id_hash, received_at);
