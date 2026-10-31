"use client";

import { useEffect, useMemo, useState } from "react";

type Category = "Tất cả" | "Liên Quân" | "Free Fire" | "PUBG Mobile" | "Tài khoản" | "Vật phẩm";
type Product = {
  id: string;
  game: Exclude<Category, "Tất cả" | "Tài khoản" | "Vật phẩm">;
  category: "Nạp game" | "Tài khoản" | "Vật phẩm";
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  tag?: string;
  icon: string;
  tone: string;
};

const products: Product[] = [
  { id: "lq-1", game: "Liên Quân", category: "Nạp game", name: "Quân Huy  Quà tặng", description: "Gói nạp mẫu • giao dịch qua kênh chính thức", price: 20000, oldPrice: 25000, tag: "Phổ biến", icon: "⚔️", tone: "violet" },
  { id: "lq-2", game: "Liên Quân", category: "Vật phẩm", name: "Voucher vật phẩm", description: "Mã ưu đãi mẫu cho sự kiện trong game", price: 49000, tag: "Ưu đãi", icon: "💎", tone: "blue" },
  { id: "ff-1", game: "Free Fire", category: "Nạp game", name: "Kim Cương — Gói cơ bản", description: "Gói nạp mẫu • cần xác nhận máy chủ", price: 50000, oldPrice: 60000, tag: "Bán chạy", icon: "💠", tone: "orange" },
  { id: "ff-2", game: "Free Fire", category: "Vật phẩm", name: "Thẻ sự kiện Free Fire", description: "Sản phẩm minh họa, chờ cấu hình nhà cung cấp", price: 79000, icon: "🎟️", tone: "pink" },
  { id: "pubg-1", game: "PUBG Mobile", category: "Nạp game", name: "UC — Gói khởi đầu", description: "Gói nạp mẫu • giao dịch qua kênh chính thức", price: 59000, oldPrice: 69000, tag: "Mới", icon: "🪖", tone: "gold" },
  { id: "pubg-2", game: "PUBG Mobile", category: "Vật phẩm", name: "Hộp vật phẩm sự kiện", description: "Sản phẩm minh họa, chưa mở bán", price: 99000, icon: "🎁", tone: "green" },
  { id: "acc-1", game: "Liên Quân", category: "Tài khoản", name: "Khu vực tài khoản Liên Quân", description: "Chỉ đăng tin khi có quyền chuyển nhượng hợp lệ", price: 0, tag: "Sắp ra mắt", icon: "🛡️", tone: "violet" },
  { id: "acc-2", game: "Free Fire", category: "Tài khoản", name: "Khu vực tài khoản Free Fire", description: "Chỉ đăng tin khi đáp ứng điều khoản nhà phát hành", price: 0, tag: "Sắp ra mắt", icon: "🎮", tone: "orange" }
];

type StoredOrder = { id: string; createdAt: string; playerId: string; payment: "bank" | "wallet"; total: number; items: { id: string; name: string; game: string; quantity: number; unitPrice: number }[]; };

const CART_STORAGE_KEY = "gamehub.cart.v1";
const ORDERS_STORAGE_KEY = "gamehub.orders.v1";
const categories: Category[] = ["Tất cả", "Liên Quân", "Free Fire", "PUBG Mobile", "Tài khoản", "Vật phẩm"];
const money = (value: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);

export default function HomePage() {
  const [category, setCategory] = useState<Category>("Tất cả");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartReady, setCartReady] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          const safeCart = Object.fromEntries(Object.entries(parsed).filter(([id, quantity]) => products.some((product) => product.id === id) && typeof quantity === "number" && Number.isInteger(quantity) && quantity > 0 && quantity <= 99)) as Record<string, number>;
          setCart(safeCart);
        }
      }
    } catch {
      window.localStorage.removeItem(CART_STORAGE_KEY);
    } finally {
      setCartReady(true);
    }
  }, []);

  useEffect(() => {
    if (cartReady) window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart, cartReady]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [payment, setPayment] = useState<"bank" | "wallet">("bank");
  const [playerId, setPlayerId] = useState("");
  const [notice, setNotice] = useState("");

  const visibleProducts = useMemo(() => products.filter((product) => {
    const matchesCategory = category === "Tất cả" || product.game === category || product.category === category;
    const matchesQuery = `${product.name} ${product.game} ${product.description}`.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  }), [category, query]);

  const cartItems = products.filter((product) => cart[product.id] > 0);
  const count = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  const total = cartItems.reduce((sum, product) => sum + product.price * cart[product.id], 0);

  function addToCart(product: Product) {
    if (product.price <= 0) {
      setNotice("Danh mục tài khoản đang ở chế độ giới thiệu, chưa nhận giao dịch.");
      return;
    }
    setCart((current) => ({ ...current, [product.id]: (current[product.id] ?? 0) + 1 }));
    setNotice(`Đã thêm ${product.name} vào giỏ hàng.`);
  }

  function changeQuantity(id: string, delta: number) {
    setCart((current) => {
      const next = { ...current, [id]: Math.max(0, (current[id] ?? 0) + delta) };
      if (next[id] === 0) delete next[id];
      return next;
    });
  }

  function submitDemoOrder() {
    if (!playerId.trim()) {
      setNotice("Vui lòng nhập ID nhân vật / thông tin nhận hàng cần thiết.");
      return;
    }
    const order: StoredOrder = {
      id: "GH-" + Date.now().toString(36).toUpperCase(),
      createdAt: new Date().toISOString(),
      playerId: playerId.trim(),
      payment,
      total,
      items: cartItems.map((product) => ({ id: product.id, name: product.name, game: product.game, quantity: cart[product.id], unitPrice: product.price }))
    };
    try {
      const savedOrders = window.localStorage.getItem(ORDERS_STORAGE_KEY);
      const parsedOrders: unknown = savedOrders ? JSON.parse(savedOrders) : [];
      const safeOrders = Array.isArray(parsedOrders) ? parsedOrders : [];
      window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify([order, ...safeOrders].slice(0, 50)));
      setCart({});
      window.localStorage.removeItem(CART_STORAGE_KEY);
      setCheckoutOpen(false);
      setCartOpen(false);
      setNotice("Đã lưu đơn demo " + order.id + " trên thiết bị này. Chưa có thanh toán hoặc giao hàng thật.");
    } catch {
      setNotice("Không thể lưu đơn trên trình duyệt. Hãy kiểm tra dung lượng lưu trữ rồi thử lại.");
    }
  }

  return (
    <main>
      <div className="announcement"><span className="pulse" /> GAMEHUB STORE <span className="announcement-divider">/</span> Nền tảng mua sắm game đang trong giai đoạn MVP</div>
      <header className="topbar">
        <a className="brand" href="#" aria-label="GameHub trang chủ"><span className="brand-mark">G</span><span>GAME<span className="brand-accent">HUB</span><small>GAME DIGITAL MARKET</small></span></a>
        <nav className="desktop-nav" aria-label="Điều hướng chính"><a className="active" href="#store">Cửa hàng</a><a href="#games">Trò chơi</a><a href="#how">Hướng dẫn</a><a href="/orders">Đơn hàng</a></nav>
        <div className="top-actions"><span className="secure-label">✦ Giao dịch an toàn</span><button className="cart-button" onClick={() => setCartOpen(true)} aria-label={`Mở giỏ hàng, ${count} sản phẩm`}>Giỏ hàng <span>{count}</span></button></div>
      </header>

      <section className="hero" id="games">
        <div className="hero-copy"><div className="eyebrow"><span /> DIGITAL GAME MARKETPLACE</div><h1>Nâng cấp cuộc chơi.<br /><em>Chạm đỉnh</em> đam mê.</h1><p>Một điểm đến cho Liên Quân, Free Fire và PUBG Mobile. Khám phá gói nạp, vật phẩm và các dịch vụ game.</p><div className="hero-actions"><a className="primary-button" href="#store">Khám phá cửa hàng <span>↗</span></a><a className="text-link" href="#how">Cách mua hàng <span>→</span></a></div><div className="hero-stats"><div><strong>03</strong><span>TRÒ CHƠI</span></div><i /><div><strong>24/7</strong><span>TRUY CẬP</span></div><i /><div><strong>100%</strong><span>MINH BẠCH</span></div></div></div>
        <div className="hero-art" aria-label="Minh họa game"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="hero-glow" /><div className="hero-emblem">✦</div><div className="floating-card card-top"><span>✧</span><div><b>GAME ON</b><small>YOUR NEXT LEVEL</small></div></div><div className="floating-card card-bottom"><span>⚡</span><div><b>TOP UP</b><small>POWER YOUR GAME</small></div></div><div className="hero-game-icons"><span>⚔️</span><span>🔥</span><span>🪖</span></div><div className="hero-caption">PLAY <b>WITHOUT LIMITS</b></div></div>
      </section>

      <section className="trust-strip"><div><span>◈</span><p><b>Danh mục rõ ràng</b><small>Thông tin sản phẩm minh bạch</small></p></div><div><span>⌁</span><p><b>Thanh toán linh hoạt</b><small>QR ngân hàng & ví nội bộ</small></p></div><div><span>◎</span><p><b>Hỗ trợ người chơi</b><small>Quy trình đặt hàng dễ hiểu</small></p></div></section>

      <section className="store-section" id="store">
        <div className="section-heading"><div><div className="eyebrow">CHỌN THỨ BẠN CẦN</div><h2>Khám phá <em>cửa hàng</em></h2><p>Tìm sản phẩm phù hợp với tựa game bạn yêu thích.</p></div><div className="catalog-count"><b>{visibleProducts.length.toString().padStart(2, "0")}</b><span>SẢN PHẨM</span></div></div>
        <div className="store-toolbar"><div className="category-tabs" role="tablist" aria-label="Lọc danh mục">{categories.map((item) => <button key={item} role="tab" aria-selected={category === item} className={category === item ? "selected" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div><label className="search-box"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm game, sản phẩm..." aria-label="Tìm sản phẩm" /><kbd>⌘ K</kbd></label></div>
        <div className="product-grid">{visibleProducts.map((product) => <article className="product-card" key={product.id}><div className={`product-visual ${product.tone}`}><div className="visual-grid" /><span className="product-icon">{product.icon}</span><span className="game-chip">{product.game}</span>{product.tag && <span className="product-tag">{product.tag}</span>}<span className="visual-index">GH / {product.id.toUpperCase()}</span></div><div className="product-info"><div className="product-type">{product.category.toUpperCase()}</div><h3>{product.name}</h3><p>{product.description}</p><div className="product-bottom"><div>{product.price > 0 ? <><strong>{money(product.price)}</strong>{product.oldPrice && <del>{money(product.oldPrice)}</del>}</> : <strong className="coming-soon">Sắp mở bán</strong>}</div><button className="add-button" onClick={() => addToCart(product)} aria-label={`Thêm ${product.name} vào giỏ`}>{product.price > 0 ? "+" : "↗"}</button></div></div></article>)}</div>
        {visibleProducts.length === 0 && <div className="empty-state"><span>⌕</span><h3>Không tìm thấy sản phẩm</h3><p>Thử từ khóa khác hoặc chọn danh mục khác.</p><button onClick={() => { setQuery(""); setCategory("Tất cả"); }}>Xóa bộ lọc</button></div>}
      </section>

      <section className="feature-banner" id="how"><div><div className="eyebrow">SẴN SÀNG CHIẾN ĐẤU?</div><h2>Cuộc chơi của bạn.<br /><em>Luật chơi của bạn.</em></h2><p>Chọn game, tìm sản phẩm, thêm vào giỏ và xem trước quy trình thanh toán. Bản MVP chưa xử lý giao dịch thật.</p><a href="#store" className="primary-button">Bắt đầu mua sắm <span>↗</span></a></div><div className="banner-symbol">GH<span>✦</span></div></section>

      <footer><a className="brand footer-brand" href="#"><span className="brand-mark">G</span><span>GAME<span className="brand-accent">HUB</span><small>GAME DIGITAL MARKET</small></span></a><p>© 2026 GameHub. Nền tảng độc lập, không liên kết chính thức với các nhà phát hành game.</p><span className="footer-status"><i /> MVP PREVIEW</span></footer>

      {notice && <div className="toast" role="status"><span>✦</span>{notice}<button onClick={() => setNotice("")} aria-label="Đóng thông báo">×</button></div>}

      {cartOpen && <div className="overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false); }}><aside className="drawer"><div className="drawer-head"><div><div className="eyebrow">YOUR SELECTION</div><h2>Giỏ hàng <span>({count})</span></h2></div><button className="icon-close" onClick={() => setCartOpen(false)} aria-label="Đóng">×</button></div>{cartItems.length === 0 ? <div className="empty-cart"><span>🛒</span><h3>Giỏ hàng đang trống</h3><p>Thêm sản phẩm bạn muốn mua để tiếp tục.</p><button className="primary-button" onClick={() => setCartOpen(false)}>Tiếp tục mua sắm</button></div> : <><div className="drawer-items">{cartItems.map((product) => <div className="drawer-item" key={product.id}><span className={`mini-icon ${product.tone}`}>{product.icon}</span><div className="drawer-product"><b>{product.name}</b><small>{money(product.price)}</small><div className="quantity"><button onClick={() => changeQuantity(product.id, -1)} aria-label="Giảm số lượng">−</button><span>{cart[product.id]}</span><button onClick={() => changeQuantity(product.id, 1)} aria-label="Tăng số lượng">+</button></div></div><strong>{money(product.price * cart[product.id])}</strong></div>)}</div><div className="drawer-total"><span>Tạm tính</span><strong>{money(total)}</strong></div><button className="primary-button full-button" onClick={() => { setCartOpen(false); setCheckoutOpen(true); }}>Tiếp tục thanh toán <span>→</span></button><p className="demo-note">Bản demo — chưa phát sinh giao dịch thật.</p></>}</aside></div>}

      {checkoutOpen && <div className="overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setCheckoutOpen(false); }}><section className="checkout-modal"><div className="drawer-head"><div><div className="eyebrow">CHECKOUT PREVIEW</div><h2>Thông tin đơn hàng</h2></div><button className="icon-close" onClick={() => setCheckoutOpen(false)} aria-label="Đóng">×</button></div><label className="field-label">ID nhân vật / thông tin nhận hàng<input value={playerId} onChange={(event) => setPlayerId(event.target.value)} placeholder="Nhập ID trong game, không nhập mật khẩu" /></label><div className="field-label">Phương thức thanh toán</div><div className="payment-options"><button className={payment === "bank" ? "payment-option chosen" : "payment-option"} onClick={() => setPayment("bank")}><span>▦</span><b>QR ngân hàng</b><small>Chuyển khoản qua mã QR</small></button><button className={payment === "wallet" ? "payment-option chosen" : "payment-option"} onClick={() => setPayment("wallet")}><span>◈</span><b>Ví nội bộ</b><small>Số dư ví (bản demo)</small></button></div><div className="drawer-total"><span>Tổng thanh toán</span><strong>{money(total)}</strong></div><button className="primary-button full-button" onClick={submitDemoOrder}>Xác nhận xem trước <span>→</span></button><p className="demo-note">Đơn chỉ được lưu trên trình duyệt hiện tại để xem thử. Chưa kết nối cổng thanh toán, không chuyển tiền và không có giao hàng thật. <a href="/orders">Xem đơn hàng đã lưu →</a></p></section></div>}
    </main>
  );
}
