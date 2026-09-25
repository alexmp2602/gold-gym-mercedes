import {
  sqliteTable,
  text,
  integer,
  uniqueIndex,
  index,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
export const plans = sqliteTable("plans", {
  id: text("id").primaryKey(),
  owner: text("owner").notNull(),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  days: integer("days").notNull(),
});
export const members = sqliteTable(
  "members",
  {
    id: text("id").primaryKey(),
    owner: text("owner").notNull(),
    name: text("name").notNull(),
    dni: text("dni").notNull(),
    phone: text("phone").notNull().default(""),
    planId: text("plan_id")
      .notNull()
      .references(() => plans.id),
    status: text("status").notNull().default("active"),
    expires: text("expires").notNull(),
    createdAt: text("created_at").notNull(),
  },
  (t) => [
    uniqueIndex("members_owner_dni").on(t.owner, t.dni),
    index("members_owner_expiry").on(t.owner, t.expires),
  ],
);
export const payments = sqliteTable(
  "payments",
  {
    id: text("id").primaryKey(),
    owner: text("owner").notNull(),
    memberId: text("member_id")
      .notNull()
      .references(() => members.id),
    amount: integer("amount").notNull(),
    method: text("method").notNull(),
    createdAt: text("created_at").notNull(),
    requestKey: text("request_key").notNull(),
  },
  (t) => [
    uniqueIndex("payments_owner_request").on(t.owner, t.requestKey),
    index("payments_owner_date").on(t.owner, t.createdAt),
  ],
);
export const accesses = sqliteTable(
  "accesses",
  {
    id: text("id").primaryKey(),
    owner: text("owner").notNull(),
    memberId: text("member_id"),
    name: text("name").notNull(),
    allowed: integer("allowed").notNull(),
    reason: text("reason").notNull(),
    venue: text("venue").notNull(),
    createdAt: text("created_at").notNull(),
  },
  (t) => [index("accesses_owner_date").on(t.owner, t.createdAt)],
);
export const bookings = sqliteTable(
  "bookings",
  {
    createdBy: text("created_by"),
    id: text("id").primaryKey(),
    owner: text("owner").notNull(),
    court: integer("court").notNull(),
    day: text("day").notNull(),
    start: integer("start").notNull(),
    name: text("name").notNull(),
    phone: text("phone").notNull().default(""),
    kind: text("kind").notNull().default("booking"),
    status: text("status").notNull().default("confirmed"),
    amount: integer("amount").notNull().default(0),
    deposit: integer("deposit").notNull().default(0),
    createdAt: text("created_at").notNull(),
    requestKey: text("request_key").notNull(),
  },
  (t) => [
    uniqueIndex("bookings_active_slot")
      .on(t.owner, t.court, t.day, t.start)
      .where(sql`${t.status} = 'confirmed'`),
    uniqueIndex("bookings_owner_request").on(t.owner, t.requestKey),
    index("bookings_owner_day").on(t.owner, t.day),
  ],
);
export const sessions = sqliteTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    owner: text("owner").notNull(),
    name: text("name").notNull(),
    day: text("day").notNull(),
    time: text("time").notNull(),
    capacity: integer("capacity").notNull(),
    venue: text("venue").notNull(),
  },
  (t) => [index("sessions_owner_day").on(t.owner, t.day)],
);
export const enrollments = sqliteTable(
  "enrollments",
  {
    id: text("id").primaryKey(),
    owner: text("owner").notNull(),
    sessionId: text("session_id")
      .notNull()
      .references(() => sessions.id),
    memberId: text("member_id")
      .notNull()
      .references(() => members.id),
  },
  (t) => [
    uniqueIndex("enrollments_session_member").on(t.sessionId, t.memberId),
  ],
);
export const audit = sqliteTable(
  "audit",
  {
    id: text("id").primaryKey(),
    owner: text("owner").notNull(),
    action: text("action").notNull(),
    detail: text("detail").notNull(),
    createdAt: text("created_at").notNull(),
  },
  (t) => [index("audit_owner_date").on(t.owner, t.createdAt)],
);

export const staff = sqliteTable(
  "staff",
  {
    userId: text("user_id").primaryKey(),
    owner: text("owner").notNull(),
    name: text("name").notNull(),
    role: text("role").notNull(),
    status: text("status").notNull().default("active"),
    createdAt: text("created_at").notNull(),
  },
  (t) => [index("staff_owner").on(t.owner)],
);
export const imports = sqliteTable(
  "imports",
  {
    id: text("id").primaryKey(),
    owner: text("owner").notNull(),
    requestKey: text("request_key").notNull(),
    count: integer("count").notNull(),
    createdAt: text("created_at").notNull(),
  },
  (t) => [uniqueIndex("imports_owner_request").on(t.owner, t.requestKey)],
);
export const restores = sqliteTable("restores", {
  owner: text("owner").primaryKey(),
  requestKey: text("request_key").notNull(),
  count: integer("count").notNull(),
  createdAt: text("created_at").notNull(),
});

export const settings = sqliteTable("settings", {
  owner: text("owner").primaryKey(),
  padelPrice: integer("padel_price").notNull().default(24000),
  bookingDays: integer("booking_days").notNull().default(30),
  cancelHours: integer("cancel_hours").notNull().default(24),
});

export const bookingPayments = sqliteTable(
  "booking_payments",
  {
    id: text("id").primaryKey(),
    owner: text("owner").notNull(),
    bookingId: text("booking_id")
      .notNull()
      .references(() => bookings.id),
    kind: text("kind").notNull(),
    amount: integer("amount").notNull(),
    method: text("method").notNull(),
    createdAt: text("created_at").notNull(),
  },
  (t) => [
    uniqueIndex("booking_payments_kind").on(t.owner, t.bookingId, t.kind),
    index("booking_payments_owner_date").on(t.owner, t.createdAt),
  ],
);
