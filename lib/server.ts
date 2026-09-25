import { env, supportsSitesIdentity, independentUserId, ownerAccount } from "@club/runtime";
import { getChatGPTUser } from "@/app/chatgpt-auth";
export class ClubError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}
export type ClubRole = "owner" | "reception" | "gate" | "player";
export type Principal = { userId: string; owner: string; role: ClubRole };
export async function identity() {
  if (!supportsSitesIdentity) {
    const id = await independentUserId();
    if (id) return id;
  } else {
    const user = await getChatGPTUser();
    if (user) return user.userId;
    if (process.env.NODE_ENV === "development") return "local-preview";
  }
  throw new ClubError("Iniciá sesión para abrir la gestión privada.", 401);
}
export function database(): D1Database {
  if (!env.DB)
    throw new ClubError(
      "No pudimos conectar con la base de datos. Intentá de nuevo.",
      503,
    );
  return env.DB;
}
export async function principal(): Promise<Principal> {
  const userId = await identity();
  const membership = await database()
    .prepare("SELECT owner,role,status FROM staff WHERE user_id=?")
    .bind(userId)
    .first<{ owner: string; role: string; status: string }>();
  if (!membership) {
    if (supportsSitesIdentity || ownerAccount(userId)) return { userId, owner: userId, role: "owner" };
    throw new ClubError("Tu cuenta todavía no tiene acceso al club. Contactá a la administración.", 403);
  }
  if (
    membership.status !== "active" ||
    !["reception", "gate", "player"].includes(membership.role)
  )
    throw new ClubError(
      "Tu acceso al club fue desactivado. Contactá a la administración.",
      403,
    );
  return { userId, owner: membership.owner, role: membership.role as ClubRole };
}
export function permit(p: Principal, roles: ClubRole[]) {
  if (!roles.includes(p.role))
    throw new ClubError("Tu rol no permite realizar esta acción.", 403);
}
export async function body(req: Request, maxLength = 16000) {
  const origin = req.headers.get("origin");
  if (origin && origin !== new URL(req.url).origin)
    throw new ClubError("Origen no permitido.", 403);
  if (!req.headers.get("content-type")?.includes("application/json"))
    throw new ClubError("Formato de solicitud inválido.", 415);
  if (Number(req.headers.get("content-length")) > maxLength)
    throw new ClubError("Solicitud demasiado grande.", 413);
  // Bound bytes while reading, including chunked requests without Content-Length.
  const reader = req.body?.getReader();
  if (!reader) throw new ClubError("Datos inválidos.");
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let raw = "",
    size = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxLength) {
        await reader.cancel();
        throw new ClubError("Solicitud demasiado grande.", 413);
      }
      raw += decoder.decode(value, { stream: true });
    }
    raw += decoder.decode();
  } catch (error) {
    if (error instanceof ClubError) throw error;
    throw new ClubError("No se pudo leer la solicitud.");
  } finally {
    reader.releaseLock();
  }
  try {
    return JSON.parse(raw);
  } catch {
    throw new ClubError("Datos inválidos.");
  }
}
export function apiError(error: unknown) {
  return Response.json(
    {
      error:
        error instanceof ClubError
          ? error.message
          : "No pudimos completar la operación. Intentá nuevamente.",
    },
    {
      status: error instanceof ClubError ? error.status : 503,
      headers: { "Cache-Control": "no-store" },
    },
  );
}
