import Link from "next/link";
export default function NotFound() {
  return (
    <main className="proposal">
      <p className="eyebrow">GOLD GYM / 404</p>
      <h1>
        Por acá
        <br />
        <em>no es.</em>
      </h1>
      <p>La página que buscás no está disponible.</p>
      <Link href="/" className="button gold">
        Volver al inicio
      </Link>
    </main>
  );
}
