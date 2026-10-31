"use client";

import { useMemo, useState } from "react";
import { ArrowRight, BadgeCheck, ChevronDown, Gamepad2, Headphones, Menu, Search, ShieldCheck, ShoppingBag, Sparkles, X, Zap } from "lucide-react";

type Category = "Tất cả" | "Liên Quân" | "Free Fire" | "PUBG Mobile";
type Product = { id: number; name: string; game: Exclude<Category, "Tất cả">; type: string; price: number; oldPrice?: number; tag?: string; icon: string; tone: string; description: string };

const products: Product[] = [
  { id: 1, name: "Gói Quân Huy  Quà tặng", game: "Liên Quân", type: "Nạp game", price: 49000, oldPrice: 59000, tag: "Phổ biến", icon: "💎", tone: "violet", description: "Gói Quân Huy dành cho tài khoản Liên Quân Mobile." },
  { id: 2, name: "Gói Quân Huy  Cao cấp", game: "Liên Quân", type: "Nạp game", price: 99000, icon: "👑", tone: "gold", description: "Gói nạp cao cấp, xử lý sau khi xác nhận thanh toán." },
  { id: 3, name: "Kim cương Free Fire", game: "Free Fire", type: "Nạp game", price: 25000, oldPrice: 30000, tag: "Giá tốt", icon: "💠", tone: "blue", description: "Kim cương cho Free Fire. Chọn gói phù hợp trước khi đặt." },
  { id: 4, name: "Thẻ vô cực Free Fire", game: "Free Fire", type: "Vật phẩm", price: 79000, icon: "🔥", tone: "orange", description: "Dịch vụ hỗ trợ mua thẻ theo mùa, tùy tình trạng phát hành." },
  { id: 5, name: "PUBG Mobile UC", game: "PUBG Mobile", type: "Nạp game", price: 55000, oldPrice: 65000, tag: "Bán chạy", icon: "🎯", tone: "yellow", description: "UC cho PUBG Mobile. Kiểm tra khu vực máy chủ trước khi đặt." },
  { id: 6, name: "Gói UC chiến binh", game: "PUBG Mobile", type: "Nạp game", price: 109000, icon: "🪖", tone: "green", description: "Gói UC dành cho người chơi PUBG Mobile." },
  { id: 7, name: "Tư vấn hồ sơ game", game: "Liên Quân", type: "Dịch vụ", price: 30000, icon: "🛡️", tone: "pink", description: "Tư vấn bảo mật và tối ưu hồ sơ; không yêu cầu mật khẩu." },
  { id: 8, name: "Tư vấn setup PUBG", game: "PUBG Mobile", type: "Dịch vụ", price: 35000, icon: "⚡", tone: "cyan", description: "Tư vấn thiết lập điều khiển và độ nhạy theo thiết bị." }
];

const money = (value: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(value);

export default function Home() {
  const [category, setCategory] = useState<Category>("Tất cả");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [customer, setCustomer] = useState({ name: "", contact: "", playerId: "", note: "" });
  const [notice, setNotice] = useState("");

  const visibleProducts = useMemo(() => products.filter((p) => (category === "Tất cả" || p.game === category) && (p.name.toLowerCase().includes(query.toLowerCase()) || p.game.toLowerCase().includes(query.toLowerCase()))), [category, query]);
  const count = Object.values(cart).reduce((sum, n) => sum + n, 0);
  const total = products.reduce((sum, p) => sum + p.price * (cart[p.id] || 0), 0);
  const add = (id: number) => { setCart((old) => ({ ...old, [id]: (old[id] || 0) + 1 })); setNotice("Đã thêm sản phẩm vào giỏ hàng."); window.setTimeout(() => setNotice(""), 2200); };
  const categories: Category[] = ["Tất cả", "Liên Quân", "Free Fire", "PUBG Mobile"];

  function submitOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!customer.name.trim() || !customer.contact.trim()) return;
    const order = { code: "VGS-" + Date.now().toString().slice(-7), customer, items: products.filter(p => cart[p.id]).map(p => ({ name: p.name, quantity: cart[p.id], price: p.price })), total, status: "Chờ xác nhận — bản MVP demo" };
    const previous = JSON.parse(localStorage.getItem("velclaw-demo-orders") || "[]");
    localStorage.setItem("velclaw-demo-orders", JSON.stringify([order, ...previous]));
    setCart({});
    setCheckoutOpen(false);
    setCartOpen(false);
    setNotice("Đã tạo đơn demo " + order.code + ". Chưa có giao dịch tiền thật.");
    window.setTimeout(() => setNotice(""), 5000);
  }

  return (
    <main>
      <div className="announcement"><Sparkles size={13}/> Ưu đãi khai trương · Giao dịch minh bạch, hỗ trợ mỗi ngày <span>Chi tiết <ArrowRight size={12}/></span></div>
      <header className="header">
        <a className="brand" href="#"><span className="brand-mark"><Gamepad2 size={22}/></span><span>VELCLAW<span className="brand-light"> GAME SHOP</span></span></a>
        <nav className={mobileOpen ? "nav nav-open" : "nav"}>
          <a href="#games" onClick={() => setMobileOpen(false)}>Danh mục</a><a href="#products" onClick={() => setMobileOpen(false)}>Cửa hàng</a><a href="#how" onClick={() => setMobileOpen(false)}>Hướng dẫn</a>
        </nav>
        <div className="header-actions">
          <button className="icon-btn search-toggle" aria-label="Tìm kiếm" onClick={() => document.getElementById("search")?.focus()}><Search size={19}/></button>
          <button className="cart-btn" onClick={() => setCartOpen(true)}><ShoppingBag size={17}/> <span>Giỏ hàng</span><b>{count}</b></button>
          <button className="icon-btn mobile-menu" aria-label="Mở menu" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X/> : <Menu/>}</button>
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="pulse"/> DIGITAL GAME STORE <span className="eyebrow-line"/></div>
          <h1>Nâng cấp cuộc chơi.<br/><em>Chạm đỉnh</em> đam mê.</h1>
          <p>Điểm đến cho game thủ Liên Quân, Free Fire và PUBG Mobile. Chọn dịch vụ phù hợp, đặt hàng nhanh và theo dõi trạng thái rõ ràng.</p>
          <div className="hero-actions"><a className="primary-btn" href="#products">Khám phá cửa hàng <ArrowRight size={17}/></a><a className="text-link" href="#how">Cách thức hoạt động <span>↗</span></a></div>
          <div className="hero-proof"><div className="proof-avatars"><span>🎮</span><span>⚔️</span><span>🔥</span></div><div><b>Game thủ là ưu tiên</b><small>Hỗ trợ đơn hàng minh bạch</small></div><div className="proof-divider"/><div><b>3 tựa game</b><small>Một điểm đến</small></div></div>
        </div>
        <div className="hero-art"><div className="art-glow"/><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="hero-card card-top"><span>✦</span><div><small>GAME ON</small><b>READY PLAYER</b></div></div><div className="hero-emblem"><Gamepad2 size={78} strokeWidth={1.2}/><span>LEVEL UP</span></div><div className="hero-card card-bottom"><Zap size={17}/><div><small>YOUR NEXT</small><b>VICTORY STARTS HERE</b></div></div><div className="float-chip chip-one">⚔️ <span>Liên Quân</span></div><div className="float-chip chip-two">🔥 <span>Free Fire</span></div><div className="float-chip chip-three">🎯 <span>PUBG Mobile</span></div></div>
      </section>

      <section className="trust-strip"><div><ShieldCheck/><span><b>Minh bạch</b><small>Thông tin đơn rõ ràng</small></span></div><div><Zap/><span><b>Tiện lợi</b><small>Đặt hàng nhanh chóng</small></span></div><div><Headphones/><span><b>Hỗ trợ</b><small>Đồng hành cùng game thủ</small></span></div><div><BadgeCheck/><span><b>An toàn</b><small>Không thu thập mật khẩu game</small></span></div></section>

      <section className="section games-section" id="games"><div className="section-heading"><div><div className="eyebrow">CHỌN CHIẾN TRƯỜNG</div><h2>Game bạn đang chơi?</h2></div><p>Chọn tựa game để khám phá<br/>các sản phẩm và dịch vụ.</p></div><div className="game-grid">
        <button className="game-tile lienquan" onClick={() => {setCategory("Liên Quân"); document.getElementById("products")?.scrollIntoView({behavior:"smooth"});}}><div className="game-symbol">⚔️</div><div><small>MOBILE MOBA</small><h3>Liên Quân</h3><span>Khám phá sản phẩm <ArrowRight size={14}/></span></div><b className="tile-number">01</b></button>
        <button className="game-tile freefire" onClick={() => {setCategory("Free Fire"); document.getElementById("products")?.scrollIntoView({behavior:"smooth"});}}><div className="game-symbol">🔥</div><div><small>BATTLE ROYALE</small><h3>Free Fire</h3><span>Khám phá sản phẩm <ArrowRight size={14}/></span></div><b className="tile-number">02</b></button>
        <button className="game-tile pubg" onClick={() => {setCategory("PUBG Mobile"); document.getElementById("products")?.scrollIntoView({behavior:"smooth"});}}><div className="game-symbol">🎯</div><div><small>BATTLE ROYALE</small><h3>PUBG Mobile</h3><span>Khám phá sản phẩm <ArrowRight size={14}/></span></div><b className="tile-number">03</b></button>
      </div></section>

      <section className="section products-section" id="products"><div className="section-heading"><div><div className="eyebrow">THE PLAYER'S CHOICE</div><h2>Sản phẩm nổi bật<span className="accent-dot">.</span></h2></div><div className="product-tools"><div className="search-box"><Search size={16}/><input id="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Tìm sản phẩm..."/></div></div></div>
        <div className="filters">{categories.map(c => <button key={c} className={category === c ? "filter active" : "filter"} onClick={() => setCategory(c)}>{c}</button>)}</div>
        <div className="product-grid">{visibleProducts.map(p => <article className="product-card" key={p.id}><div className={"product-visual "+p.tone}><span className="product-tag">{p.tag || p.type}</span><span className="product-emoji">{p.icon}</span><span className="visual-game">{p.game}</span></div><div className="product-info"><div className="product-meta"><span>{p.game}</span><span>{p.type}</span></div><h3>{p.name}</h3><p>{p.description}</p><div className="product-bottom"><div><b>{money(p.price)}</b>{p.oldPrice && <del>{money(p.oldPrice)}</del>}</div><button aria-label={"Thêm "+p.name+" vào giỏ"} onClick={() => add(p.id)}><ShoppingBag size={16}/></button></div></div></article>)}</div>
        {visibleProducts.length === 0 && <div className="empty-state">Không tìm thấy sản phẩm phù hợp.</div>}
      </section>

      <section className="how-section" id="how"><div className="section"><div className="section-heading"><div><div className="eyebrow">ĐƠN GIẢN TRONG 3 BƯỚC</div><h2>Mua sắm dễ dàng.</h2></div><p>Quy trình rõ ràng, chủ động<br/>theo dõi từng bước.</p></div><div className="steps"><div><span>01</span><h3>Chọn sản phẩm</h3><p>Tìm tựa game và dịch vụ bạn cần.</p></div><div><span>02</span><h3>Gửi thông tin</h3><p>Nhập thông tin liên hệ và Player ID khi cần.</p></div><div><span>03</span><h3>Xác nhận đơn</h3><p>Đội ngũ xác nhận và cập nhật trạng thái đơn.</p></div></div></div></section>

      <footer><a className="brand" href="#"><span className="brand-mark"><Gamepad2 size={20}/></span><span>VELCLAW<span className="brand-light"> GAME SHOP</span></span></a><p>© 2026 VelClaw Game Shop. Nền tảng cửa hàng game độc lập.</p><span className="footer-note">Không liên kết hoặc được bảo trợ bởi các nhà phát hành game.</span></footer>

      {notice && <div className="toast">{notice}</div>}
      {cartOpen && <div className="overlay" onMouseDown={e => {if(e.target === e.currentTarget) setCartOpen(false);}}><aside className="drawer"><div className="drawer-head"><div><small>YOUR SELECTION</small><h2>Giỏ hàng <span>({count})</span></h2></div><button className="icon-btn" onClick={() => setCartOpen(false)}><X/></button></div>{count === 0 ? <div className="drawer-empty"><ShoppingBag size={35}/><h3>Giỏ hàng đang trống</h3><p>Khám phá sản phẩm và thêm vào giỏ nhé.</p><button className="primary-btn" onClick={() => setCartOpen(false)}>Tiếp tục mua sắm</button></div> : <><div className="cart-items">{products.filter(p => cart[p.id]).map(p => <div className="cart-item" key={p.id}><span>{p.icon}</span><div><b>{p.name}</b><small>{money(p.price)}</small><div className="quantity"><button onClick={() => setCart(old => ({...old,[p.id]:Math.max(0,(old[p.id]||0)-1)}))}>−</button><span>{cart[p.id]}</span><button onClick={() => add(p.id)}>+</button></div></div><strong>{money(p.price * cart[p.id])}</strong></div>)}</div><div className="drawer-total"><span>Tạm tính</span><b>{money(total)}</b><button className="primary-btn full" onClick={() => {setCartOpen(false);setCheckoutOpen(true);}}>Tiến hành đặt hàng <ArrowRight size={16}/></button><small>Chưa phát sinh thanh toán ở bước này.</small></div></>}</aside></div>}
      {checkoutOpen && <div className="overlay" onMouseDown={e => {if(e.target === e.currentTarget) setCheckoutOpen(false);}}><div className="checkout-modal"><div className="drawer-head"><div><small>ORDER DETAILS</small><h2>Thông tin đặt hàng</h2></div><button className="icon-btn" onClick={() => setCheckoutOpen(false)}><X/></button></div><form onSubmit={submitOrder}><label>Họ và tên<input required value={customer.name} onChange={e => setCustomer({...customer,name:e.target.value})} placeholder="Tên người nhận"/></label><label>Email hoặc số điện thoại<input required value={customer.contact} onChange={e => setCustomer({...customer,contact:e.target.value})} placeholder="Thông tin liên hệ"/></label><label>Player ID / UID (nếu cần)<input value={customer.playerId} onChange={e => setCustomer({...customer,playerId:e.target.value})} placeholder="Không cung cấp mật khẩu"/></label><label>Ghi chú<textarea value={customer.note} onChange={e => setCustomer({...customer,note:e.target.value})} placeholder="Máy chủ, khu vực hoặc yêu cầu khác"/></label><div className="checkout-total"><span>Tổng đơn hàng</span><b>{money(total)}</b></div><div className="demo-warning">Bản MVP: tạo đơn thử nghiệm, chưa kết nối ngân hàng, QR hoặc cổng thanh toán thật. Không chuyển tiền vào tài khoản chưa được xác minh.</div><button className="primary-btn full" type="submit">Tạo đơn hàng demo <ArrowRight size={16}/></button></form></div></div>}
    </main>
  );
}
