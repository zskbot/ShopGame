"use client";

import { useEffect, useMemo, useState } from "react";
import { Bell, ChevronDown, ChevronRight, CircleHelp, Gamepad2, Grid3X3, Home, Menu, MessageCircle, Package, Search, ShieldCheck, ShoppingCart, UserRound, Wallet, X, Zap } from "lucide-react";

type Game = "Tất cả" | "Liên Quân" | "Free Fire" | "PUBG Mobile";
type Product = { id: string; game: Exclude<Game, "Tất cả">; name: string; description: string; price: number; oldPrice?: number; icon: string; tone: string; tag?: string };
const products: Product[] = [
  { id: "lq-1", game: "Liên Quân", name: "Liên Quân 225K Trắng", description: "Sổ tích lũy: 26 · Đã bán: 18", price: 225000, oldPrice: 250000, icon: "⚔️", tone: "arena", tag: "BÁN CHẠY" },
  { id: "lq-2", game: "Liên Quân", name: "Liên Quân Trắng Garena", description: "Sổ tích lũy: 500 · Đã bán: 63", price: 500000, oldPrice: 550000, icon: "🛡️", tone: "knight", tag: "BÁN CHẠY" },
  { id: "ff-1", game: "Free Fire", name: "Acc Giấy Bùa S", description: "Sổ tích lũy: 77 · Đã bán: 11", price: 77000, oldPrice: 99000, icon: "🔥", tone: "fire", tag: "ƯU ĐÃI" },
  { id: "ff-2", game: "Free Fire", name: "Acc Rank Cao TTX", description: "Sổ tích lũy: 59 · Đã bán: 22", price: 59000, oldPrice: 79000, icon: "🎯", tone: "target" },
  { id: "ff-3", game: "Free Fire", name: "Túi Mì Pet Tim", description: "Sổ tích lũy: 0 · Đã bán: 1", price: 9000, icon: "💜", tone: "pet" },
  { id: "pubg-1", game: "PUBG Mobile", name: "Acc Tốc Độ Vượt 500+", description: "Sổ tích lũy: 50 · Đã bán: 8", price: 25000, icon: "🎮", tone: "pubg" },
  { id: "lq-3", game: "Liên Quân", name: "Túi Mì Trải Nghiệm", description: "Sổ tích lũy: 320 · Đã bán: 15", price: 32000, icon: "🎁", tone: "gift" },
  { id: "lq-4", game: "Liên Quân", name: "Túi Mì Trải Nghiệm V2", description: "Sổ tích lũy: 137 · Đã bán: 9", price: 137000, icon: "💎", tone: "diamond" },
];
type Order = { id: string; createdAt: string; playerId: string; payment: "bank"; total: number; items: { id: string; name: string; game: string; quantity: number; unitPrice: number }[] };
const CART_KEY = "gamehub.cart.v1";
const ORDER_KEY = "gamehub.orders.v1";
const money = (value: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);

export default function HomePage() {
  const [game, setGame] = useState<Game>("Tất cả");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [ready, setReady] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [playerId, setPlayerId] = useState("");
  const [notice, setNotice] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          setCart(Object.fromEntries(Object.entries(parsed).filter(([id, qty]) => products.some(p => p.id === id) && Number.isInteger(qty) && Number(qty) > 0 && Number(qty) <= 99)) as Record<string, number>);
        }
      }
    } catch { setCart({}); }
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) {
      try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch { setNotice("Không thể lưu giỏ hàng trên thiết bị này."); }
    }
  }, [cart, ready]);

  const visible = useMemo(() => products.filter(p => (game === "Tất cả" || p.game === game) && `${p.name} ${p.game}`.toLowerCase().includes(query.toLowerCase())), [game, query]);
  const items = products.filter(p => (cart[p.id] ?? 0) > 0);
  const count = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const total = items.reduce((sum, p) => sum + p.price * cart[p.id], 0);
  function add(p: Product) {
    setCart(current => ({ ...current, [p.id]: Math.min(99, (current[p.id] ?? 0) + 1) }));
    setNotice(`Đã thêm ${p.name} vào giỏ hàng.`);
  }
  function quantity(id: string, delta: number) {
    setCart(current => { const next = { ...current, [id]: Math.max(0, (current[id] ?? 0) + delta) }; if (!next[id]) delete next[id]; return next; });
  }
  function placeOrder() {
    if (!playerId.trim()) { setNotice("Vui lòng nhập ID nhân vật hoặc thông tin nhận hàng."); return; }
    const order: Order = { id: "SG-" + Date.now().toString(36).toUpperCase(), createdAt: new Date().toISOString(), playerId: playerId.trim(), payment: "bank", total, items: items.map(p => ({ id: p.id, name: p.name, game: p.game, quantity: cart[p.id], unitPrice: p.price })) };
    try {
      const saved = localStorage.getItem(ORDER_KEY);
      const parsed: unknown = saved ? JSON.parse(saved) : [];
      localStorage.setItem(ORDER_KEY, JSON.stringify([order, ...(Array.isArray(parsed) ? parsed : [])].slice(0, 50)));
      setCart({}); localStorage.removeItem(CART_KEY); setCheckoutOpen(false); setCartOpen(false);
      setNotice(`Đã lưu đơn xem trước ${order.id}. Chưa có thanh toán hoặc giao hàng thật.`);
    } catch { setNotice("Không thể lưu đơn trên thiết bị này."); }
  }

  return <main className="shop-page">
    <div className="top-notice"><Zap size={13} fill="currentColor" /> SHOPGAME STORE <span>•</span> DANH MỤC GAME & DỊCH VỤ</div>
    <header className="mobile-header">
      <button className="round-icon" onClick={() => setMenuOpen(v => !v)} aria-label="Mở menu"><Menu size={19}/></button>
      <a className="shop-logo" href="#"><span>Shop</span>Game<span className="logo-dot">.</span></a>
      <div className="header-actions">
        <button className="round-icon" onClick={() => document.getElementById("product-search")?.focus()} aria-label="Tìm kiếm"><Search size={17}/></button>
        <button className="round-icon" onClick={() => setCartOpen(true)} aria-label="Giỏ hàng"><ShoppingCart size={17}/></button>
        <button className="round-icon notification" onClick={() => setNotice("Bạn chưa có thông báo mới.")} aria-label="Thông báo"><Bell size={17}/><i/></button>
        <a className="round-icon" href="/account" aria-label="Tài khoản"><UserRound size={17}/></a>
      </div>
    </header>
    {menuOpen && <nav className="mobile-menu"><a href="#home" onClick={() => setMenuOpen(false)}>Trang chủ</a><a href="#catalog" onClick={() => setMenuOpen(false)}>Cửa hàng</a><a href="/orders">Đơn hàng</a><a href="/account">Tài khoản</a></nav>}
    <div className="ticker"><span>⚡</span> Thông tin sản phẩm rõ ràng <span>•</span> Hỗ trợ khách hàng</div>

    <section className="hero-wrap" id="home">
      <div className="hero-banner">
        <div className="hero-shade"/>
        <div className="hero-copy"><span className="hero-kicker">SHOPGAME STORE</span><h1>THẾ GIỚI<br/><em>GAME ONLINE</em></h1><p>Nạp game • Tài khoản • Vật phẩm</p><a href="#catalog">KHÁM PHÁ NGAY <ChevronRight size={15}/></a></div>
        <div className="hero-artwork"><span className="hero-orb">✦</span><span className="hero-sword">⚔</span><span className="hero-fire">🔥</span></div>
        <span className="hero-pagination">01 <i/> 03</span>
      </div>
      <div className="quick-links"><a href="#catalog"><span className="quick-icon cyan"><Wallet/></span><b>Nạp tiền</b></a><a href="#catalog"><span className="quick-icon violet"><Gamepad2/></span><b>Mua acc</b></a><a href="#trust"><span className="quick-icon orange"><ShieldCheck/></span><b>Uy tín</b></a><a href="#support"><span className="quick-icon blue"><CircleHelp/></span><b>Hỗ trợ</b></a></div>
    </section>

    <section className="service-notes">
      <article><span className="service-icon green"><ShieldCheck size={20}/></span><div><b>Hỗ trợ khách hàng ShopGame</b><small>Tiếp nhận câu hỏi và hỗ trợ đơn hàng</small></div><span className="service-arrow">›</span></article>
      <article><span className="service-icon purple"><Wallet size={20}/></span><div><b>Thông tin hỗ trợ</b><small>Lịch hỗ trợ chính thức sẽ được cập nhật tại đây</small></div><span className="service-arrow">›</span></article>
      <article><span className="service-icon orange"><Package size={20}/></span><div><b>Thông tin sản phẩm</b><small>Vui lòng xác nhận giá và tình trạng trước khi giao dịch</small></div><span className="service-arrow">›</span></article>
    </section>

    <section className="catalog-section" id="catalog">
      <div className="section-title"><div><span className="section-kicker">SHOPGAME MARKET</span><h2>Kho acc <em>{game === "Tất cả" ? "game" : game}</em></h2></div><a href="#catalog">Xem tất cả <ChevronRight size={14}/></a></div>
      <div className="game-tabs">{(["Tất cả","Liên Quân","Free Fire","PUBG Mobile"] as Game[]).map(g => <button key={g} className={game === g ? "active" : ""} onClick={() => setGame(g)}>{g}</button>)}</div>
      <label className="catalog-search"><Search size={16}/><input id="product-search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Tìm kiếm sản phẩm..."/><span>/</span></label>
      <div className="product-grid">{visible.map((p) => <article className="game-product" key={p.id}>
        <div className={`product-cover ${p.tone}`}><span className="cover-pattern"/><span className="cover-game">{p.game}</span>{p.tag && <b className="sale-tag">{p.tag}</b>}<span className="cover-emoji">{p.icon}</span><span className="cover-caption">SHOPGAME · DIGITAL</span></div>
        <div className="product-body"><h3>{p.name}</h3><div className="product-stats"><span>Danh mục: <b>Tài khoản game</b></span><span>Trạng thái: <b>Sản phẩm mẫu</b></span></div><div className="product-price"><strong>{money(p.price)}</strong>{p.oldPrice && <del>{money(p.oldPrice)}</del>}</div><button className="view-product" onClick={() => add(p)}>Thêm vào giỏ <ChevronRight size={14}/></button></div>
      </article>)}</div>
      {visible.length === 0 && <div className="no-products">Không tìm thấy sản phẩm. <button onClick={() => {setQuery("");setGame("Tất cả");}}>Xóa bộ lọc</button></div>}
      <button className="load-more" onClick={() => setNotice("Bạn đang xem toàn bộ sản phẩm hiện có.")}>Xem thêm <ChevronDown size={15}/></button>
    </section>

    <section className="trust-section" id="trust"><div className="section-title"><div><span className="section-kicker">SHOPGAME COMMITMENT</span><h2>Uy tín <em>của shop</em></h2></div></div><div className="trust-video"><div className="video-thumb"><span className="play-button">▶</span><b>SHOP GAME UY TÍN KHÔNG AE?</b><small>VIDEO GIỚI THIỆU SHOPGAME</small></div><p>Cam kết thông tin rõ ràng, hỗ trợ khách hàng trong suốt quá trình đặt hàng.</p></div></section>

    <section className="support-section" id="support"><div className="section-title"><div><span className="section-kicker">HELP CENTER</span><h2>Câu hỏi <em>thường gặp</em></h2></div></div>{["Mua acc game tại ShopGame có tự động không?","Nạp tiền vào ShopGame có được khuyến mãi không?","Sau khi mua tôi xem lại thông tin ở đâu?","Shop có hỗ trợ nếu gặp vấn đề không?"].map((q)=><details className="faq" key={q}><summary>{q}<ChevronDown size={16}/></summary><p>ShopGame đang ở phiên bản xem trước. Vui lòng liên hệ hỗ trợ để được hướng dẫn; không gửi mật khẩu tài khoản game.</p></details>)}</section>

    <section className="hotline-card"><div className="hotline-heading"><span>☎</span><div><small>HỖ TRỢ SHOPGAME</small><strong>Hỗ trợ khách hàng</strong><small>Tiếp nhận yêu cầu hỗ trợ</small></div></div><div className="hotline-row"><span>◷</span><div><b>Lịch hỗ trợ</b><small>Đang cập nhật thông tin chính thức</small></div></div><a href="#support">Liên hệ hỗ trợ <ChevronRight size={14}/></a></section>

    <footer className="shop-footer"><a className="shop-logo" href="#">ShopGame<span className="logo-dot">.</span></a><p>© 2026 ShopGame. Nền tảng độc lập, không liên kết chính thức với nhà phát hành game.</p><div className="footer-social">f　◎　𝕏　▶</div></footer>

    <nav className="bottom-nav"><a className="selected" href="#home"><Home/><span>Home</span></a><a href="#catalog"><Grid3X3/><span>Menu</span></a><a href="#trust"><ShieldCheck/><span>Uy tín</span></a><a href="#catalog"><Wallet/><span>Nạp tiền</span></a><a href="/account"><UserRound/><span>Tài khoản</span></a></nav>
    <button className="chat-fab" onClick={() => setChatOpen(v => !v)} aria-label="Chat hỗ trợ"><MessageCircle size={24}/></button>
    {chatOpen && <div className="chat-popover"><div><b>ShopGame hỗ trợ</b><button onClick={() => setChatOpen(false)}><X size={15}/></button></div><p>Xin chào! Bạn cần hỗ trợ về sản phẩm hoặc đơn hàng?</p><a href="#support">Xem câu hỏi thường gặp <ChevronRight size={14}/></a></div>}
    <button className="back-top" onClick={() => window.scrollTo({top:0,behavior:"smooth"})}>↑</button>

    {notice && <div className="notice-toast" role="status">{notice}<button onClick={() => setNotice("")}><X size={16}/></button></div>}
    {cartOpen && <div className="modal-backdrop" onMouseDown={e => {if(e.target===e.currentTarget)setCartOpen(false);}}><aside className="cart-drawer"><div className="drawer-title"><div><small>SHOPGAME</small><h2>Giỏ hàng ({count})</h2></div><button onClick={() => setCartOpen(false)}><X/></button></div>{items.length===0?<div className="cart-empty"><ShoppingCart size={36}/><b>Giỏ hàng đang trống</b><p>Chọn sản phẩm để thêm vào giỏ.</p></div>:<><div className="cart-lines">{items.map(p=><div className="cart-line" key={p.id}><span>{p.icon}</span><div><b>{p.name}</b><small>{money(p.price)}</small><div className="qty-controls"><button onClick={()=>quantity(p.id,-1)}>−</button>{cart[p.id]}<button onClick={()=>quantity(p.id,1)}>+</button></div></div><strong>{money(p.price*cart[p.id])}</strong></div>)}</div><div className="cart-total"><span>Tổng cộng</span><b>{money(total)}</b></div><button className="checkout-button" onClick={()=>{setCartOpen(false);setCheckoutOpen(true);}}>Tiếp tục đặt hàng</button><p className="demo-disclaimer">Bản xem trước: chưa thu tiền hoặc giao hàng thật.</p></>}</aside></div>}
    {checkoutOpen && <div className="modal-backdrop" onMouseDown={e => {if(e.target===e.currentTarget)setCheckoutOpen(false);}}><section className="checkout-box"><div className="drawer-title"><div><small>CHECKOUT PREVIEW</small><h2>Thông tin nhận hàng</h2></div><button onClick={()=>setCheckoutOpen(false)}><X/></button></div><label className="checkout-label">ID nhân vật / thông tin nhận hàng<input value={playerId} onChange={e=>setPlayerId(e.target.value)} placeholder="Không nhập mật khẩu game"/></label><div className="cart-total"><span>Tổng đơn</span><b>{money(total)}</b></div><button className="checkout-button" onClick={placeOrder}>Lưu đơn xem trước</button><p className="demo-disclaimer">Đơn chỉ lưu trên thiết bị này. Chưa tích hợp thanh toán và giao hàng thật.</p></section></div>}
  </main>;
}
