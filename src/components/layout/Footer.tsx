"use client";

import type { AgroDirectoState } from "@/hooks/useAgroDirecto";

export function Footer({ navigate, setModal }: Pick<AgroDirectoState, "navigate" | "setModal">) {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <div className="footer-brand">
            <span className="brand-mark">A</span>
            <strong>AgroDirecto</strong>
          </div>
          <p>Prototipo académico que conecta productores peruanos con compradores locales.</p>
        </div>
        <div>
          <h3>Plataforma</h3>
          <button onClick={() => navigate("catalogo")}>Catálogo</button>
          <button onClick={() => navigate("registro")}>Crear cuenta</button>
          <button onClick={() => navigate("pedidos")}>Mis pedidos</button>
        </div>
        <div>
          <h3>Transparencia</h3>
          <p>Sin cobros en línea</p>
          <p>Ubicación aproximada</p>
          <p>Datos de demostración</p>
        </div>
        <div>
          <h3>Proyecto</h3>
          <p>Desarrollo Full Stack</p>
          <p>Avance 1 · Semana 8</p>
          <p>UTP · 2026</p>
          <button className="reset-demo-link" onClick={() => setModal({ type: "reset" })}>
            Restablecer demostración
          </button>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 AgroDirecto · Proyecto académico</span>
        <span>Mapas © OpenStreetMap contributors</span>
      </div>
    </footer>
  );
}
