import { z } from "zod";
import {
  identity,
  principal,
  permit,
  database,
  body,
  ClubError,
  apiError,
} from "@/lib/server";
export const dynamic = "force-dynamic";
const inputSchema = z.object({
  userId: z.string().trim().min(1).max(200),
  name: z.string().trim().min(2).max(80),
  role: z.enum(["reception", "gate", "player"]),
  status: z.enum(["active", "revoked"]),
});
export async function GET() {
  try {
    const userId = await identity(),
      db = database();
    const membership = await db
      .prepare("SELECT owner,role,status FROM staff WHERE user_id=?")
      .bind(userId)
      .first<{ owner: string; role: string; status: string }>();
    if (membership)
      return Response.json(
        {
          userId,
          role: membership.status === "active" ? membership.role : "revoked",
          members: [],
        },
        { headers: { "Cache-Control": "no-store" } },
      );
    const result = await db
      .prepare(
        "SELECT user_id,name,role,status,created_at FROM staff WHERE owner=? ORDER BY name",
      )
      .bind(userId)
      .all();
    return Response.json(
      { userId, role: "owner", members: result.results },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (e) {
    return apiError(e);
  }
}
export async function POST(req: Request) {
  try {
    const p = await principal();
    permit(p, ["owner"]);
    const parsed = inputSchema.safeParse(await body(req));
    if (!parsed.success)
      throw new ClubError("Revisá el identificador, nombre y rol.");
    const input = parsed.data,
      db = database();
    if (input.userId === p.userId)
      throw new ClubError(
        "No podés cambiar tu propio acceso de administración.",
      );
    const existing = await db
      .prepare("SELECT owner FROM staff WHERE user_id=?")
      .bind(input.userId)
      .first<{ owner: string }>();
    if (existing && existing.owner !== p.owner)
      throw new ClubError("Esa cuenta ya pertenece a otro espacio.", 409);
    const hasOwnSpace = await db
      .prepare(
        "SELECT id FROM plans WHERE owner=? UNION ALL SELECT user_id AS id FROM staff WHERE owner=? LIMIT 1",
      )
      .bind(input.userId, input.userId)
      .first();
    if (hasOwnSpace)
      throw new ClubError(
        "Esa cuenta ya administra un espacio. Usá una cuenta del personal sin datos propios.",
        409,
      );
    const now = new Date().toISOString();
    await db.batch([
      db
        .prepare(
          "INSERT INTO staff(user_id,owner,name,role,status,created_at) VALUES(?,?,?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET name=excluded.name,role=excluded.role,status=excluded.status WHERE staff.owner=excluded.owner",
        )
        .bind(input.userId, p.owner, input.name, input.role, input.status, now),
      db
        .prepare(
          "INSERT INTO audit(id,owner,action,detail,created_at) VALUES(?,?,?,?,?)",
        )
        .bind(
          crypto.randomUUID(),
          p.owner,
          "Acceso del equipo actualizado",
          `${input.name} · ${input.role} · ${input.status} · operador ${p.userId}`,
          now,
        ),
    ]);
    return Response.json(
      { ok: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (e) {
    return apiError(e);
  }
}
