"use client";

import type { AgroDirectoState } from "@/hooks/useAgroDirecto";

export function Header({
  navigate,
  setMobileOpen,
  mobileOpen,
  view,
  setFavoritesOnly,
  sessionRole,
  favorites,
  setSearch,
  setCategory,
  cartCount,
  logout,
}: Pick<
  AgroDirectoState,
  | "navigate"
  | "setMobileOpen"
  | "mobileOpen"
  | "view"
  | "setFavoritesOnly"
  | "sessionRole"
  | "favorites"
  | "setSearch"
  | "setCategory"
  | "cartCount"
  | "logout"
>) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <button
          className="brand"
          onClick={() => navigate("inicio")}
          aria-label="Ir al inicio de AgroDirecto"
        >
          <span className="brand-mark">A</span>
          <span>
            <strong>Agro</strong>Directo<small>Del campo a tu negocio</small>
          </span>
        </button>
        <button
          className="mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-label="Abrir menú"
        >
          {mobileOpen ? "×" : "☰"}
        </button>
        <nav
          className={`main-nav ${mobileOpen ? "is-open" : ""}`}
          aria-label="Navegación principal"
        >
          <button className={view === "inicio" ? "active" : ""} onClick={() => navigate("inicio")}>
            Inicio
          </button>
          <button
            className={view === "catalogo" || view === "producto" ? "active" : ""}
            onClick={() => {
              setFavoritesOnly(false);
              navigate("catalogo");
            }}
          >
            Productos
          </button>
          <button
            onClick={() => {
              navigate("inicio");
              window.setTimeout(
                () =>
                  document.getElementById("como-funciona")?.scrollIntoView({ behavior: "smooth" }),
                100,
              );
            }}
          >
            Cómo funciona
          </button>
          <button onClick={() => navigate("productor")}>Productores</button>
        </nav>
        <div className="header-actions">
          <button
            className="account-link"
            onClick={() =>
              sessionRole
                ? navigate(
                    sessionRole === "productor"
                      ? "productor"
                      : sessionRole === "administrador"
                        ? "admin"
                        : "pedidos",
                  )
                : navigate("login")
            }
          >
            <span aria-hidden="true">◯</span> {sessionRole ? "Mi panel" : "Mi cuenta"}
          </button>
          {favorites.length ? (
            <button
              className="favorites-link"
              onClick={() => {
                setSearch("");
                setCategory("Todos");
                setFavoritesOnly(true);
                navigate("catalogo");
              }}
              aria-label={`${favorites.length} productos favoritos`}
            >
              ♥<span>{favorites.length}</span>
            </button>
          ) : null}
          <button
            className="cart-link"
            onClick={() => navigate("carrito")}
            aria-label={`Carrito con ${cartCount} productos`}
          >
            <span aria-hidden="true">▢</span>
            <span className="cart-badge">{cartCount}</span>
          </button>
          {sessionRole ? (
            <button
              className="logout-link"
              onClick={logout}
              title="Cerrar sesión de demostración"
              aria-label="Cerrar sesión"
            >
              Salir
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
