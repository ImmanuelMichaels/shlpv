import { useState, useEffect, useRef, useCallback } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────
const NAV_LINKS = ["Trending", "New Arrival", "Sale", "Men", "Women", "Kid", "Sport", "Accessories"];

const NEW_ARRIVALS = [
  { id: 1, name: "Urban CR Handbag", category: "Men · Sneakers", price: 89, oldPrice: 110, img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80", tag: "Woman's Fashion", colors: ["#C4A882","#222","#fff"] },
  { id: 2, name: "Urban CR Handbag", category: "Men · Sneakers", price: 92, oldPrice: null, img: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&q=80", tag: null, colors: ["#fff","#e8e0d5","#444"] },
  { id: 3, name: "Urban CR Handbag", category: "Men · Sneakers", price: 76, oldPrice: 95, img: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=400&q=80", tag: null, colors: ["#8B9E6E","#555","#fff"] },
  { id: 4, name: "Urban CR Handbag", category: "Men · Sneakers", price: 115, oldPrice: null, img: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&q=80", tag: "New", colors: ["#D35C37","#111","#f5f0ea"] },
  { id: 5, name: "Air Vibe Lo", category: "Unisex · Running", price: 99, oldPrice: 130, img: "https://images.unsplash.com/photo-1584735175315-9d5df23be4be?w=400&q=80", tag: "Sale", colors: ["#fff","#444","#C4A882"] },
  { id: 6, name: "Studio Runner", category: "Women · Casual", price: 88, oldPrice: null, img: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=400&q=80", tag: null, colors: ["#e8e0d5","#222","#8B9E6E"] },
];

const BEST_SELLERS = [
  { id: 7, name: "Classic Lo Canvas", category: "Unisex · Casual", price: 79, img: "https://images.unsplash.com/photo-1556906781-9a414e2a7735?w=500&q=80", rating: 4.9, reviews: 312 },
  { id: 8, name: "Veil Platform", category: "Women · Fashion", price: 134, img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&q=80", rating: 4.7, reviews: 188 },
  { id: 9, name: "Force One High", category: "Men · Basketball", price: 109, img: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=500&q=80", rating: 4.8, reviews: 540 },
];

const COLLECTION_ITEMS = [
  { id: 10, label: "For Him", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80", desc: "Sharp. Minimal. Refined." },
  { id: 11, label: "For Her", img: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=500&q=80", desc: "Bold. Fluid. Effortless." },
  { id: 12, label: "Unisex", img: "https://images.unsplash.com/photo-1504593811423-6dd665756598?w=500&q=80", desc: "Free. Shared. Forward." },
];

const REVIEWS = [
  { name: "Jordan M.", role: "Verified Buyer", text: "The quality is absolutely unreal. Wore these for a week straight and they only get more comfortable. SHLPV has earned a customer for life.", stars: 5 },
  { name: "Priya S.", role: "Fashion Blogger", text: "These are the shoes I've been recommending to everyone. The silhouette is perfect and the colourways are genuinely thoughtful. Not just another sneaker brand.", stars: 5 },
  { name: "Carlos T.", role: "Verified Buyer", text: "Honestly skeptical at first but the materials are premium. Arrived in two days, box was beautiful. Will absolutely order again.", stars: 5 },
];

const WHY_ITEMS = [
  { icon: "◈", title: "Premium Materials", desc: "Every pair crafted from sustainably sourced leather and recycled composites." },
  { icon: "◉", title: "Perfect Fit Guarantee", desc: "Free exchanges within 60 days. If it doesn't fit, we'll make it right." },
  { icon: "◐", title: "Carbon Neutral Shipping", desc: "We offset 100% of our shipping emissions on every single order." },
  { icon: "◑", title: "Lifetime Support", desc: "Our team is available 7 days a week to help with anything you need." },
];

// ─── HOOKS ───────────────────────────────────────────────────────────────────
function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function Reveal({ children, delay = 0, y = 36, className = "" }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : `translateY(${y}px)`,
      transition: `opacity 0.75s cubic-bezier(.16,1,.3,1) ${delay}ms, transform 0.75s cubic-bezier(.16,1,.3,1) ${delay}ms`,
    }}>{children}</div>
  );
}

// ─── SUBCOMPONENTS ───────────────────────────────────────────────────────────
function StarRating({ count }) {
  return <span style={{ color: "#C4A882", fontSize: 13 }}>{"★".repeat(count)}{"☆".repeat(5 - count)}</span>;
}

function ProductCard({ item, onAdd, view = "grid" }) {
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAdd(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff",
        display: "flex",
        flexDirection: view === "list" ? "row" : "column",
        transition: "box-shadow 0.3s",
        boxShadow: hovered ? "0 16px 48px rgba(0,0,0,0.10)" : "0 2px 12px rgba(0,0,0,0.04)",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {item.tag && (
        <div style={{
          position: "absolute", top: 14, left: 14, zIndex: 2,
          background: item.tag === "Sale" ? "#D35C37" : item.tag === "New" ? "#222" : "#C4A882",
          color: "#fff", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase",
          fontFamily: "'DM Mono', monospace", padding: "4px 9px",
        }}>{item.tag}</div>
      )}
      <div style={{
        overflow: "hidden", background: "#F5F2EE",
        height: view === "list" ? 120 : 220,
        width: view === "list" ? 140 : "100%",
        flexShrink: 0,
      }}>
        <img
          src={item.img} alt={item.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s cubic-bezier(.16,1,.3,1)", transform: hovered ? "scale(1.07)" : "scale(1)" }}
        />
      </div>
      <div style={{ padding: view === "list" ? "16px 20px" : "16px 18px 20px", flex: 1 }}>
        <p style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#aaa", fontFamily: "'DM Mono', monospace", marginBottom: 5 }}>{item.category}</p>
        <p style={{ fontSize: view === "list" ? 16 : 15, fontWeight: 600, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.02em", marginBottom: 8 }}>{item.name}</p>
        {item.colors && (
          <div style={{ display: "flex", gap: 5, marginBottom: 10 }}>
            {item.colors.map((c, i) => (
              <div key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: c, border: "1px solid #ddd" }} />
            ))}
          </div>
        )}
        {item.rating && <div style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}><StarRating count={Math.round(item.rating)} /><span style={{ fontSize: 11, color: "#888", fontFamily: "'DM Mono', monospace" }}>({item.reviews})</span></div>}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
          <div>
            <span style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.04em" }}>${item.price}</span>
            {item.oldPrice && <span style={{ fontSize: 12, color: "#bbb", textDecoration: "line-through", marginLeft: 6, fontFamily: "'DM Mono', monospace" }}>${item.oldPrice}</span>}
          </div>
          <button
            onClick={handleAdd}
            style={{
              background: added ? "#4CAF50" : "#111", color: "#fff",
              border: "none", padding: "8px 14px",
              fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase",
              fontFamily: "'DM Mono', monospace", cursor: "pointer",
              transition: "background 0.3s, transform 0.15s",
              transform: hovered ? "translateY(0)" : "translateY(3px)",
              opacity: hovered ? 1 : 0.85,
            }}
          >{added ? "✓ Added" : "Add to Cart"}</button>
        </div>
      </div>
    </div>
  );
}

function CartDrawer({ cart, onClose, onRemove, onUpdateQty }) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1100, backdropFilter: "blur(3px)" }} />
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: "clamp(320px,38vw,460px)",
        background: "#fff", zIndex: 1200, display: "flex", flexDirection: "column",
        boxShadow: "-20px 0 60px rgba(0,0,0,0.15)", animation: "slideInRight 0.4s cubic-bezier(.16,1,.3,1)",
      }}>
        <div style={{ padding: "28px 32px", borderBottom: "1px solid #f0ece4", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace", color: "#999" }}>Your Cart</p>
            <p style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.04em" }}>{cart.length} ITEM{cart.length !== 1 ? "S" : ""}</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: "#222" }}>×</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 32px" }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", paddingTop: 80, color: "#bbb" }}>
              <p style={{ fontSize: 48, marginBottom: 16 }}>👟</p>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 13 }}>Your cart is empty.</p>
            </div>
          ) : cart.map((item) => (
            <div key={item.cartId} style={{ display: "flex", gap: 16, paddingBottom: 20, marginBottom: 20, borderBottom: "1px solid #f5f2ee" }}>
              <div style={{ width: 80, height: 80, background: "#F5F2EE", flexShrink: 0, overflow: "hidden" }}>
                <img src={item.img} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.03em", marginBottom: 4 }}>{item.name}</p>
                <p style={{ fontSize: 11, color: "#999", fontFamily: "'DM Mono', monospace", marginBottom: 10 }}>{item.category}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 0, border: "1px solid #eee" }}>
                    <button onClick={() => onUpdateQty(item.cartId, item.qty - 1)} style={{ width: 28, height: 28, background: "none", border: "none", cursor: "pointer", fontSize: 14 }}>−</button>
                    <span style={{ width: 28, textAlign: "center", fontFamily: "'DM Mono', monospace", fontSize: 13 }}>{item.qty}</span>
                    <button onClick={() => onUpdateQty(item.cartId, item.qty + 1)} style={{ width: 28, height: 28, background: "none", border: "none", cursor: "pointer", fontSize: 14 }}>+</button>
                  </div>
                  <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 16 }}>${(item.price * item.qty).toFixed(2)}</span>
                </div>
              </div>
              <button onClick={() => onRemove(item.cartId)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ccc", fontSize: 16, alignSelf: "flex-start" }}>×</button>
            </div>
          ))}
        </div>
        <div style={{ padding: "24px 32px", borderTop: "1px solid #f0ece4" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: "#666" }}>Subtotal</span>
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 22, letterSpacing: "0.04em" }}>${total.toFixed(2)}</span>
          </div>
          <button style={{
            width: "100%", background: "#111", color: "#fff", border: "none",
            padding: "16px", fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 14, letterSpacing: "0.18em", textTransform: "uppercase",
            cursor: "pointer", fontWeight: 700, transition: "background 0.2s",
          }} onMouseEnter={e => e.target.style.background = "#C4A882"} onMouseLeave={e => e.target.style.background = "#111"}>
            Checkout →
          </button>
          <button onClick={onClose} style={{
            width: "100%", background: "none", color: "#888", border: "1px solid #eee",
            padding: "12px", fontFamily: "'DM Mono', monospace",
            fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase",
            cursor: "pointer", marginTop: 10,
          }}>Continue Shopping</button>
        </div>
      </div>
    </>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function SHLPV() {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [filter, setFilter] = useState("All");
  const [heroSlide, setHeroSlide] = useState(0);
  const [bestSlide, setBestSlide] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Auto-advance hero
  useEffect(() => {
    const t = setInterval(() => setHeroSlide(s => (s + 1) % 3), 5000);
    return () => clearInterval(t);
  }, []);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  const addToCart = useCallback((item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, qty: 1, cartId: Date.now() }];
    });
    showToast(`${item.name} added to cart`);
  }, [showToast]);

  const removeFromCart = (cartId) => setCart(prev => prev.filter(i => i.cartId !== cartId));
  const updateQty = (cartId, qty) => {
    if (qty < 1) { removeFromCart(cartId); return; }
    setCart(prev => prev.map(i => i.cartId === cartId ? { ...i, qty } : i));
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const FILTERS = ["All", "Men's Fashion", "Women's Fashion", "Women Accessories", "Men Accessories", "Discount Deals"];
  const filteredArrivals = NEW_ARRIVALS.filter(p => {
    if (filter === "All") return true;
    if (filter === "Sale") return p.tag === "Sale" || p.oldPrice;
    return p.category.toLowerCase().includes(filter.toLowerCase());
  });

  const heroData = [
    { headline: "PURE COMFORT", sub: "EST 2018 — EXCLUSIVE LAUNCH 21.09.25", cta: "Shop Now", accent: "#C4A882" },
    { headline: "BOLD FORM", sub: "NEW ARRIVALS — SEASON COLLECTION", cta: "Explore", accent: "#D35C37" },
    { headline: "FREESTYLE", sub: "UNISEX LINE — FOR EVERY STEP", cta: "Discover", accent: "#8B9E6E" },
  ];

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div style={{ fontFamily: "'Barlow', sans-serif", background: "#FAFAF8", color: "#111", overflowX: "hidden", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;600;700;800;900&family=Barlow:wght@300;400;500&family=DM+Mono:wght@300;400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        :root{--gold:#C4A882;--dark:#111;--cream:#FAFAF8;--sand:#F2EDE4;--rust:#D35C37;--sage:#8B9E6E;}
        body{overflow-x:hidden;}
        html{scroll-behavior:smooth;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-track{background:#f5f5f5;}
        ::-webkit-scrollbar-thumb{background:#C4A882;}
        @keyframes slideInRight{from{transform:translateX(100%);}to{transform:translateX(0);}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
        @keyframes toastIn{from{opacity:0;transform:translateY(20px) scale(0.95);}to{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes marquee{from{transform:translateX(0);}to{transform:translateX(-50%);}}
        .hero-headline{
          font-family:'Barlow Condensed',sans-serif;
          font-size:clamp(72px,14vw,160px);
          font-weight:900;
          line-height:0.88;
          letter-spacing:+0.08em;
          white-space:pre-line;
          color:#111;
        }
        .section-title{
          font-family:'Barlow Condensed',sans-serif;
          font-size:clamp(36px,6vw,72px);
          font-weight:800;
          letter-spacing:-0.01em;
          line-height:1;
        }
        .mono{font-family:'DM Mono',monospace;}
        .nav-link{
          font-family:'DM Mono',monospace;
          font-size:11px;letter-spacing:0.1em;text-transform:uppercase;
          color:#555;cursor:pointer;background:none;border:none;
          transition:color 0.2s;padding:4px 0;
          position:relative;
        }
        .nav-link::after{content:'';position:absolute;bottom:-1px;left:0;width:0;height:1px;background:var(--dark);transition:width 0.25s;}
        .nav-link:hover{color:#111;}
        .nav-link:hover::after{width:100%;}
        .btn-dark{
          background:#111;color:#fff;border:none;
          padding:13px 32px;
          border-radius:10px;
          font-family:'Barlow Condensed',sans-serif;
          font-size:13px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;
          cursor:pointer;transition:background 0.25s,transform 0.15s;
        }
        .btn-dark:hover{background:var(--gold);transform:translateY(-1px); border-radius:4px;}
        .btn-outline{
          background:transparent;color:#111;border:1.5px solid #111;
          padding:12px 28px;
          font-family:'Barlow Condensed',sans-serif;
          font-size:13px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;
          cursor:pointer;transition:all 0.25s;
        }
        .btn-outline:hover{background:#111;color:#fff;}
        @media(max-width:768px){
          .hide-md{display:none!important;}
          .col-2{grid-template-columns:1fr!important;}
          .col-3{grid-template-columns:1fr 1fr!important;}
        }
        @media(max-width:480px){
          .col-3{grid-template-columns:1fr!important;}
        }
      `}</style>

      {/* TOAST */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
          background: "#111", color: "#fff", padding: "13px 28px",
          fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: "0.08em",
          zIndex: 2000, animation: "toastIn 0.35s ease", whiteSpace: "nowrap",
          boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
        }}>✓ &nbsp;{toast}</div>
      )}

      {/* CART DRAWER */}
      {cartOpen && <CartDrawer cart={cart} onClose={() => setCartOpen(false)} onRemove={removeFromCart} onUpdateQty={updateQty} />}

      {/* ── NAVBAR ─────────────────────────────────────────────────────────── */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 900,
        background: scrolled ? "rgba(250,250,248,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(0,0,0,0.06)" : "none",
        transition: "all 0.4s",
      }}>
        {/* Top strip */}
        <div style={{ background: "#111", padding: "8px 0", overflow: "hidden" }}>
          <div style={{ display: "flex", animation: "marquee 22s linear infinite", whiteSpace: "nowrap", width: "max-content" }}>
            {Array(4).fill("FREE SHIPPING ON ORDERS OVER $80 · NEW ARRIVALS EVERY FRIDAY · SHOP THE COLLECTION ·").map((t, i) => (
              <span key={i} style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.7)", letterSpacing: "0.15em", padding: "0 32px" }}>{t}</span>
            ))}
          </div>
        </div>

        <div style={{ padding: "0 clamp(16px,4vw,64px)", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, background: "#111", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 14, color: "#fff", letterSpacing: "0.05em" }}>SH</span>
            </div>
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 22, letterSpacing: "0.12em" }}>SHLPV</span>
          </div>

          {/* Search bar */}
          <div className="hide-md" style={{ display: "flex", alignItems: "center", border: "1px solid #e0dbd1", background: "#fff", padding: "8px 16px", gap: 8, width: "clamp(200px,28vw,360px)" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input
              value={searchVal} onChange={e => setSearchVal(e.target.value)}
              placeholder="What are you looking for..."
              style={{ border: "none", outline: "none", background: "transparent", fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#111", flex: 1 }}
            />
          </div>

          {/* Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <button style={{ background: "none", border: "none", cursor: "pointer" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </button>
            <button style={{ background: "none", border: "none", cursor: "pointer" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </button>
            <button onClick={() => setCartOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", position: "relative" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.8"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              {cartCount > 0 && (
                <span style={{
                  position: "absolute", top: -7, right: -7,
                  background: "var(--rust)", color: "#fff", borderRadius: "50%",
                  width: 17, height: 17, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 9, fontFamily: "'DM Mono', monospace", fontWeight: 500,
                }}>{cartCount}</span>
              )}
            </button>
          </div>
        </div>

        {/* Nav links row */}
        <div className="hide-md" style={{ padding: "0 clamp(16px,4vw,64px) 0", borderTop: "1px solid rgba(0,0,0,0.06)", display: "flex", gap: 32, height: 44, alignItems: "center" }}>
          {NAV_LINKS.map(l => (
            <button key={l} className="nav-link" onClick={() => scrollTo(l.toLowerCase().replace(" ",""))}>{l}</button>
          ))}
          <div style={{ marginLeft: "auto", display: "flex", gap: 20 }}>
            <button className="nav-link" style={{ color: "var(--rust)" }}>Sale 🔥</button>
            <button className="nav-link">Sustainability</button>
          </div>
        </div>
      </header>

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section style={{ paddingTop: 108, minHeight: "100vh", display: "flex", flexDirection: "column", background: "#FAFAF8", position: "relative", overflow: "hidden" }}>
        {/* Background grid */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(#e8e4dc 1px, transparent 1px), linear-gradient(90deg, #e8e4dc 1px, transparent 1px)", backgroundSize: "64px 64px", opacity: 0.35, pointerEvents: "none" }} />

        <div style={{ padding: "0 clamp(16px,4vw,64px)", alignItems: "center", gap: 40, position: "relative", zIndex: 1 }} className="col-2">
          <div>
            <div style={{ overflow: "hidden", marginBottom: 20 }}>
              <p className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "#999", animation: "fadeUp 0.6s ease both" }}>
                {heroData[heroSlide].sub}
              </p>
            </div>
            <div key={heroSlide} style={{ animation: "fadeUp 0.6s ease both" }}>
              <h1 className="hero-headline">{heroData[heroSlide].headline}</h1>
            </div>
            
            {/* Slide indicators */}
            <div style={{ display: "flex", gap: 8, marginTop: 48 }}>
              {[0,1,2].map(i => (
                <button key={i} onClick={() => setHeroSlide(i)} style={{
                  width: i === heroSlide ? 32 : 8, height: 8,
                  background: i === heroSlide ? "#111" : "#ddd",
                  border: "none", cursor: "pointer",
                  transition: "all 0.4s ease",
                }} />
              ))}
            </div>
          </div>

          {/* Hero image */}
          <div style={{ position: "relative", height: "clamp(400px,60vh,700px)" }}>
            <div style={{ position: "absolute", inset: 0, background: "#F2EDE4", overflow: "hidden" }}>
              <img
                key={heroSlide}
                src={[
                  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=85",
                  "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=85",
                  "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=800&q=85",
                ][heroSlide]}
                alt="Hero Shoe"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", animation: "fadeUp 0.7s ease both" }}
              />
              {/* Overlay label */}
              <div style={{
                position: "absolute", bottom: 24, left: 24,
                background: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)",
                padding: "12px 20px",
              }}>
                <p className="mono" style={{ fontSize: 9, color: "#999", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 3 }}>Collection 2025</p>
                <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 15, letterSpacing: "0.06em" }}>EXCLUSIVE DROP</p>
              </div>
            </div>
            {/* Accent corner mark */}
            <div style={{ position: "absolute", top: -12, right: -12, width: 48, height: 48, background: heroData[heroSlide].accent }} />
          </div>

          <div style={{ marginTop: 20, marginBottom: 40, justifyContent: "space-between", display: "flex", gap: 150, flexWrap: "wrap", animation: "fadeUp 0.7s ease 0.1s both" }}>
              <p style={{ fontSize: 12, lineHeight: 1.5, maxWidth: 400, textAlign: "left", color: "#888" }}>
                Discover the latest drops, exclusive collaborations, and timeless classics - all in one place, shop quality sneakers every step of your journey.
              </p>
              <button className="btn-dark" onClick={() => scrollTo("newarrivals")}>{heroData[heroSlide].cta}</button>
          </div>
        </div>

        {/* Stats strip */}
        {/* <div style={{ background: "#111", padding: "24px clamp(16px,4vw,64px)", display: "flex", gap: 48, flexWrap: "wrap", justifyContent: "center", position: "relative", zIndex: 1 }}>
          {[["50K+", "Happy Customers"], ["120+", "Exclusive Styles"], ["4.9", "Average Rating"], ["2-Day", "Express Delivery"]].map(([n, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 32, color: "#fff", letterSpacing: "0.04em" }}>{n}</div>
              <div className="mono" style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div> */}
      </section>

      {/* ── NEW ARRIVALS ───────────────────────────────────────────────────── */}
      <section id="newarrivals" style={{ padding: "96px clamp(16px,4vw,64px)" }}>
        <Reveal>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", marginBottom: 40, flexWrap: "wrap", gap: 20 }}>
            <div>
              <h2 className="section-title">New Arrivals</h2>
            </div>
            {/* Filters */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {FILTERS.map(f => (
                <button key={f} onClick={() => setFilter(f)} className="mono" style={{
                  padding: "8px 18px", border: "1px solid",
                  borderColor: filter === f ? "#111" : "#ddd",
                  background: filter === f ? "#111" : "transparent",
                  color: filter === f ? "#fff" : "#888",
                  fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase",
                  cursor: "pointer", transition: "all 0.22s",
                  borderRadius: 6,
                }}>{f}</button>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="col-3" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
          {filteredArrivals.map((item, i) => (
            <Reveal key={item.id} delay={i * 70}>
              <ProductCard item={item} onAdd={addToCart} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── MARQUEE DIVIDER ─────────────────────────────────────────────────── */}
      <div style={{ background: "white", padding: "14px 0", overflow: "hidden" }}>
        <div style={{ display: "flex", animation: "marquee 16s linear infinite", width: "max-content" }}>
          {Array(6).fill("COMFORT FIRST · STYLE ALWAYS · FREE RETURNS · NEW DROPS WEEKLY ·").map((t, i) => (
            <span key={i} style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: "0.2em", color: "#fff", padding: "0 24px", whiteSpace: "nowrap" }}>{t}</span>
          ))}
        </div>
      </div>

      {/* ── COLLECTION ─────────────────────────────────────────────────────── */}
      <section id="collection" style={{ padding: "96px clamp(16px,4vw,64px)" }}>
        <Reveal>
          <div style={{ marginBottom: 48 }}>
            <h2 className="section-title">See Our New Collection</h2>
          </div>
        </Reveal>
        <div className="col-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {COLLECTION_ITEMS.map((item, i) => (
            <Reveal key={item.id} delay={i * 100}>
              <CollectionCard item={item} onAdd={addToCart} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── BEST SELLERS ───────────────────────────────────────────────────── */}
      <section id="bestsellers" style={{ padding: "96px clamp(16px,4vw,64px)" }}>
        <Reveal>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 48, flexWrap: "wrap", gap: 16 }}>
            <div>
              <h2 className="section-title">Best Sellers</h2>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setBestSlide(s => Math.max(s - 1, 0))} style={{ width: 40, height: 40, border: "1.5px solid #ddd", background: "none", cursor: "pointer", fontSize: 18, transition: "all 0.2s" }}>←</button>
              <button onClick={() => setBestSlide(s => Math.min(s + 1, BEST_SELLERS.length - 1))} style={{ width: 40, height: 40, border: "1.5px solid #111", background: "#111", color: "#fff", cursor: "pointer", fontSize: 18, transition: "all 0.2s" }}>→</button>
            </div>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 32, alignItems: "start" }} className="col-2">
          {/* Featured best seller */}
          <Reveal>
            <div style={{ background: "#F2EDE4", overflow: "hidden", position: "relative", cursor: "pointer" }}>
              <img
                src={BEST_SELLERS[bestSlide].img}
                alt={BEST_SELLERS[bestSlide].name}
                style={{ width: "100%", height: 460, objectFit: "cover", display: "block", transition: "transform 0.6s ease" }}
              />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(0,0,0,0.6))", padding: "48px 28px 28px" }}>
                <p className="mono" style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 4 }}>{BEST_SELLERS[bestSlide].category}</p>
                <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 26, color: "#fff", letterSpacing: "0.04em" }}>{BEST_SELLERS[bestSlide].name}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
                  <StarRating count={Math.round(BEST_SELLERS[bestSlide].rating)} />
                  <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 22, color: "#fff" }}>${BEST_SELLERS[bestSlide].price}</span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* List */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {BEST_SELLERS.map((item, i) => (
              <Reveal key={item.id} delay={i * 80}>
                <ProductCard item={item} onAdd={addToCart} view="list" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER BANNER ──────────────────────────────────────────────── */}
      <section style={{ margin: "0 clamp(16px,4vw,64px) 96px", background: "#111", padding: "72px clamp(24px,6vw,96px)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }} className="col-2">
        <Reveal>
          <p className="mono" style={{ fontSize: 10, color: "var(--gold)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>Stay Updated</p>
          <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: "clamp(32px,5vw,64px)", color: "#fff", lineHeight: 0.95, letterSpacing: "-0.01em" }}>
            STAY IN<br />THE LOOP
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="mono" style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.9, marginBottom: 28 }}>
            Get early access to new drops, exclusive discounts, and style inspiration delivered straight to your inbox.
          </p>
          <div style={{ display: "flex", gap: 0 }}>
            <input
              placeholder="your@email.com"
              style={{
                flex: 1, padding: "14px 18px", border: "none",
                borderBottom: "2px solid rgba(255,255,255,0.2)", background: "transparent",
                fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#fff", outline: "none",
              }}
            />
            <button className="btn-dark" style={{ background: "var(--gold)", borderRadius: 0 }}>Subscribe</button>
          </div>
          <p className="mono" style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 12, letterSpacing: "0.08em" }}>No spam. Unsubscribe anytime.</p>
        </Reveal>
      </section>

      {/* ── WHY CHOOSE US ──────────────────────────────────────────────────── */}
      <section style={{ padding: "96px clamp(16px,4vw,64px)", background: "#F2EDE4" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <h2 className="section-title">Why Choose Us?</h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 32, maxWidth: 1100, margin: "0 auto" }}>
          {WHY_ITEMS.map((w, i) => (
            <Reveal key={w.title} delay={i * 90}>
              <WhyCard item={w} />
            </Reveal>
          ))}
        </div>
        <Reveal delay={100}>
          <div style={{ marginTop: 64, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 900, margin: "64px auto 0" }} className="col-2">
            <img src="https://images.unsplash.com/photo-1556906781-9a414e2a7735?w=600&q=80" alt="shoes" style={{ width: "100%", height: 320, objectFit: "cover" }} />
            <div style={{ background: "#111", padding: "48px 40px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <p className="mono" style={{ fontSize: 10, color: "var(--gold)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16 }}>About SHLPV</p>
              <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 36, color: "#fff", letterSpacing: "0.02em", marginBottom: 20, lineHeight: 1 }}>MADE FOR EVERY STRIDE</h3>
              <p className="mono" style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.9, marginBottom: 28 }}>From the track to the street, we design shoes that move with you — built for comfort, crafted for style.</p>
              <button className="btn-dark" style={{ alignSelf: "flex-start" }} onClick={() => scrollTo("newarrivals")}>Shop Now →</button>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── REVIEWS ────────────────────────────────────────────────────────── */}
      <section style={{ padding: "96px clamp(16px,4vw,64px)" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <h2 className="section-title">Customer Reviews</h2>
          </div>
        </Reveal>
        <div className="col-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, maxWidth: 1100, margin: "0 auto" }}>
          {REVIEWS.map((r, i) => (
            <Reveal key={i} delay={i * 90}>
              <div style={{ background: "#fff", padding: "36px 32px", borderTop: "3px solid var(--gold)", boxShadow: "0 4px 24px rgba(0,0,0,0.05)" }}>
                <StarRating count={r.stars} />
                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 15, lineHeight: 1.75, color: "#444", margin: "16px 0 24px", fontWeight: 300 }}>"{r.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#111", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span className="mono" style={{ color: "#fff", fontSize: 11, fontWeight: 500 }}>{r.name.split(" ").map(w => w[0]).join("")}</span>
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 15, letterSpacing: "0.04em" }}>{r.name}</p>
                    <p className="mono" style={{ fontSize: 10, color: "#aaa" }}>{r.role}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ─────────────────────────────────────────────────────── */}
      <section style={{ background: "#111", padding: "100px clamp(16px,4vw,64px)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }} className="col-2">
        <Reveal>
          <p className="mono" style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>Don't Miss Out</p>
          <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: "clamp(48px,8vw,96px)", color: "#fff", lineHeight: 0.88, letterSpacing: "-0.01em" }}>
            ARE YOU<br />
            <span style={{ color: "var(--gold)", fontStyle: "italic", fontWeight: 300 }}>INTERESTED?</span>
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 360 }}>
            <p className="mono" style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.9 }}>
              Join thousands of happy customers who've found their perfect pair. Exclusive styles. Premium comfort. Zero compromise.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <button className="btn-dark" style={{ background: "var(--gold)" }} onClick={() => scrollTo("newarrivals")}>Shop Now</button>
              <button className="btn-outline" style={{ borderColor: "rgba(255,255,255,0.3)", color: "#fff" }} onClick={() => scrollTo("collection")}>Browse Collection</button>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer style={{ background: "#0c0c0b", padding: "60px clamp(16px,4vw,64px) 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }} className="col-2">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 28, height: 28, background: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 12, color: "#fff" }}>SH</span>
              </div>
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: "0.12em", color: "#fff" }}>SHLPV</span>
            </div>
            <p className="mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", lineHeight: 1.8, maxWidth: 240 }}>Designed for movement. Built for style. Every step, elevated.</p>
            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              {["IG", "TW", "YT", "TK"].map(s => (
                <div key={s} style={{ width: 32, height: 32, border: "1px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <span className="mono" style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", letterSpacing: "0.05em" }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
          {[
            { title: "Shop", links: ["New Arrivals", "Best Sellers", "Men", "Women", "Kids", "Sale"] },
            { title: "Help", links: ["Sizing Guide", "Shipping", "Returns", "FAQ", "Contact"] },
            { title: "Company", links: ["About", "Sustainability", "Careers", "Press", "Affiliates"] },
          ].map(({ title, links }) => (
            <div key={title}>
              <p className="mono" style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 20, fontWeight: 500 }}>{title}</p>
              {links.map(l => (
                <p key={l} className="mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginBottom: 10, cursor: "pointer", transition: "color 0.2s" }}
                  onMouseEnter={e => e.target.style.color = "var(--gold)"}
                  onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.3)"}>{l}</p>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 28, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <p className="mono" style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", letterSpacing: "0.08em" }}>© 2025 SHLPV. All rights reserved.</p>
          <p className="mono" style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", letterSpacing: "0.08em" }}>Privacy · Terms · Cookies</p>
        </div>
      </footer>
    </div>
  );
}

// ─── COLLECTION CARD ─────────────────────────────────────────────────────────
function CollectionCard({ item }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ position: "relative", overflow: "hidden", cursor: "pointer", height: 400 }}>
      <img src={item.img} alt={item.label} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", transition: "transform 0.7s cubic-bezier(.16,1,.3,1)", transform: hovered ? "scale(1.06)" : "scale(1)" }} />
      <div style={{ position: "absolute", inset: 0, background: hovered ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.18)", transition: "background 0.4s" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "32px 28px", transform: hovered ? "translateY(0)" : "translateY(6px)", transition: "transform 0.4s" }}>
        <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 28, color: "#fff", letterSpacing: "0.04em", marginBottom: 4 }}>{item.label}</p>
        <p className="mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", letterSpacing: "0.1em", opacity: hovered ? 1 : 0, transition: "opacity 0.3s" }}>{item.desc}</p>
        <div style={{ marginTop: 16, opacity: hovered ? 1 : 0, transform: hovered ? "translateY(0)" : "translateY(8px)", transition: "all 0.35s 0.05s" }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#fff", letterSpacing: "0.16em", textTransform: "uppercase", borderBottom: "1px solid rgba(255,255,255,0.5)", paddingBottom: 2 }}>Explore →</span>
        </div>
      </div>
    </div>
  );
}

// ─── WHY CARD ─────────────────────────────────────────────────────────────────
function WhyCard({ item }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{
      background: hovered ? "#111" : "#fff",
      padding: "36px 32px",
      transition: "all 0.35s ease",
      cursor: "default",
      boxShadow: hovered ? "0 20px 48px rgba(0,0,0,0.12)" : "0 2px 12px rgba(0,0,0,0.04)",
    }}>
      <div style={{ fontSize: 28, marginBottom: 20, color: hovered ? "var(--gold)" : "#C4A882" }}>{item.icon}</div>
      <h4 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 20, letterSpacing: "0.04em", marginBottom: 10, color: hovered ? "#fff" : "#111" }}>{item.title}</h4>
      <p className="mono" style={{ fontSize: 11, color: hovered ? "rgba(255,255,255,0.5)" : "#999", lineHeight: 1.8 }}>{item.desc}</p>
    </div>
  );
}
