import Link from "next/link";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Gestión no disponible", robots: { index: false, follow: false } };
export default function UnavailablePage() {
  return <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-6 px-6 py-16">
    <p className="text-sm font-semibold uppercase tracking-widest">Gold Gym Mercedes</p>
    <h1 className="text-4xl font-bold">La gestión todavía no está habilitada.</h1>
    <p>La web del club está disponible. El acceso a socios, pagos y reservas estará habilitado cuando finalice la puesta en marcha del sistema.</p>
    <Link href="/" className="underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4">Volver al inicio</Link>
  </main>;
}
