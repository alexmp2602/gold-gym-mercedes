import Link from "next/link";
import { brand } from "@/lib/content";
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div>
          <strong>GOLD GYM</strong>
          <p>Nos vemos en el club.</p>
        </div>
        <div>
          <a href={brand.instagram} target="_blank" rel="noopener noreferrer">
            Instagram · Gimnasio ↗
          </a>
          <a href={brand.padel} target="_blank" rel="noopener noreferrer">
            Instagram · Pádel ↗
          </a>
          <a href={brand.contact} target="_blank" rel="noopener noreferrer">
            Hablemos por WhatsApp ↗
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>Mercedes, Buenos Aires · Argentina</span>
        <Link href="/gestion">Gestión del club</Link>
        <Link href="/propuesta">Presentación del proyecto</Link>
      </div>
    </footer>
  );
}
