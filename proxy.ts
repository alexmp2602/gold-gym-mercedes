import { supportsSitesIdentity } from "@club/runtime";
import { NextResponse, type NextRequest } from "next/server";

// Only the native Next.js build uses this boundary. Vinext keeps its existing
// authenticated Workers backend. Never forward public identity headers to it.
export function proxy(request: NextRequest) {
  if (supportsSitesIdentity) return NextResponse.next();
  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json(
      { error: "La gestión todavía no está habilitada en este alojamiento." },
      { status: 503, headers: { "Cache-Control": "no-store", "Retry-After": "3600" } },
    );
  }
  return NextResponse.rewrite(new URL("/sistema-no-disponible", request.url), {
    headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" },
  });
}
export const config = {
  matcher: ["/api/:path*", "/gestion/:path*", "/ingreso/:path*", "/reservas/:path*", "/jugar/:path*", "/configuracion/:path*", "/equipo/:path*", "/datos/:path*", "/reportes/:path*", "/signin-with-chatgpt/:path*", "/signout-with-chatgpt/:path*", "/callback/:path*"],
};
