-- Migration 014: First-party Real User Monitoring (RUM) for Core Web Vitals
-- Stores CWV readings beaconed from the browser via /api/vitals.
-- Eliminates dependency on PSI / CrUX API for CWV verification.

CREATE TABLE IF NOT EXISTS cwv_readings (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    url           VARCHAR(2048) NOT NULL,
    metric_name   VARCHAR(10)   NOT NULL
                  CHECK (metric_name IN ('LCP', 'INP', 'CLS', 'FCP', 'TTFB')),
    value         DECIMAL(14, 4) NOT NULL,
    rating        VARCHAR(20)   NOT NULL
                  CHECK (rating IN ('good', 'needs-improvement', 'poor')),
    metric_id     VARCHAR(120),          -- web-vitals unique-per-page-load ID
    delta         DECIMAL(14, 4),        -- increment since last report
    navigation_type VARCHAR(30),         -- navigate | reload | back-forward | prerender
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cwv_url         ON cwv_readings (url);
CREATE INDEX IF NOT EXISTS idx_cwv_metric      ON cwv_readings (metric_name);
CREATE INDEX IF NOT EXISTS idx_cwv_created_at  ON cwv_readings (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cwv_url_metric  ON cwv_readings (url, metric_name);

-- Auto-prune readings older than 90 days to keep the table lean.
-- Run this periodically (e.g. a daily cron) or via Supabase pg_cron:
--   SELECT cron.schedule('cwv-prune', '0 3 * * *',
--     $$DELETE FROM cwv_readings WHERE created_at < NOW() - INTERVAL '90 days'$$);
