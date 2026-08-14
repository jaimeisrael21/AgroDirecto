"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";

type View =
  | "inicio"
  | "login"
  | "registro"
  | "catalogo"
  | "producto"
  | "carrito"
  | "confirmar"
  | "pedidos"
  | "productor"
  | "publicar"
  | "recibidos"
  | "admin";

type Role = "comprador" | "productor" | "administrador";
type ProductStatus = "Activo" | "Borrador" | "Retirado";
type OrderStatus =
  | "Pendiente"
  | "Aceptado"
  | "Rechazado"
  | "En preparación"
  | "Listo para entrega"
  | "Entregado"
  | "Cancelado";

type Product = {
  id: number;
  name: string;
  category: string;
  producerId: number;
  producer: string;
  location: string;
  lat: number;
  lng: number;
  unit: string;
  price: number;
  stock: number;
  image: string;
  organic?: boolean;
  harvest: string;
  description: string;
  status?: ProductStatus;
  updatedAt?: string;
};

type CartItem = { productId: number; quantity: number };
type Order = {
  id: string;
  producerId: number;
  producer: string;
  date: string;
  status: OrderStatus;
  items: CartItem[];
  total: number;
  address: string;
  note: string;
};

const PRODUCTS: Product[] = [
  { id: 1, name: "Papa amarilla seleccionada", category: "Tubérculos", producerId: 1, producer: "AndesVerde", location: "Concepción, Junín", lat: -11.917, lng: -75.314, unit: "Saco de 50 kg", price: 118, stock: 18, image: "/images/products/potatoes.jpg", organic: true, harvest: "Cosecha: 12 ago. 2026", description: "Papa amarilla de textura cremosa, seleccionada en origen y preparada para restaurantes y comercios." },
  { id: 2, name: "Tomate italiano", category: "Hortalizas", producerId: 2, producer: "ValleFresco", location: "Pachacútec, Ica", lat: -14.04, lng: -75.728, unit: "Caja de 20 kg", price: 52, stock: 26, image: "/images/products/tomatoes.jpg", harvest: "Cosecha: 13 ago. 2026", description: "Tomate firme y uniforme, ideal para cocina, salsas y abastecimiento de negocios gastronómicos." },
  { id: 3, name: "Palta Hass", category: "Frutas", producerId: 3, producer: "AgroSol", location: "Huanta, Ayacucho", lat: -12.94, lng: -74.247, unit: "Jaba de 18 kg", price: 96, stock: 14, image: "/images/products/avocados.jpg", organic: true, harvest: "Cosecha: 10 ago. 2026", description: "Paltas calibradas y listas para maduración controlada, provenientes de pequeños productores asociados." },
  { id: 4, name: "Café orgánico tostado", category: "Granos", producerId: 4, producer: "Finca El Mirador", location: "Villa Rica, Pasco", lat: -10.738, lng: -75.269, unit: "Bolsa de 1 kg", price: 32, stock: 32, image: "/images/products/coffee.jpg", organic: true, harvest: "Tueste: 11 ago. 2026", description: "Café arábica de altura con notas de cacao y frutos secos, tostado en lotes pequeños." },
  { id: 5, name: "Quinua blanca", category: "Granos", producerId: 5, producer: "Altura Puno", location: "Juli, Puno", lat: -16.214, lng: -69.459, unit: "Saco de 25 kg", price: 145, stock: 20, image: "/images/products/grains.jpg", organic: true, harvest: "Cosecha: jul. 2026", description: "Quinua limpia y seleccionada, con trazabilidad de comunidad y presentación para compra mayorista." },
  { id: 6, name: "Plátano isla", category: "Frutas", producerId: 6, producer: "Selva Norte", location: "Moyobamba, San Martín", lat: -6.034, lng: -76.974, unit: "Racimo", price: 28, stock: 24, image: "/images/products/bananas.jpg", harvest: "Corte: 12 ago. 2026", description: "Plátano isla de pulpa dulce, cortado por pedido y acondicionado para transporte regional." },
  { id: 7, name: "Cebolla roja", category: "Hortalizas", producerId: 2, producer: "ValleFresco", location: "Pachacútec, Ica", lat: -14.04, lng: -75.728, unit: "Saco de 30 kg", price: 82, stock: 17, image: "/images/products/tomatoes.jpg", harvest: "Cosecha: 09 ago. 2026", description: "Cebolla roja seca y clasificada por tamaño para comercios y cocinas de alta rotación." },
  { id: 8, name: "Papa canchán", category: "Tubérculos", producerId: 1, producer: "AndesVerde", location: "Concepción, Junín", lat: -11.917, lng: -75.314, unit: "Saco de 50 kg", price: 95, stock: 12, image: "/images/products/potatoes.jpg", harvest: "Cosecha: 08 ago. 2026", description: "Variedad canchán de buen rendimiento, clasificada y empacada para abastecimiento comercial." },
  { id: 9, name: "Tomate cherry", category: "Hortalizas", producerId: 2, producer: "ValleFresco", location: "Pachacútec, Ica", lat: -14.04, lng: -75.728, unit: "Caja de 10 kg", price: 44, stock: 19, image: "/images/products/tomatoes.jpg", organic: true, harvest: "Cosecha: 13 ago. 2026", description: "Tomate cherry uniforme, fresco y listo para ensaladas, barras y restaurantes." },
  { id: 10, name: "Palta fuerte", category: "Frutas", producerId: 3, producer: "AgroSol", location: "Huanta, Ayacucho", lat: -12.94, lng: -74.247, unit: "Jaba de 18 kg", price: 84, stock: 9, image: "/images/products/avocados.jpg", harvest: "Cosecha: 10 ago. 2026", description: "Palta fuerte de productores familiares, con selección visual y control de maduración." },
  { id: 11, name: "Café tostado medio", category: "Granos", producerId: 4, producer: "Finca El Mirador", location: "Villa Rica, Pasco", lat: -10.738, lng: -75.269, unit: "Bolsa de 500 g", price: 18, stock: 40, image: "/images/products/coffee.jpg", harvest: "Tueste: 12 ago. 2026", description: "Café de tueste medio para cafeterías y tiendas especializadas, en empaque de demostración." },
  { id: 12, name: "Quinua roja", category: "Granos", producerId: 5, producer: "Altura Puno", location: "Juli, Puno", lat: -16.214, lng: -69.459, unit: "Saco de 25 kg", price: 168, stock: 11, image: "/images/products/grains.jpg", organic: true, harvest: "Cosecha: jul. 2026", description: "Quinua roja de altura con selección por lote y disponibilidad para compras recurrentes." },
  { id: 13, name: "Camote amarillo", category: "Tubérculos", producerId: 1, producer: "AndesVerde", location: "Concepción, Junín", lat: -11.917, lng: -75.314, unit: "Saco de 25 kg", price: 64, stock: 15, image: "/images/products/potatoes.jpg", harvest: "Cosecha: 14 ago. 2026", description: "Camote amarillo seleccionado por tamaño, de pulpa dulce y disponibilidad para comercios y restaurantes." },
  { id: 14, name: "Plátano bellaco", category: "Frutas", producerId: 6, producer: "Selva Norte", location: "Moyobamba, San Martín", lat: -6.034, lng: -76.974, unit: "Racimo", price: 31, stock: 21, image: "/images/products/bananas.jpg", harvest: "Corte: 14 ago. 2026", description: "Plátano bellaco firme, cosechado por pedido y acondicionado para transporte y preparación gastronómica." },
  { id: 15, name: "Quinua negra", category: "Granos", producerId: 5, producer: "Altura Puno", location: "Juli, Puno", lat: -16.214, lng: -69.459, unit: "Saco de 25 kg", price: 176, stock: 8, image: "/images/products/grains.jpg", organic: true, harvest: "Cosecha: jul. 2026", description: "Quinua negra de altura, seleccionada por lote y orientada a tiendas saludables y compras especializadas." },
  { id: 16, name: "Café molido de altura", category: "Granos", producerId: 4, producer: "Finca El Mirador", location: "Villa Rica, Pasco", lat: -10.738, lng: -75.269, unit: "Bolsa de 500 g", price: 21, stock: 35, image: "/images/products/coffee.jpg", harvest: "Tueste: 14 ago. 2026", description: "Café arábica molido de tueste medio, preparado en lotes pequeños para cafeterías, tiendas y oficinas." },
];

const PRODUCT_IMAGE_PRESETS = [
  { label: "Tubérculos", value: "/images/products/potatoes.jpg" },
  { label: "Hortalizas", value: "/images/products/tomatoes.jpg" },
  { label: "Frutas", value: "/images/products/avocados.jpg" },
  { label: "Plátanos", value: "/images/products/bananas.jpg" },
  { label: "Café", value: "/images/products/coffee.jpg" },
  { label: "Granos", value: "/images/products/grains.jpg" },
] as const;

const STORAGE_KEYS = {
  products: "agrodirecto-products-v2",
  cart: "agrodirecto-cart-v2",
  orders: "agrodirecto-orders-v2",
  favorites: "agrodirecto-favorites-v2",
  sessionRole: "agrodirecto-session-role-v2",
} as const;

const INITIAL_ORDERS: Order[] = [
  { id: "AG-2408", producerId: 1, producer: "AndesVerde", date: "12 ago. 2026", status: "En preparación", items: [{ productId: 1, quantity: 2 }, { productId: 8, quantity: 1 }], total: 331, address: "Av. Javier Prado 2450, San Borja", note: "Recepción por almacén de 9:00 a 13:00." },
  { id: "AG-2381", producerId: 2, producer: "ValleFresco", date: "08 ago. 2026", status: "Entregado", items: [{ productId: 2, quantity: 3 }], total: 156, address: "Jr. Junín 520, Cercado de Lima", note: "Pedido recibido conforme." },
  { id: "AG-2412", producerId: 1, producer: "AndesVerde", date: "13 ago. 2026", status: "Pendiente", items: [{ productId: 1, quantity: 1 }], total: 118, address: "Av. La Molina 1680, La Molina", note: "Confirmar disponibilidad por la mañana." },
];

const VIEW_LABELS: Record<View, string> = {
  inicio: "Inicio", login: "Iniciar sesión", registro: "Crear cuenta", catalogo: "Catálogo", producto: "Detalle del producto", carrito: "Carrito", confirmar: "Confirmar pedido", pedidos: "Mis pedidos", productor: "Panel del productor", publicar: "Publicar producto", recibidos: "Pedidos recibidos", admin: "Administración",
};

const STATUS_STEP: Record<OrderStatus, number> = {
  Pendiente: 1, Aceptado: 2, "En preparación": 3, "Listo para entrega": 4, Entregado: 5, Rechazado: 0, Cancelado: 0,
};

function money(value: number) {
  return new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(value);
}

function statusClass(status: OrderStatus) {
  if (status === "Entregado") return "status-success";
  if (status === "Rechazado" || status === "Cancelado") return "status-danger";
  if (status === "Pendiente") return "status-warning";
  return "status-info";
}

function productStatus(product: Product): ProductStatus {
  return product.status ?? "Activo";
}

function readStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : fallback;
  } catch {
    return fallback;
  }
}

function resizeProductImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Selecciona un archivo de imagen válido."));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      reject(new Error("La fotografía no puede superar 5 MB."));
      return;
    }
    const source = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      const limit = 900;
      const scale = Math.min(1, limit / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      const context = canvas.getContext("2d");
      if (!context) {
        URL.revokeObjectURL(source);
        reject(new Error("No se pudo preparar la vista previa."));
        return;
      }
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(source);
      resolve(canvas.toDataURL("image/jpeg", 0.78));
    };
    image.onerror = () => {
      URL.revokeObjectURL(source);
      reject(new Error("No se pudo leer la fotografía."));
    };
    image.src = source;
  });
}

function StatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`status-badge ${statusClass(status)}`}>{status}</span>;
}

function ProductStatusBadge({ status }: { status: ProductStatus }) {
  const className = status === "Activo" ? "status-success" : status === "Borrador" ? "status-warning" : "status-danger";
  return <span className={`status-badge ${className}`}>{status}</span>;
}

function LeafletMap({ lat, lng, label }: { lat: number; lng: number; label: string }) {
  const mapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let map: import("leaflet").Map | null = null;
    let active = true;
    const mount = async () => {
      const L = await import("leaflet");
      if (!active || !mapRef.current) return;
      map = L.map(mapRef.current, { scrollWheelZoom: false, zoomControl: true }).setView([lat, lng], 8);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);
      const icon = L.icon({
        iconUrl: "/vendor/images/marker-icon.png",
        iconRetinaUrl: "/vendor/images/marker-icon-2x.png",
        shadowUrl: "/vendor/images/marker-shadow.png",
        iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
      });
      L.marker([lat, lng], { icon }).addTo(map).bindPopup(`<strong>${label}</strong><br>Ubicación aproximada`).openPopup();
    };
    mount();
    return () => {
      active = false;
      map?.remove();
    };
  }, [lat, lng, label]);
  return <div className="map-shell" ref={mapRef} role="img" aria-label={`Mapa de ubicación aproximada de ${label}`} />;
}

function ProductCard({ product, onOpen, onAdd, onFavorite, favorite }: { product: Product; onOpen: (id: number) => void; onAdd: (product: Product) => void; onFavorite: (id: number) => void; favorite: boolean }) {
  return (
    <article className="product-card h-100">
      <div className="product-media">
        <button className="product-image-button" onClick={() => onOpen(product.id)} aria-label={`Ver ${product.name}`}>
          <img className="product-image" src={product.image} alt={product.name} />
          {product.organic ? <span className="organic-tag">Orgánico</span> : null}
        </button>
        <button className={`favorite-button ${favorite ? "is-favorite" : ""}`} onClick={() => onFavorite(product.id)} aria-label={favorite ? `Quitar ${product.name} de favoritos` : `Guardar ${product.name} en favoritos`} aria-pressed={favorite}>{favorite ? "♥" : "♡"}</button>
      </div>
      <div className="product-card-body">
        <div className="product-meta"><span>{product.category}</span><span>★ 4.8</span></div>
        <button className="product-title-button" onClick={() => onOpen(product.id)}>{product.name}</button>
        <p className="producer-line">Por <strong>{product.producer}</strong> · {product.location}</p>
        <div className="product-price-row">
          <div><strong>{money(product.price)}</strong><small> / {product.unit.toLowerCase()}</small></div>
          <button className="icon-action" onClick={() => onAdd(product)} aria-label={`Agregar ${product.name} al carrito`}>+</button>
        </div>
      </div>
    </article>
  );
}

export default function AgroDirectoApp() {
  const [view, setView] = useState<View>("inicio");
  const [selectedProductId, setSelectedProductId] = useState(1);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [sessionRole, setSessionRole] = useState<Role | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [sort, setSort] = useState("relevancia");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [role, setRole] = useState<Role>("comprador");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [modal, setModal] = useState<null | { type: "mixed" | "delete" | "order" | "info" | "reset"; product?: Product; order?: Order; title?: string; message?: string }>(null);
  const [adminTab, setAdminTab] = useState("resumen");
  const [orderFilter, setOrderFilter] = useState("Todos");
  const [buyerOrderFilter, setBuyerOrderFilter] = useState("Todos");
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [productImage, setProductImage] = useState<string>(PRODUCT_IMAGE_PRESETS[0].value);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const syncHash = () => {
      const raw = window.location.hash.replace(/^#/, "");
      if (!raw) return;
      const [screen, id] = raw.split("/");
      if (screen in VIEW_LABELS) setView(screen as View);
      if (id && Number(id)) setSelectedProductId(Number(id));
      if (screen === "publicar") setEditingProductId(id && Number(id) ? Number(id) : null);
    };
    const hydrate = window.setTimeout(() => {
      const storedProducts = readStored<Product[]>(STORAGE_KEYS.products, PRODUCTS);
      setProducts(storedProducts);
      setCart(readStored<CartItem[]>(STORAGE_KEYS.cart, readStored<CartItem[]>("agrodirecto-cart", [])));
      setOrders(readStored<Order[]>(STORAGE_KEYS.orders, readStored<Order[]>("agrodirecto-orders", INITIAL_ORDERS)));
      setFavorites(readStored<number[]>(STORAGE_KEYS.favorites, []));
      const storedRole = localStorage.getItem(STORAGE_KEYS.sessionRole) as Role | null;
      if (storedRole && ["comprador", "productor", "administrador"].includes(storedRole)) {
        setSessionRole(storedRole);
        setRole(storedRole);
      }
      syncHash();
      const [, screen, id] = window.location.hash.match(/^#([^/]+)\/?(\d+)?/) ?? [];
      if (screen === "publicar" && id) {
        setProductImage(storedProducts.find((product) => product.id === Number(id))?.image ?? PRODUCT_IMAGE_PRESETS[0].value);
      }
      setHydrated(true);
    }, 0);
    window.addEventListener("hashchange", syncHash);
    window.addEventListener("popstate", syncHash);
    return () => {
      window.clearTimeout(hydrate);
      window.removeEventListener("hashchange", syncHash);
      window.removeEventListener("popstate", syncHash);
    };
  }, []);

  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products)); }, [hydrated, products]);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart)); }, [hydrated, cart]);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders)); }, [hydrated, orders]);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(favorites)); }, [hydrated, favorites]);
  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(""), 3200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const navigate = (next: View, productId?: number) => {
    setView(next);
    if (productId) setSelectedProductId(productId);
    if (next === "producto") setQuantity(1);
    if (next === "publicar") {
      const editProduct = productId ? products.find((product) => product.id === productId) : undefined;
      setEditingProductId(productId ?? null);
      setProductImage(editProduct?.image ?? PRODUCT_IMAGE_PRESETS[0].value);
    }
    window.history.pushState(null, "", `#${productId ? `${next}/${productId}` : next}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMobileOpen(false);
  };

  const selectedProduct = products.find((p) => p.id === selectedProductId) ?? products[0];
  const activeProducts = useMemo(() => products.filter((product) => productStatus(product) === "Activo"), [products]);
  const cartDetails = cart.map((item) => ({ ...item, product: products.find((p) => p.id === item.productId)! })).filter((item) => item.product);
  const cartTotal = cartDetails.reduce((sum, item) => sum + item.quantity * item.product.price, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const buyerOrders = orders.filter((order) => buyerOrderFilter === "Todos" || (buyerOrderFilter === "En proceso" ? !["Entregado", "Cancelado", "Rechazado"].includes(order.status) : order.status === "Entregado"));

  const filteredProducts = useMemo(() => {
    const term = search.toLocaleLowerCase("es");
    const result = activeProducts.filter((p) =>
      (category === "Todos" || p.category === category) &&
      (!favoritesOnly || favorites.includes(p.id)) &&
      [p.name, p.producer, p.location].join(" ").toLocaleLowerCase("es").includes(term)
    );
    if (sort === "menor") return [...result].sort((a, b) => a.price - b.price);
    if (sort === "mayor") return [...result].sort((a, b) => b.price - a.price);
    return result;
  }, [activeProducts, search, category, sort, favoritesOnly, favorites]);

  const addToCart = (product: Product, quantity = 1) => {
    if (productStatus(product) !== "Activo" || product.stock < 1) {
      setToast(`${product.name} no está disponible para pedidos.`);
      return;
    }
    const currentProducer = cartDetails[0]?.product.producerId;
    if (currentProducer && currentProducer !== product.producerId) {
      setModal({ type: "mixed", product });
      return;
    }
    setCart((current) => {
      const existing = current.find((item) => item.productId === product.id);
      if (existing) return current.map((item) => item.productId === product.id ? { ...item, quantity: Math.min(product.stock, item.quantity + quantity) } : item);
      return [...current, { productId: product.id, quantity }];
    });
    setToast(`${product.name} se agregó al carrito.`);
  };

  const updateQuantity = (product: Product, quantity: number) => {
    if (quantity < 1) return;
    setCart((current) => current.map((item) => item.productId === product.id ? { ...item, quantity: Math.min(product.stock, quantity) } : item));
  };

  const removeFromCart = (productId: number) => setCart((current) => current.filter((item) => item.productId !== productId));

  const toggleFavorite = (productId: number) => {
    setFavorites((current) => current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId]);
    const product = products.find((item) => item.id === productId);
    setToast(favorites.includes(productId) ? `${product?.name ?? "Producto"} se quitó de favoritos.` : `${product?.name ?? "Producto"} se guardó en favoritos.`);
  };

  const showInfo = (title: string, message: string) => setModal({ type: "info", title, message });

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    localStorage.setItem(STORAGE_KEYS.sessionRole, role);
    setSessionRole(role);
    setToast(`Acceso de demostración como ${role}.`);
    navigate(role === "productor" ? "productor" : role === "administrador" ? "admin" : "catalogo");
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.sessionRole);
    setSessionRole(null);
    setRole("comprador");
    setToast("Sesión de demostración cerrada.");
    navigate("inicio");
  };

  const handleRegister = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setToast("Cuenta de demostración creada correctamente.");
    navigate("login");
  };

  const handleCheckout = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!cartDetails.length) return;
    const data = new FormData(event.currentTarget);
    const producer = cartDetails[0].product;
    const lastOrderNumber = Math.max(2500, ...orders.map((order) => Number(order.id.replace(/\D/g, "")) || 0));
    const order: Order = {
      id: `AG-${lastOrderNumber + 1}`,
      producerId: producer.producerId,
      producer: producer.producer,
      date: "14 ago. 2026",
      status: "Pendiente",
      items: cart,
      total: cartTotal,
      address: String(data.get("address") || "Dirección registrada"),
      note: String(data.get("note") || "Sin observaciones"),
    };
    setOrders((current) => [order, ...current]);
    setProducts((current) => current.map((p) => {
      const ordered = cart.find((item) => item.productId === p.id);
      return ordered ? { ...p, stock: Math.max(0, p.stock - ordered.quantity) } : p;
    }));
    setCart([]);
    setToast(`Pedido ${order.id} registrado. No se realizó ningún cobro.`);
    navigate("pedidos");
  };

  const saveProduct = (form: HTMLFormElement, status: ProductStatus) => {
    const data = new FormData(form);
    const existing = editingProductId ? products.find((product) => product.id === editingProductId) : undefined;
    const nextId = products.length ? Math.max(...products.map((product) => product.id)) + 1 : 1;
    const next: Product = {
      id: existing?.id ?? nextId,
      name: String(data.get("name") || existing?.name || "Borrador sin título"),
      category: String(data.get("category") || existing?.category || "Tubérculos"),
      producerId: 1,
      producer: "AndesVerde",
      location: "Concepción, Junín",
      lat: -11.917,
      lng: -75.314,
      unit: String(data.get("unit") || existing?.unit || "Saco de 50 kg"),
      price: Number(data.get("price") || existing?.price || 0),
      stock: Number(data.get("stock") || existing?.stock || 0),
      image: productImage || existing?.image || PRODUCT_IMAGE_PRESETS[0].value,
      organic: data.get("organic") === "on",
      harvest: existing?.harvest ?? "Disponibilidad inmediata",
      description: String(data.get("description") || existing?.description || "Descripción pendiente para completar antes de publicar."),
      status,
      updatedAt: new Date().toISOString(),
    };
    setProducts((current) => existing ? current.map((product) => product.id === existing.id ? next : product) : [next, ...current]);
    setEditingProductId(null);
    setProductImage(PRODUCT_IMAGE_PRESETS[0].value);
    setToast(status === "Borrador" ? "Borrador guardado en este dispositivo." : existing ? "Producto actualizado y publicado." : "Producto publicado en el prototipo.");
    navigate("productor");
  };

  const handleProduct = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveProduct(event.currentTarget, "Activo");
  };

  const saveDraft = (form: HTMLFormElement | null) => {
    if (form) saveProduct(form, "Borrador");
  };

  const handleProductImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setProductImage(await resizeProductImage(file));
      setToast("Fotografía preparada para la vista previa local.");
    } catch (error) {
      showInfo("No se pudo usar la fotografía", error instanceof Error ? error.message : "Selecciona otra imagen.");
    } finally {
      event.target.value = "";
    }
  };

  const changeOrderStatus = (id: string, status: OrderStatus) => {
    const order = orders.find((item) => item.id === id);
    if (order?.status === "Pendiente" && status === "Rechazado") {
      setProducts((current) => current.map((product) => {
        const ordered = order.items.find((item) => item.productId === product.id);
        return ordered ? { ...product, stock: product.stock + ordered.quantity } : product;
      }));
    }
    setOrders((current) => current.map((order) => order.id === id ? { ...order, status } : order));
    setToast(`El pedido ${id} cambió a “${status}”.`);
  };

  const cancelOrder = (order: Order) => {
    if (order.status !== "Pendiente") return;
    setOrders((current) => current.map((item) => item.id === order.id ? { ...item, status: "Cancelado" } : item));
    setProducts((current) => current.map((product) => {
      const ordered = order.items.find((item) => item.productId === product.id);
      return ordered ? { ...product, stock: product.stock + ordered.quantity } : product;
    }));
    setModal(null);
    setToast(`Pedido ${order.id} cancelado y stock restablecido.`);
  };

  const deleteProduct = (product: Product) => {
    setProducts((current) => current.map((item) => item.id === product.id ? { ...item, status: "Retirado", updatedAt: new Date().toISOString() } : item));
    setCart((current) => current.filter((item) => item.productId !== product.id));
    setModal(null);
    setToast(`${product.name} se retiró del prototipo.`);
  };

  const publishProduct = (productId: number) => {
    setProducts((current) => current.map((product) => product.id === productId ? { ...product, status: "Activo", updatedAt: new Date().toISOString() } : product));
    setToast("Producto publicado nuevamente.");
  };

  const resetDemo = () => {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
    localStorage.removeItem("agrodirecto-cart");
    localStorage.removeItem("agrodirecto-orders");
    setProducts(PRODUCTS);
    setCart([]);
    setOrders(INITIAL_ORDERS);
    setFavorites([]);
    setSessionRole(null);
    setRole("comprador");
    setModal(null);
    setToast("Datos de demostración restablecidos.");
    navigate("inicio");
  };

  const renderModal = () => {
    if (!modal) return null;
    let content;
    if (modal.type === "mixed") {
      content = <><span className="modal-icon">!</span><h2>Un productor por pedido</h2><p>Tu carrito contiene productos de otro productor. Para agregar <strong>{modal.product?.name}</strong>, primero debes completar o vaciar el pedido actual.</p><div className="modal-actions"><button className="btn btn-soft" onClick={() => setModal(null)}>Mantener carrito</button><button className="btn btn-brand" onClick={() => { const product = modal.product!; setCart([{ productId: product.id, quantity: 1 }]); setModal(null); setToast("Se inició un nuevo carrito para este productor."); }}>Vaciar y agregar</button></div></>;
    } else if (modal.type === "delete") {
      content = <><span className="modal-icon danger">×</span><h2>Retirar publicación</h2><p>¿Deseas retirar <strong>{modal.product?.name}</strong>? Ya no aparecerá en el catálogo, pero se conservará en el historial local.</p><div className="modal-actions"><button className="btn btn-soft" onClick={() => setModal(null)}>Cancelar</button><button className="btn btn-danger" onClick={() => deleteProduct(modal.product!)}>Retirar</button></div></>;
    } else if (modal.type === "order" && modal.order) {
      const order = modal.order;
      content = <><div className="modal-order-head"><div><span className="eyebrow">Detalle del pedido</span><h2>{order.id}</h2><p>{order.date} · {order.producer}</p></div><StatusBadge status={order.status} /></div><div className="modal-order-products">{order.items.map((item) => { const product = products.find((candidate) => candidate.id === item.productId); return product ? <div key={item.productId}><img src={product.image} alt={product.name} /><span><strong>{product.name}</strong><small>{item.quantity} × {product.unit}</small></span><b>{money(item.quantity * product.price)}</b></div> : null; })}</div><div className="modal-order-data"><div><span>Entrega o referencia</span><strong>{order.address}</strong></div><div><span>Observación</span><strong>{order.note}</strong></div><div><span>Total referencial</span><strong>{money(order.total)}</strong></div></div><div className="modal-actions"><button className="btn btn-soft" onClick={() => setModal(null)}>Cerrar</button>{order.status === "Pendiente" ? <button className="btn btn-outline-danger" onClick={() => cancelOrder(order)}>Cancelar pedido</button> : null}</div></>;
    } else if (modal.type === "reset") {
      content = <><span className="modal-icon">↻</span><h2>Restablecer demostración</h2><p>Se eliminarán de este dispositivo los productos añadidos, borradores, favoritos, carrito y cambios de pedidos. Los datos iniciales volverán a mostrarse.</p><div className="modal-actions"><button className="btn btn-soft" onClick={() => setModal(null)}>Conservar datos</button><button className="btn btn-danger" onClick={resetDemo}>Restablecer</button></div></>;
    } else {
      content = <><span className="modal-icon">i</span><h2>{modal.title ?? "Función del prototipo"}</h2><p>{modal.message ?? "Esta opción está representada en el flujo académico."}</p><div className="modal-actions"><button className="btn btn-brand" onClick={() => setModal(null)}>Entendido</button></div></>;
    }
    return <div className="modal-backdrop-custom"><div className={`modal-card ${modal.type === "order" ? "modal-card-wide" : ""}`} role="dialog" aria-modal="true" aria-label={modal.type === "order" ? `Detalle del pedido ${modal.order?.id}` : undefined}>{content}</div></div>;
  };

  const renderHeader = () => (
    <header className="site-header">
      <div className="container header-inner">
        <button className="brand" onClick={() => navigate("inicio")} aria-label="Ir al inicio de AgroDirecto">
          <span className="brand-mark">A</span><span><strong>Agro</strong>Directo<small>Del campo a tu negocio</small></span>
        </button>
        <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-expanded={mobileOpen} aria-label="Abrir menú">{mobileOpen ? "×" : "☰"}</button>
        <nav className={`main-nav ${mobileOpen ? "is-open" : ""}`} aria-label="Navegación principal">
          <button className={view === "inicio" ? "active" : ""} onClick={() => navigate("inicio")}>Inicio</button>
          <button className={view === "catalogo" || view === "producto" ? "active" : ""} onClick={() => { setFavoritesOnly(false); navigate("catalogo"); }}>Productos</button>
          <button onClick={() => { navigate("inicio"); window.setTimeout(() => document.getElementById("como-funciona")?.scrollIntoView({ behavior: "smooth" }), 100); }}>Cómo funciona</button>
          <button onClick={() => navigate("productor")}>Productores</button>
        </nav>
        <div className="header-actions">
          <button className="account-link" onClick={() => sessionRole ? navigate(sessionRole === "productor" ? "productor" : sessionRole === "administrador" ? "admin" : "pedidos") : navigate("login")}><span aria-hidden="true">◯</span> {sessionRole ? "Mi panel" : "Mi cuenta"}</button>
          {favorites.length ? <button className="favorites-link" onClick={() => { setSearch(""); setCategory("Todos"); setFavoritesOnly(true); navigate("catalogo"); }} aria-label={`${favorites.length} productos favoritos`}>♥<span>{favorites.length}</span></button> : null}
          <button className="cart-link" onClick={() => navigate("carrito")} aria-label={`Carrito con ${cartCount} productos`}><span aria-hidden="true">▢</span><span className="cart-badge">{cartCount}</span></button>
          {sessionRole ? <button className="logout-link" onClick={logout} title="Cerrar sesión de demostración" aria-label="Cerrar sesión">Salir</button> : null}
        </div>
      </div>
    </header>
  );

  const renderFooter = () => (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div><div className="footer-brand"><span className="brand-mark">A</span><strong>AgroDirecto</strong></div><p>Prototipo académico que conecta productores peruanos con compradores locales.</p></div>
        <div><h3>Plataforma</h3><button onClick={() => navigate("catalogo")}>Catálogo</button><button onClick={() => navigate("registro")}>Crear cuenta</button><button onClick={() => navigate("pedidos")}>Mis pedidos</button></div>
        <div><h3>Transparencia</h3><p>Sin cobros en línea</p><p>Ubicación aproximada</p><p>Datos de demostración</p></div>
        <div><h3>Proyecto</h3><p>Desarrollo Full Stack</p><p>Avance 1 · Semana 8</p><p>UTP · 2026</p><button className="reset-demo-link" onClick={() => setModal({ type: "reset" })}>Restablecer demostración</button></div>
      </div>
      <div className="container footer-bottom"><span>© 2026 AgroDirecto · Proyecto académico</span><span>Mapas © OpenStreetMap contributors</span></div>
    </footer>
  );

  const Home = () => (
    <>
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Comercio agrícola más directo</span>
            <h1>Del campo a tu negocio, <em>sin tantos intermediarios.</em></h1>
            <p>Encuentra productos frescos, conoce su origen y coordina pedidos directamente con pequeños productores del Perú.</p>
            <div className="hero-actions"><button className="btn btn-brand btn-lg" onClick={() => navigate("catalogo")}>Explorar productos <span>→</span></button><button className="btn btn-soft btn-lg" onClick={() => { setRole("productor"); navigate("registro"); }}>Quiero vender</button></div>
            <div className="trust-row"><span>✓ Productores verificados</span><span>✓ Origen visible</span><span>✓ Sin cobros en línea</span></div>
          </div>
          <div className="hero-visual" aria-label="Productos frescos en un mercado agrícola">
            <div className="hero-photo"></div>
            <div className="floating-card card-producer"><span className="avatar">AV</span><div><strong>AndesVerde</strong><small>Concepción, Junín</small></div><span className="verified">✓</span></div>
            <div className="floating-card card-order"><span className="mini-icon">✓</span><div><strong>Pedido registrado</strong><small>Sin cobro en línea</small></div></div>
          </div>
        </div>
      </section>
      <section className="category-strip"><div className="container category-row">{[["Tubérculos","🥔"],["Hortalizas","🥬"],["Frutas","🥑"],["Granos","◌"]].map(([label, icon]) => <button key={label} onClick={() => { setCategory(label); setFavoritesOnly(false); navigate("catalogo"); }}><span>{icon}</span>{label}</button>)}</div></section>
      <section className="section-block">
        <div className="container"><div className="section-heading"><div><span className="eyebrow">Cosecha reciente</span><h2>Productos disponibles esta semana</h2></div><button className="text-link" onClick={() => navigate("catalogo")}>Ver catálogo completo →</button></div>
          <div className="row g-4">{activeProducts.slice(0, 4).map((product) => <div className="col-12 col-sm-6 col-lg-3" key={product.id}><ProductCard product={product} onOpen={(id) => navigate("producto", id)} onAdd={addToCart} onFavorite={toggleFavorite} favorite={favorites.includes(product.id)} /></div>)}</div>
        </div>
      </section>
      <section className="value-section" id="como-funciona">
        <div className="container"><div className="center-heading"><span className="eyebrow">Un proceso sencillo</span><h2>Compra directo en cuatro pasos</h2><p>Información clara para que productores y compradores coordinen mejor.</p></div>
          <div className="steps-grid">{[
            ["01","Explora","Busca por producto, categoría o región."], ["02","Compara","Revisa precio, unidad, stock y origen."], ["03","Solicita","Agrupa productos de un mismo productor."], ["04","Coordina","Sigue el estado y acuerda pago y entrega."],
          ].map(([n, title, text]) => <div className="step-card" key={n}><span>{n}</span><h3>{title}</h3><p>{text}</p></div>)}</div>
        </div>
      </section>
      <section className="project-foundation"><div className="container"><div className="center-heading"><span className="eyebrow">Fundamento del proyecto</span><h2>Una solución enfocada en coordinación y transparencia</h2><p>El MVP valida primero la conexión comercial, antes de incorporar pagos o inteligencia artificial.</p></div><div className="foundation-grid"><article><span>01</span><h3>Problema</h3><p>Pequeños productores tienen baja visibilidad y los compradores encuentran información dispersa sobre precio, stock, unidad y procedencia.</p></article><article><span>02</span><h3>Misión</h3><p>Facilitar una coordinación directa y clara entre productores peruanos y compradores locales mediante una plataforma accesible.</p></article><article><span>03</span><h3>Visión</h3><p>Ser una herramienta digital confiable para fortalecer circuitos cortos de comercialización agrícola en el Perú.</p></article></div></div></section>
      <section className="impact-section"><div className="container impact-grid"><div><span className="eyebrow light">Nuestra propuesta</span><h2>Más visibilidad para quien produce. Más claridad para quien compra.</h2></div><div className="impact-stats"><div><strong>{new Set(activeProducts.map((product) => product.location)).size}</strong><span>zonas representadas</span></div><div><strong>{activeProducts.length}</strong><span>productos disponibles</span></div><div><strong>100%</strong><span>software y acceso gratuito</span></div></div></div></section>
    </>
  );

  const Login = () => (
    <main className="auth-page"><div className="auth-visual"><div><span className="eyebrow light">Bienvenido de vuelta</span><h1>Conecta, compra y gestiona desde un solo lugar.</h1><p>Este acceso es una demostración frontend. No almacenamos contraseñas.</p></div></div><div className="auth-panel"><div className="auth-card"><button className="back-link" onClick={() => navigate("inicio")}>← Volver al inicio</button><h2>Iniciar sesión</h2><p>Selecciona un perfil de demostración.</p>
      <div className="role-tabs" role="group" aria-label="Seleccionar perfil">{(["comprador","productor","administrador"] as Role[]).map((item) => <button key={item} className={role === item ? "active" : ""} onClick={() => setRole(item)}>{item[0].toUpperCase() + item.slice(1)}</button>)}</div>
      <form onSubmit={handleLogin}><label>Correo electrónico<input className="form-control" type="email" defaultValue={role === "productor" ? "productor@demo.pe" : role === "administrador" ? "admin@demo.pe" : "comprador@demo.pe"} required /></label><label>Contraseña<input className="form-control" type="password" defaultValue="Demo2026" required /></label><div className="form-line"><label className="check-line"><input type="checkbox" /> Recordarme</label><button type="button" className="link-button" onClick={() => showInfo("Recuperación simulada", "En el Avance 1 no se envían correos. El flujo real de recuperación se implementará con Spring Security en el producto final.")}>¿Olvidaste tu contraseña?</button></div><button className="btn btn-brand w-100 btn-lg" type="submit">Ingresar al prototipo</button></form>
      <div className="demo-note"><strong>Acceso académico</strong><span>Las credenciales son ficticias y no se guardan.</span></div><p className="auth-switch">¿Aún no tienes cuenta? <button onClick={() => navigate("registro")}>Regístrate</button></p></div></div></main>
  );

  const Register = () => (
    <main className="content-page"><div className="container narrow-container"><button className="back-link" onClick={() => navigate("inicio")}>← Volver</button><div className="page-title"><span className="eyebrow">Únete a AgroDirecto</span><h1>Crea una cuenta de demostración</h1><p>Completa los datos para visualizar el recorrido de comprador o productor.</p></div>
      <form className="surface-card form-card" onSubmit={handleRegister}><div className="role-choice"><button type="button" className={role === "comprador" ? "selected" : ""} onClick={() => setRole("comprador")}><span>🏪</span><strong>Soy comprador</strong><small>Restaurante, bodega o comercio</small></button><button type="button" className={role === "productor" ? "selected" : ""} onClick={() => setRole("productor")}><span>🌱</span><strong>Soy productor</strong><small>Productor o asociación agrícola</small></button></div>
        <div className="row g-3"><div className="col-md-6"><label>Nombres<input className="form-control" required placeholder="Ej. Ana María" /></label></div><div className="col-md-6"><label>Apellidos<input className="form-control" required placeholder="Ej. Torres Rojas" /></label></div><div className="col-md-6"><label>Correo<input className="form-control" type="email" required placeholder="correo@ejemplo.pe" /></label></div><div className="col-md-6"><label>Teléfono<input className="form-control" inputMode="tel" required placeholder="999 999 999" /></label></div>{role === "productor" && <><div className="col-md-6"><label>Nombre comercial<input className="form-control" required placeholder="Ej. Valle Verde" /></label></div><div className="col-md-6"><label>Región<select className="form-select" required defaultValue=""><option value="" disabled>Selecciona una región</option><option>Junín</option><option>Ica</option><option>Ayacucho</option><option>Puno</option><option>San Martín</option></select></label></div><div className="col-12"><div className="location-preview"><div><strong>Ubicación aproximada</strong><span>La dirección exacta no será pública.</span></div><span>Concepción, Junín</span></div></div></>}<div className="col-md-6"><label>Contraseña<input className="form-control" type="password" required minLength={8} placeholder="Mínimo 8 caracteres" /></label></div><div className="col-md-6"><label>Confirmar contraseña<input className="form-control" type="password" required minLength={8} placeholder="Repite la contraseña" /></label></div></div>
        <label className="check-line mt-3"><input type="checkbox" required /> Acepto el uso de datos ficticios para esta demostración académica.</label><button className="btn btn-brand btn-lg mt-4" type="submit">Crear cuenta de demostración</button></form></div></main>
  );

  const Catalog = () => (
    <main><section className="catalog-hero"><div className="container"><span className="eyebrow light">Compra local</span><h1>Productos agrícolas disponibles</h1><p>Consulta precio, unidad, stock y origen antes de enviar tu solicitud.</p><div className="catalog-search"><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar papa, palta, café o productor…" aria-label="Buscar productos" /><button aria-label="Buscar">Buscar</button></div></div></section>
      <section className="section-block"><div className="container"><div className="catalog-toolbar"><div className="filter-pills">{["Todos","Tubérculos","Hortalizas","Frutas","Granos"].map((item) => <button key={item} className={!favoritesOnly && category === item ? "active" : ""} onClick={() => { setCategory(item); setFavoritesOnly(false); }}>{item}</button>)}{favorites.length ? <button className={favoritesOnly ? "active" : ""} onClick={() => setFavoritesOnly(!favoritesOnly)}>♥ Favoritos ({favorites.length})</button> : null}</div><select className="form-select sort-select" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Ordenar productos"><option value="relevancia">Más relevantes</option><option value="menor">Menor precio</option><option value="mayor">Mayor precio</option></select></div><div className="results-line"><strong>{filteredProducts.length} productos</strong><span>{favoritesOnly ? "Tus productos guardados" : "Precios referenciales · sin pago en línea"}</span></div>
        {filteredProducts.length ? <div className="row g-4">{filteredProducts.map((product) => <div className="col-12 col-sm-6 col-lg-4 col-xl-3" key={product.id}><ProductCard product={product} onOpen={(id) => navigate("producto", id)} onAdd={addToCart} onFavorite={toggleFavorite} favorite={favorites.includes(product.id)} /></div>)}</div> : <div className="empty-state"><span>⌕</span><h2>No encontramos coincidencias</h2><p>Prueba con otra palabra o elimina los filtros.</p><button className="btn btn-brand" onClick={() => { setSearch(""); setCategory("Todos"); setFavoritesOnly(false); }}>Limpiar filtros</button></div>}
      </div></section></main>
  );

  const ProductDetail = () => {
    return <main className="content-page"><div className="container"><div className="breadcrumb-line"><button onClick={() => navigate("catalogo")}>Catálogo</button><span>/</span><span>{selectedProduct.category}</span><span>/</span><strong>{selectedProduct.name}</strong></div>
      <div className="product-detail-grid"><div className="detail-image-wrap"><img src={selectedProduct.image} alt={selectedProduct.name} />{selectedProduct.organic ? <span className="organic-tag">Producción orgánica</span> : null}</div><div className="detail-content"><div className="detail-title-row"><span className="category-label">{selectedProduct.category}</span><button className={`detail-favorite ${favorites.includes(selectedProduct.id) ? "is-favorite" : ""}`} onClick={() => toggleFavorite(selectedProduct.id)} aria-pressed={favorites.includes(selectedProduct.id)}>{favorites.includes(selectedProduct.id) ? "♥ Guardado" : "♡ Guardar"}</button></div><h1>{selectedProduct.name}</h1><div className="rating-row"><span>★★★★★</span><strong>4.8</strong><small>24 valoraciones simuladas</small></div><p className="detail-description">{selectedProduct.description}</p><div className="price-block"><strong>{money(selectedProduct.price)}</strong><span>por {selectedProduct.unit.toLowerCase()}</span></div><div className="availability"><div><span>Stock disponible</span><strong>{selectedProduct.stock} unidades de venta</strong></div><div><span>Disponibilidad</span><strong>{selectedProduct.harvest}</strong></div></div><div className="quantity-row"><div className="quantity-control"><button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Reducir cantidad">−</button><span>{quantity}</span><button onClick={() => setQuantity(Math.min(selectedProduct.stock, quantity + 1))} aria-label="Aumentar cantidad">+</button></div><button className="btn btn-brand btn-lg flex-grow-1" disabled={selectedProduct.stock < 1} onClick={() => addToCart(selectedProduct, quantity)}>{selectedProduct.stock < 1 ? "Sin stock" : "Agregar al carrito"}</button></div><p className="no-payment-note">No se realizará ningún cobro. El pago y la entrega se coordinan con el productor.</p></div></div>
      <div className="detail-lower-grid"><section className="surface-card producer-card"><div className="producer-header"><span className="avatar large">{selectedProduct.producer.slice(0,2).toUpperCase()}</span><div><span className="eyebrow">Productor</span><h2>{selectedProduct.producer}</h2><p>{selectedProduct.location} · Perfil de demostración</p></div><span className="verified big">✓ Verificado</span></div><div className="producer-facts"><span><strong>4.9</strong> valoración</span><span><strong>98%</strong> respuesta</span><span><strong>3 años</strong> experiencia referencial</span></div></section><section className="surface-card map-card"><div><span className="eyebrow">Origen visible</span><h2>Ubicación aproximada</h2><p>La dirección exacta se protege y se coordina después de aceptar el pedido.</p></div><LeafletMap lat={selectedProduct.lat} lng={selectedProduct.lng} label={selectedProduct.producer} /></section></div>
    </div></main>;
  };

  const Cart = () => (
    <main className="content-page"><div className="container"><div className="page-title compact"><span className="eyebrow">Tu selección</span><h1>Carrito</h1><p>Los productos de cada pedido deben pertenecer a un solo productor.</p></div>
      {!cartDetails.length ? <div className="empty-state surface-card"><span>▢</span><h2>Tu carrito está vacío</h2><p>Explora el catálogo y agrega productos de un productor.</p><button className="btn btn-brand" onClick={() => navigate("catalogo")}>Explorar productos</button></div> : <div className="checkout-grid"><section><div className="single-producer-note"><span className="avatar">{cartDetails[0].product.producer.slice(0,2).toUpperCase()}</span><div><strong>Pedido a {cartDetails[0].product.producer}</strong><span>{cartDetails[0].product.location}</span></div><span>✓ Un solo productor</span></div><div className="cart-list">{cartDetails.map(({ product, quantity }) => <article className="cart-item" key={product.id}><img src={product.image} alt="" /><div className="cart-main"><span>{product.category}</span><h2>{product.name}</h2><p>{product.unit} · Stock {product.stock}</p><button onClick={() => removeFromCart(product.id)}>Eliminar</button></div><div className="cart-side"><strong>{money(product.price * quantity)}</strong><div className="quantity-control small"><button onClick={() => updateQuantity(product, quantity - 1)}>−</button><span>{quantity}</span><button onClick={() => updateQuantity(product, quantity + 1)}>+</button></div></div></article>)}</div><button className="text-link mt-3" onClick={() => navigate("catalogo")}>← Seguir explorando</button></section><aside className="order-summary surface-card"><h2>Resumen del pedido</h2><div><span>Productos</span><strong>{cartCount}</strong></div><div><span>Subtotal referencial</span><strong>{money(cartTotal)}</strong></div><div><span>Pago en línea</span><strong>No incluido</strong></div><hr /><div className="summary-total"><span>Total referencial</span><strong>{money(cartTotal)}</strong></div><p>El monto final y la entrega serán coordinados con el productor.</p><button className="btn btn-brand btn-lg w-100" onClick={() => navigate("confirmar")}>Continuar pedido</button></aside></div>}
    </div></main>
  );

  const Checkout = () => (
    <main className="content-page"><div className="container"><button className="back-link" onClick={() => navigate("carrito")}>← Volver al carrito</button><div className="page-title compact"><span className="eyebrow">Paso final</span><h1>Confirmar pedido</h1><p>Revisa los datos. Esta acción no realizará ningún cobro.</p></div>
      {!cartDetails.length ? <div className="empty-state surface-card"><h2>No hay productos para confirmar</h2><button className="btn btn-brand" onClick={() => navigate("catalogo")}>Ir al catálogo</button></div> : <form className="checkout-grid" onSubmit={handleCheckout}><section className="surface-card form-card"><h2>Datos de coordinación</h2><div className="row g-3"><div className="col-md-6"><label>Nombre del contacto<input className="form-control" required defaultValue="María Quispe" /></label></div><div className="col-md-6"><label>Teléfono<input className="form-control" required defaultValue="987 654 321" /></label></div><div className="col-12"><label>Dirección o referencia<textarea className="form-control" name="address" required defaultValue="Av. Arequipa 1840, Lince, Lima" /></label></div><div className="col-12"><label>Observaciones<textarea className="form-control" name="note" defaultValue="Recepción por almacén entre 9:00 y 13:00." /></label></div></div><div className="coordination-box"><span>i</span><div><strong>Coordinación directa</strong><p>AgroDirecto no procesa pagos. El productor confirmará disponibilidad, total y condiciones de entrega.</p></div></div></section><aside className="order-summary surface-card"><h2>Tu solicitud</h2>{cartDetails.map(({ product, quantity }) => <div className="summary-product" key={product.id}><img src={product.image} alt="" /><span><strong>{product.name}</strong><small>{quantity} × {money(product.price)}</small></span><b>{money(quantity * product.price)}</b></div>)}<hr /><div><span>Productor</span><strong>{cartDetails[0].product.producer}</strong></div><div className="summary-total"><span>Total referencial</span><strong>{money(cartTotal)}</strong></div><label className="check-line consent"><input type="checkbox" required /> Entiendo que no se realizará ningún pago en línea.</label><button className="btn btn-brand btn-lg w-100" type="submit">Registrar pedido</button></aside></form>}
    </div></main>
  );

  const Orders = () => (
    <main className="content-page"><div className="container"><div className="dashboard-title"><div><span className="eyebrow">Comprador</span><h1>Mis pedidos</h1><p>Consulta el avance de tus solicitudes registradas.</p></div><button className="btn btn-brand" onClick={() => navigate("catalogo")}>Nuevo pedido</button></div><div className="order-tabs">{[["Todos", orders.length],["En proceso", orders.filter((o) => !["Entregado","Cancelado","Rechazado"].includes(o.status)).length],["Finalizados", orders.filter((o) => o.status === "Entregado").length]].map(([label,count]) => <button key={String(label)} className={buyerOrderFilter === label ? "active" : ""} onClick={() => setBuyerOrderFilter(String(label))}>{label} <span>{count}</span></button>)}</div>
      <div className="orders-list">{buyerOrders.map((order) => <article className="order-card" key={order.id}><div className="order-card-head"><div><span>Pedido {order.id}</span><small>{order.date} · {order.producer}</small></div><StatusBadge status={order.status} /></div><div className="order-products">{order.items.map((item) => { const product = products.find((p) => p.id === item.productId); return product ? <div key={item.productId}><img src={product.image} alt={product.name} /><span><strong>{product.name}</strong><small>{item.quantity} × {product.unit}</small></span></div> : null; })}<strong className="order-total">{money(order.total)}</strong></div>{STATUS_STEP[order.status] > 0 ? <div className="timeline">{["Pendiente","Aceptado","En preparación","Listo","Entregado"].map((step, index) => <div className={index + 1 <= STATUS_STEP[order.status] ? "done" : ""} key={step}><span>{index + 1 <= STATUS_STEP[order.status] ? "✓" : index + 1}</span><small>{step}</small></div>)}</div> : null}<div className="order-card-foot"><span>{order.address}</span><button className="text-link" onClick={() => setModal({ type: "order", order })}>Ver detalle →</button></div></article>)}{!buyerOrders.length ? <div className="empty-state surface-card"><h2>No hay pedidos en esta sección</h2><p>Cambia el filtro o registra un nuevo pedido.</p></div> : null}</div></div></main>
  );

  const ProducerDashboard = () => {
    const myProducts = products.filter((p) => p.producerId === 1);
    const activeMine = myProducts.filter((product) => productStatus(product) === "Activo");
    const drafts = myProducts.filter((product) => productStatus(product) === "Borrador");
    const received = orders.filter((o) => o.producerId === 1);
    return <main className="dashboard-page"><div className="container"><div className="dashboard-title"><div><span className="eyebrow">AndesVerde · Productor verificado</span><h1>Buenos días, Carlos</h1><p>Gestiona tu oferta y atiende las solicitudes recibidas.</p></div><button className="btn btn-brand" onClick={() => navigate("publicar")}>+ Publicar producto</button></div><div className="local-data-banner"><span>✓</span><div><strong>Cambios guardados en este dispositivo</strong><p>Los productos, borradores y pedidos permanecen después de recargar. En el Avance 2 se migrarán a Spring Boot.</p></div></div><div className="kpi-grid"><div><span>Productos activos</span><strong>{activeMine.length}</strong><small>{drafts.length} borradores</small></div><div><span>Pedidos pendientes</span><strong>{received.filter((o) => o.status === "Pendiente").length}</strong><small>Requieren atención</small></div><div><span>Stock publicado</span><strong>{activeMine.reduce((sum, p) => sum + p.stock, 0)}</strong><small>Unidades de venta</small></div><div><span>Ventas referenciales</span><strong>{money(received.filter((order) => order.status === "Entregado").reduce((sum, order) => sum + order.total, 0))}</strong><small>Datos simulados</small></div></div>
      <div className="dashboard-grid"><section className="dashboard-panel"><div className="panel-heading"><div><h2>Mis productos</h2><p>Publicaciones, borradores y productos retirados.</p></div><button className="text-link" onClick={() => navigate("publicar")}>Agregar producto</button></div><div className="table-responsive"><table className="data-table"><thead><tr><th>Producto</th><th>Precio</th><th>Stock</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>{myProducts.map((product) => { const status = productStatus(product); return <tr key={product.id}><td><div className="table-product"><img src={product.image} alt={product.name} /><span><strong>{product.name}</strong><small>{product.unit}</small></span></div></td><td>{product.price ? money(product.price) : "Pendiente"}</td><td>{product.stock}</td><td><ProductStatusBadge status={status} /></td><td><div className="table-actions"><button onClick={() => navigate("publicar", product.id)}>{status === "Borrador" ? "Continuar" : "Editar"}</button>{status === "Activo" ? <button className="danger" onClick={() => setModal({ type: "delete", product })}>Retirar</button> : <button onClick={() => publishProduct(product.id)}>Publicar</button>}</div></td></tr>; })}</tbody></table></div></section><aside className="dashboard-panel compact-panel"><div className="panel-heading"><div><h2>Pedidos recientes</h2><p>Solicitudes para AndesVerde.</p></div></div>{received.slice(0,3).map((order) => <button className="mini-order" key={order.id} onClick={() => setModal({ type: "order", order })}><span><strong>{order.id}</strong><small>{order.items.reduce((s, i) => s + i.quantity, 0)} unidades · {money(order.total)}</small></span><StatusBadge status={order.status} /></button>)}<button className="btn btn-soft w-100 mt-3" onClick={() => navigate("recibidos")}>Gestionar pedidos</button></aside></div></div></main>;
  };

  const ProductForm = () => {
    const editingProduct = editingProductId ? products.find((product) => product.id === editingProductId) : undefined;
    return <main className="content-page"><div className="container"><button className="back-link" onClick={() => navigate("productor")}>← Volver al panel</button><div className="page-title compact"><span className="eyebrow">AndesVerde</span><h1>{editingProduct ? "Editar producto" : "Publicar producto"}</h1><p>{editingProduct ? "Actualiza la información y conserva una unidad de venta clara." : "Registra una unidad de venta clara para evitar confusiones."}</p></div><form key={editingProduct?.id ?? "new"} className="product-form-grid" onSubmit={handleProduct}><section className="surface-card form-card"><h2>Información del producto</h2><div className="row g-3"><div className="col-md-8"><label>Nombre del producto<input className="form-control" name="name" required defaultValue={editingProduct?.name ?? ""} placeholder="Ej. Papa huayro seleccionada" /></label></div><div className="col-md-4"><label>Categoría<select className="form-select" name="category" required defaultValue={editingProduct?.category ?? "Tubérculos"}><option>Tubérculos</option><option>Hortalizas</option><option>Frutas</option><option>Granos</option></select></label></div><div className="col-12"><label>Descripción<textarea className="form-control" name="description" required minLength={30} defaultValue={editingProduct?.description ?? ""} placeholder="Describe origen, calidad y uso recomendado." /></label></div><div className="col-md-4"><label>Unidad de venta<select className="form-select" name="unit" required defaultValue={editingProduct?.unit ?? "Saco de 50 kg"}><option>Saco de 50 kg</option><option>Saco de 30 kg</option><option>Saco de 25 kg</option><option>Caja de 20 kg</option><option>Caja de 10 kg</option><option>Jaba de 18 kg</option><option>Bolsa de 1 kg</option><option>Bolsa de 500 g</option><option>Racimo</option></select></label></div><div className="col-md-4"><label>Precio referencial<input className="form-control" name="price" type="number" min="1" step="0.10" required defaultValue={editingProduct?.price || ""} placeholder="0.00" /></label></div><div className="col-md-4"><label>Stock<input className="form-control" name="stock" type="number" min="1" required defaultValue={editingProduct?.stock || ""} placeholder="0" /></label></div><div className="col-12"><label className="check-line"><input type="checkbox" name="organic" defaultChecked={editingProduct?.organic} /> Producto con certificación orgánica demostrable</label></div></div><div className="product-image-editor"><div className="product-image-preview"><img src={productImage} alt="Vista previa del producto" /></div><div><strong>Fotografía del producto</strong><p>Selecciona una imagen del catálogo visual o carga una fotografía de hasta 5 MB. Se optimizará y guardará únicamente en este dispositivo.</p><div className="image-preset-row">{PRODUCT_IMAGE_PRESETS.map((preset) => <button type="button" key={preset.value} className={productImage === preset.value ? "active" : ""} onClick={() => setProductImage(preset.value)} title={preset.label}><img src={preset.value} alt={preset.label} /></button>)}</div><label className="btn btn-soft product-image-trigger">Seleccionar fotografía<input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleProductImage} /></label></div></div></section><aside><section className="surface-card location-card"><span className="eyebrow">Origen del productor</span><h2>Concepción, Junín</h2><p>La ubicación proviene del perfil de AndesVerde y se mostrará de forma aproximada.</p><LeafletMap lat={-11.917} lng={-75.314} label="AndesVerde" /></section><section className="surface-card publish-actions"><div><strong>{editingProduct ? "Cambios preparados" : "Vista previa lista"}</strong><span>Puedes publicar ahora o conservarlo como borrador local.</span></div><button className="btn btn-brand btn-lg w-100" type="submit">{editingProduct ? "Guardar y publicar" : "Publicar producto"}</button><button className="btn btn-soft w-100" type="button" onClick={(event) => saveDraft(event.currentTarget.closest("form") as HTMLFormElement | null)}>Guardar borrador</button></section></aside></form></div></main>;
  };

  const ReceivedOrders = () => {
    const received = orders.filter((o) => o.producerId === 1 && (orderFilter === "Todos" || o.status === orderFilter));
    return <main className="dashboard-page"><div className="container"><div className="dashboard-title"><div><span className="eyebrow">AndesVerde</span><h1>Pedidos recibidos</h1><p>Revisa y actualiza las solicitudes de tus compradores.</p></div><button className="btn btn-soft" onClick={() => navigate("productor")}>Volver al panel</button></div><div className="filter-pills mb-4">{["Todos","Pendiente","Aceptado","En preparación","Entregado"].map((item) => <button key={item} className={orderFilter === item ? "active" : ""} onClick={() => setOrderFilter(item)}>{item}</button>)}</div>
      <div className="received-list">{received.map((order) => <article className="received-card" key={order.id}><div className="received-main"><div className="order-card-head"><div><span>Pedido {order.id}</span><small>{order.date} · Comprador de demostración</small></div><StatusBadge status={order.status} /></div><div className="received-products">{order.items.map((item) => { const product = products.find((p) => p.id === item.productId); return product ? <div key={item.productId}><span>{item.quantity}×</span><strong>{product.name}</strong><small>{product.unit}</small></div> : null; })}</div><div className="received-info"><span><small>Entrega</small>{order.address}</span><span><small>Observación</small>{order.note}</span></div></div><aside><span>Total referencial</span><strong>{money(order.total)}</strong>{order.status === "Pendiente" ? <div className="action-stack"><button className="btn btn-brand" onClick={() => changeOrderStatus(order.id, "Aceptado")}>Aceptar pedido</button><button className="btn btn-outline-danger" onClick={() => changeOrderStatus(order.id, "Rechazado")}>Rechazar</button></div> : order.status === "Aceptado" ? <button className="btn btn-brand" onClick={() => changeOrderStatus(order.id, "En preparación")}>Iniciar preparación</button> : order.status === "En preparación" ? <button className="btn btn-brand" onClick={() => changeOrderStatus(order.id, "Listo para entrega")}>Marcar como listo</button> : order.status === "Listo para entrega" ? <button className="btn btn-brand" onClick={() => changeOrderStatus(order.id, "Entregado")}>Marcar entregado</button> : <button className="btn btn-soft" disabled>Sin acciones</button>}</aside></article>)}{!received.length && <div className="empty-state surface-card"><h2>No hay pedidos en este estado</h2><p>Selecciona otro filtro para continuar.</p></div>}</div></div></main>;
  };

  const Admin = () => (
    <main className="dashboard-page admin-page"><div className="container"><div className="dashboard-title"><div><span className="eyebrow">Administración</span><h1>Control general</h1><p>Vista académica para supervisar usuarios, categorías y publicaciones.</p></div><span className="prototype-chip">Datos simulados</span></div><div className="kpi-grid admin-kpis"><div><span>Usuarios</span><strong>28</strong><small>18 compradores · 9 productores</small></div><div><span>Productos activos</span><strong>{activeProducts.length}</strong><small>4 categorías</small></div><div><span>Pedidos</span><strong>{orders.length}</strong><small>{orders.filter((o) => o.status === "Pendiente").length} pendientes</small></div><div><span>Borradores</span><strong>{products.filter((product) => productStatus(product) === "Borrador").length}</strong><small>Revisión local</small></div></div>
      <section className="dashboard-panel"><div className="admin-tabs">{["resumen","usuarios","categorías","productos","pedidos"].map((item) => <button key={item} className={adminTab === item ? "active" : ""} onClick={() => setAdminTab(item)}>{item[0].toUpperCase()+item.slice(1)}</button>)}</div>{adminTab === "resumen" ? <div className="admin-overview"><div><span className="eyebrow">Actividad</span><h2>Operación del prototipo</h2><div className="bar-list"><div><span>Productos con stock</span><b><i style={{width:`${activeProducts.length ? Math.round(activeProducts.filter((product) => product.stock > 0).length / activeProducts.length * 100) : 0}%`}}></i></b><strong>{activeProducts.length ? Math.round(activeProducts.filter((product) => product.stock > 0).length / activeProducts.length * 100) : 0}%</strong></div><div><span>Pedidos atendidos</span><b><i style={{width:`${orders.length ? Math.round(orders.filter((order) => order.status === "Entregado").length / orders.length * 100) : 0}%`}}></i></b><strong>{orders.length ? Math.round(orders.filter((order) => order.status === "Entregado").length / orders.length * 100) : 0}%</strong></div><div><span>Perfiles completos</span><b><i style={{width:"81%"}}></i></b><strong>81%</strong></div></div></div><div className="moderation-box"><h2>Revisión del contenido</h2><p>{products.filter((product) => productStatus(product) !== "Activo").length} publicaciones no están visibles en el catálogo.</p><button className="btn btn-brand" onClick={() => setAdminTab("productos")}>Revisar productos</button></div></div> : null}{adminTab === "usuarios" ? <div className="table-responsive"><table className="data-table"><thead><tr><th>Usuario</th><th>Rol</th><th>Región</th><th>Estado</th><th></th></tr></thead><tbody>{[["Carlos Huamán","Productor","Junín"],["María Quispe","Comprador","Lima"],["Rosa Paredes","Productor","Ica"],["Luis Flores","Comprador","Lima"]].map((u) => <tr key={u[0]}><td><strong>{u[0]}</strong><small className="d-block">usuario@demo.pe</small></td><td>{u[1]}</td><td>{u[2]}</td><td><span className="status-badge status-success">Activo</span></td><td><button className="table-link" onClick={() => showInfo(`Perfil de ${u[0]}`, `Rol: ${u[1]}. Región: ${u[2]}. En el Avance 2 esta información será consultada desde Spring Boot.`)}>Ver perfil</button></td></tr>)}</tbody></table></div> : null}{adminTab === "categorías" ? <div className="category-admin">{["Tubérculos","Hortalizas","Frutas","Granos"].map((item, index) => <div key={item}><span>{["🥔","🥬","🥑","◌"][index]}</span><strong>{item}</strong><small>{products.filter((p) => p.category === item).length} productos</small><button onClick={() => showInfo(`Categoría ${item}`, "La edición estructural de categorías quedará conectada al backend en el Avance 2. En este prototipo se muestra su impacto en el catálogo.")}>Ver detalle</button></div>)}</div> : null}{adminTab === "productos" ? <div className="table-responsive"><table className="data-table"><thead><tr><th>Producto</th><th>Productor</th><th>Unidad</th><th>Estado</th><th></th></tr></thead><tbody>{products.map((p) => <tr key={p.id}><td><div className="table-product"><img src={p.image} alt={p.name} /><strong>{p.name}</strong></div></td><td>{p.producer}</td><td>{p.unit}</td><td><ProductStatusBadge status={productStatus(p)} /></td><td><button className="table-link" onClick={() => showInfo(`Revisión: ${p.name}`, `${p.producer} · ${p.location} · ${p.unit} · Stock ${p.stock}.`)}>Revisar</button></td></tr>)}</tbody></table></div> : null}{adminTab === "pedidos" ? <div className="table-responsive"><table className="data-table"><thead><tr><th>Pedido</th><th>Productor</th><th>Total</th><th>Estado</th><th></th></tr></thead><tbody>{orders.map((o) => <tr key={o.id}><td><strong>{o.id}</strong><small className="d-block">{o.date}</small></td><td>{o.producer}</td><td>{money(o.total)}</td><td><StatusBadge status={o.status} /></td><td><button className="table-link" onClick={() => setModal({ type: "order", order: o })}>Ver detalle</button></td></tr>)}</tbody></table></div> : null}</section></div></main>
  );

  const screens = { inicio: Home, login: Login, registro: Register, catalogo: Catalog, producto: ProductDetail, carrito: Cart, confirmar: Checkout, pedidos: Orders, productor: ProducerDashboard, publicar: ProductForm, recibidos: ReceivedOrders, admin: Admin };
  const Screen = screens[view];

  return (
    <div className="site-shell">
      {view !== "login" && renderHeader()}
      {Screen()}
      {view !== "login" && renderFooter()}
      {view !== "login" ? <nav className="mobile-bottom-nav" aria-label="Navegación móvil"><button className={view === "inicio" ? "active" : ""} onClick={() => navigate("inicio")}><span>⌂</span>Inicio</button><button className={view === "catalogo" || view === "producto" ? "active" : ""} onClick={() => { setFavoritesOnly(false); navigate("catalogo"); }}><span>⌕</span>Productos</button><button className={view === "pedidos" ? "active" : ""} onClick={() => navigate("pedidos")}><span>▤</span>Pedidos</button><button className={["productor","publicar","recibidos","admin"].includes(view) ? "active" : ""} onClick={() => sessionRole ? navigate(sessionRole === "administrador" ? "admin" : sessionRole === "productor" ? "productor" : "pedidos") : navigate("login")}><span>◯</span>Panel</button><button className={view === "carrito" || view === "confirmar" ? "active" : ""} onClick={() => navigate("carrito")}><span>▢</span>Carrito{cartCount ? <b>{cartCount}</b> : null}</button></nav> : null}
      {toast ? <div className="toast-message" role="status"><span>✓</span>{toast}</div> : null}
      {renderModal()}
    </div>
  );
}
