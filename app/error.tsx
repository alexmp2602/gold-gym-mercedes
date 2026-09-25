"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="proposal">
      <h1>
        No pudimos
        <br />
        <em>abrir esta página.</em>
      </h1>
      <p>Intentá nuevamente. Tus datos guardados no se modificaron.</p>
      <button className="button gold" onClick={reset}>
        Volver a intentar
      </button>
    </main>
  );
}
