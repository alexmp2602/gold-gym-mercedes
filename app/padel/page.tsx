import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, MapPin, ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { brand, venues } from "@/lib/content";
export const metadata: Metadata = { title: "Pádel · Unión Gold Club" };
export default function Padel() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero padel-hero">
          <div className="hero-copy">
            <p className="eyebrow">UNIÓN GOLD CLUB / MERCEDES</p>
            <h1>
              ¿SALE
              <br />
              <em>PARTIDO?</em>
            </h1>
            <p className="hero-description">
              Traé la paleta. Juntá a tu equipo.
              <br />
              Nos vemos en la cancha.
            </p>
            <div className="hero-actions">
              <a
                className="button gold"
                href={brand.fixedBookings}
                target="_blank"
                rel="noopener noreferrer"
              >
                Consultá por turnos <ArrowUpRight size={20} />
              </a>
              <a
                href={brand.booking}
                target="_blank"
                rel="noopener noreferrer"
                className="text-link"
              >
                Donde Juego para iPhone <ArrowUpRight size={16} />
              </a>
            </div>
            <div className="hero-foot">
              <span>4 CANCHAS</span>
              <span>SINTÉTICO + BLINDEX</span>
            </div>
          </div>
          <div className="hero-visual">
            <img
              src="/images/padel.webp"
              alt="Partido en una cancha de Unión Gold Club"
              width="1080"
              height="1350"
              fetchPriority="high"
            />
            <div className="image-caption">
              <span>CALLE 103 Y 28 · MERCEDES</span>
              <MapPin />
            </div>
          </div>
        </section>
        <section className="section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">MÁS QUE UN TURNO</p>
              <h2>
                Tu próximo
                <br />
                <em>punto de encuentro.</em>
              </h2>
            </div>
            <p>
              Un club para jugar,
              <br />
              competir y compartir.
            </p>
          </div>
          <div className="benefit-grid">
            {[
              [
                "01",
                "Cuatro canchas",
                "Canchas con sintético y blindex para armar tu próximo partido.",
              ],
              [
                "02",
                "Quedate un rato más",
                "Buffet Lo de Bauti para compartir algo después de jugar.",
              ],
              [
                "03",
                "Todo a mano",
                "Vestuarios y duchas para que sigas con tu día.",
              ],
              [
                "04",
                "Jugamos en comunidad",
                "Torneos y encuentros. Encontrá las novedades en nuestro Instagram.",
              ],
            ].map(([n, h, p]) => (
              <article key={n}>
                <small>{n}</small>
                <h3>{h}</h3>
                <p>{p}</p>
              </article>
            ))}
          </div>
          <div className="link-row">
            <a
              href={brand.buffet}
              className="text-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver menú del buffet <ArrowUpRight size={18} />
            </a>
            <a
              href={brand.padel}
              className="text-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Novedades y torneos <ArrowUpRight size={18} />
            </a>
            <a
              href={venues[2].map}
              className="text-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Cómo llegar <ArrowUpRight size={18} />
            </a>
          </div>
        </section>
        <section className="closing-cta">
          <p className="eyebrow">HACETE EL ESPACIO</p>
          <h2>
            Un turno fijo.
            <br />
            <em>Un buen plan.</em>
          </h2>
          <a
            href={brand.fixedBookings}
            className="button gold"
            target="_blank"
            rel="noopener noreferrer"
          >
            Consultá disponibilidad <ArrowUpRight size={20} />
          </a>
          <p className="muted">
            La reserva se coordina por los canales actuales del club.
          </p>
        </section>
        <div className="preview-entry">
          <span>Presentación privada · nueva plataforma</span>
          <Link href="/reservas">
            Probar la agenda de pádel <ArrowRight size={16} />
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
