-- PostgreSQL schema for the independent Gold Gym backend.
-- No club data is exposed through Supabase's public Data API.
CREATE SCHEMA club;
REVOKE ALL ON SCHEMA club FROM PUBLIC, anon, authenticated;
CREATE ROLE gold_gym_app NOLOGIN NOINHERIT;
GRANT gold_gym_app TO postgres;
GRANT USAGE ON SCHEMA club TO gold_gym_app;
SET search_path TO club, pg_catalog;
CREATE TABLE "plans" (
	"id" text PRIMARY KEY NOT NULL,
	"owner" text NOT NULL,
	"name" text NOT NULL,
	"price" integer NOT NULL,
	"days" integer NOT NULL
);

CREATE TABLE "members" (
	"id" text PRIMARY KEY NOT NULL,
	"owner" text NOT NULL,
	"name" text NOT NULL,
	"dni" text NOT NULL,
	"phone" text DEFAULT '' NOT NULL,
	"plan_id" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"expires" text NOT NULL,
	"created_at" text NOT NULL,
	FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON UPDATE no action ON DELETE no action
);

CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"owner" text NOT NULL,
	"name" text NOT NULL,
	"day" text NOT NULL,
	"time" text NOT NULL,
	"capacity" integer NOT NULL,
	"venue" text NOT NULL
);

CREATE TABLE "payments" (
	"id" text PRIMARY KEY NOT NULL,
	"owner" text NOT NULL,
	"member_id" text NOT NULL,
	"amount" integer NOT NULL,
	"method" text NOT NULL,
	"created_at" text NOT NULL,
	"request_key" text NOT NULL,
	FOREIGN KEY ("member_id") REFERENCES "members"("id") ON UPDATE no action ON DELETE no action
);

CREATE TABLE "accesses" (
	"id" text PRIMARY KEY NOT NULL,
	"owner" text NOT NULL,
	"member_id" text,
	"name" text NOT NULL,
	"allowed" integer NOT NULL,
	"reason" text NOT NULL,
	"venue" text NOT NULL,
	"created_at" text NOT NULL
);

CREATE TABLE "audit" (
	"id" text PRIMARY KEY NOT NULL,
	"owner" text NOT NULL,
	"action" text NOT NULL,
	"detail" text NOT NULL,
	"created_at" text NOT NULL
);

CREATE TABLE "bookings" (
	"id" text PRIMARY KEY NOT NULL,
	"owner" text NOT NULL,
	"court" integer NOT NULL,
	"day" text NOT NULL,
	"start" integer NOT NULL,
	"name" text NOT NULL,
	"phone" text DEFAULT '' NOT NULL,
	"kind" text DEFAULT 'booking' NOT NULL,
	"status" text DEFAULT 'confirmed' NOT NULL,
	"amount" integer DEFAULT 0 NOT NULL,
	"deposit" integer DEFAULT 0 NOT NULL,
	"created_at" text NOT NULL,
	"request_key" text NOT NULL
);

CREATE TABLE "enrollments" (
	"id" text PRIMARY KEY NOT NULL,
	"owner" text NOT NULL,
	"session_id" text NOT NULL,
	"member_id" text NOT NULL,
	FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON UPDATE no action ON DELETE no action,
	FOREIGN KEY ("member_id") REFERENCES "members"("id") ON UPDATE no action ON DELETE no action
);

CREATE TABLE "staff" (
	"user_id" text PRIMARY KEY NOT NULL,
	"owner" text NOT NULL,
	"name" text NOT NULL,
	"role" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" text NOT NULL
);

CREATE TABLE "imports" (
	"id" text PRIMARY KEY NOT NULL,
	"owner" text NOT NULL,
	"request_key" text NOT NULL,
	"count" integer NOT NULL,
	"created_at" text NOT NULL
);

CREATE TABLE "restores" (
	"owner" text PRIMARY KEY NOT NULL,
	"request_key" text NOT NULL,
	"count" integer NOT NULL,
	"created_at" text NOT NULL
);

CREATE TABLE "settings" (
	"owner" text PRIMARY KEY NOT NULL,
	"padel_price" integer DEFAULT 24000 NOT NULL,
	"booking_days" integer DEFAULT 30 NOT NULL,
	"cancel_hours" integer DEFAULT 24 NOT NULL
);

CREATE TABLE "booking_payments" (
	"id" text PRIMARY KEY NOT NULL,
	"owner" text NOT NULL,
	"booking_id" text NOT NULL,
	"kind" text NOT NULL,
	"amount" integer NOT NULL,
	"method" text NOT NULL,
	"created_at" text NOT NULL,
	FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON UPDATE no action ON DELETE no action
);
CREATE INDEX "accesses_owner_date" ON "accesses" ("owner","created_at");
CREATE INDEX "audit_owner_date" ON "audit" ("owner","created_at");
CREATE UNIQUE INDEX "bookings_active_slot" ON "bookings" ("owner","court","day","start") WHERE "bookings"."status" = 'confirmed';
CREATE UNIQUE INDEX "bookings_owner_request" ON "bookings" ("owner","request_key");
CREATE INDEX "bookings_owner_day" ON "bookings" ("owner","day");
CREATE UNIQUE INDEX "enrollments_session_member" ON "enrollments" ("session_id","member_id");
CREATE UNIQUE INDEX "members_owner_dni" ON "members" ("owner","dni");
CREATE INDEX "members_owner_expiry" ON "members" ("owner","expires");
CREATE UNIQUE INDEX "payments_owner_request" ON "payments" ("owner","request_key");
CREATE INDEX "payments_owner_date" ON "payments" ("owner","created_at");
CREATE INDEX "sessions_owner_day" ON "sessions" ("owner","day");
CREATE INDEX "staff_owner" ON "staff" ("owner");
CREATE UNIQUE INDEX "imports_owner_request" ON "imports" ("owner","request_key");
ALTER TABLE "bookings" ADD "created_by" text;
CREATE UNIQUE INDEX "booking_payments_kind" ON "booking_payments" ("owner","booking_id","kind");
CREATE INDEX "booking_payments_owner_date" ON "booking_payments" ("owner","created_at");

CREATE TABLE auth_limits (
  key text NOT NULL,
  bucket bigint NOT NULL,
  attempts integer NOT NULL DEFAULT 0,
  PRIMARY KEY(key,bucket)
);
CREATE INDEX auth_limits_bucket ON auth_limits(bucket);
ALTER TABLE plans ADD CHECK(price >= 0 AND days BETWEEN 1 AND 366);
ALTER TABLE payments ADD CHECK(amount >= 0);
ALTER TABLE bookings ADD CHECK(court BETWEEN 1 AND 4 AND amount >= 0 AND deposit BETWEEN 0 AND amount);
ALTER TABLE sessions ADD CHECK(capacity BETWEEN 1 AND 100);
ALTER TABLE staff ADD CHECK(role IN ('reception','gate','player') AND status IN ('active','revoked'));
ALTER TABLE booking_payments ADD CHECK(amount > 0 AND kind IN ('deposit','settlement'));
REVOKE ALL ON ALL TABLES IN SCHEMA club FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA club TO gold_gym_app;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY club_scope ON plans TO gold_gym_app
  USING (owner = current_setting('app.club_owner', true))
  WITH CHECK (owner = current_setting('app.club_owner', true));
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
CREATE POLICY club_scope ON members TO gold_gym_app
  USING (owner = current_setting('app.club_owner', true))
  WITH CHECK (owner = current_setting('app.club_owner', true));
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY club_scope ON sessions TO gold_gym_app
  USING (owner = current_setting('app.club_owner', true))
  WITH CHECK (owner = current_setting('app.club_owner', true));
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY club_scope ON payments TO gold_gym_app
  USING (owner = current_setting('app.club_owner', true))
  WITH CHECK (owner = current_setting('app.club_owner', true));
ALTER TABLE accesses ENABLE ROW LEVEL SECURITY;
CREATE POLICY club_scope ON accesses TO gold_gym_app
  USING (owner = current_setting('app.club_owner', true))
  WITH CHECK (owner = current_setting('app.club_owner', true));
ALTER TABLE audit ENABLE ROW LEVEL SECURITY;
CREATE POLICY club_scope ON audit TO gold_gym_app
  USING (owner = current_setting('app.club_owner', true))
  WITH CHECK (owner = current_setting('app.club_owner', true));
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY club_scope ON bookings TO gold_gym_app
  USING (owner = current_setting('app.club_owner', true))
  WITH CHECK (owner = current_setting('app.club_owner', true));
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY club_scope ON enrollments TO gold_gym_app
  USING (owner = current_setting('app.club_owner', true))
  WITH CHECK (owner = current_setting('app.club_owner', true));
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
CREATE POLICY club_scope ON staff TO gold_gym_app
  USING (owner = current_setting('app.club_owner', true))
  WITH CHECK (owner = current_setting('app.club_owner', true));
ALTER TABLE imports ENABLE ROW LEVEL SECURITY;
CREATE POLICY club_scope ON imports TO gold_gym_app
  USING (owner = current_setting('app.club_owner', true))
  WITH CHECK (owner = current_setting('app.club_owner', true));
ALTER TABLE restores ENABLE ROW LEVEL SECURITY;
CREATE POLICY club_scope ON restores TO gold_gym_app
  USING (owner = current_setting('app.club_owner', true))
  WITH CHECK (owner = current_setting('app.club_owner', true));
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY club_scope ON settings TO gold_gym_app
  USING (owner = current_setting('app.club_owner', true))
  WITH CHECK (owner = current_setting('app.club_owner', true));
ALTER TABLE booking_payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY club_scope ON booking_payments TO gold_gym_app
  USING (owner = current_setting('app.club_owner', true))
  WITH CHECK (owner = current_setting('app.club_owner', true));
ALTER TABLE auth_limits ENABLE ROW LEVEL SECURITY;
CREATE POLICY service_limits ON auth_limits TO gold_gym_app USING (true) WITH CHECK (true);
RESET search_path;
