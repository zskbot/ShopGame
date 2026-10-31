"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Bell, ChevronDown, ChevronRight, CircleHelp, Clock3, CreditCard, Gamepad2, Gift, Grid2X2, Headset, Home, Menu, MessageCircle, Search, ShieldCheck, ShoppingCart, Star, UserRound, Wallet, X, Zap } from "lucide-react";

type Game = "Liên Quân" | "Free Fire" | "PUBG Mobile";
type Product = { id: string; game: Game; name: string; subtitle: string; price: number; oldPrice?: number; sold: number; stock: number; badge?: string; symbol: string; tone: string };
type Order = { id: string; createdAt: string; playerId: string; payment: "bank" | "wallet"; total: number; items: { id: string; name: string; game: string; quantity: number; unitPrice: number }[] };

const products: Product[] = [
  { id:"lq-225", game:"Liên Quân", name:"Liên quân 225K", subtitle:"Quân Huy · Gói phổ biến", price:225000, oldPrice:250000, sold:128, stock:25, badge:"BÁN CHẠY", symbol:"⚔️", tone:"lq" },
  { id:"lq-clone", game:"Liên Quân", name:"Clone Trắng Garena", subtitle:"Tài khoản · thông tin rõ ràng", price:59000, sold:52, stock:63, symbol:"🛡️", tone:"clone" },
  { id:"lq-acc", game:"Liên Quân", name:"Acc Giấy Bùa S", subtitle:"Tài khoản · gói lựa chọn", price:79000, sold:77, stock:77, badge:"BÁN CHẠY", symbol:"🎴", tone:"gold" },
  { id:"lq-rank", game:"Liên Quân", name:"Acc Rank Cao Tốt", subtitle:"Tài khoản · xem chi tiết", price:164000, sold:164, stock:164, symbol:"🏆", tone:"rank" },
  { id:"ff-diamond", game:"Free Fire", name:"Kim cương Free Fire", subtitle:"Nạp game · giao dịch mẫu", price:50000, oldPrice:60000, sold:91, stock:40, badge:"ƯU ĐÃI", symbol:"💎", tone:"ff" },
  { id:"ff-card", game:"Free Fire", name:"Thẻ sự kiện Free Fire", subtitle:"Vật phẩm · gói cơ bản", price:79000, sold:31, stock:18, symbol:"🔥", tone:"fire" },
  { id:"pubg-uc", game:"PUBG Mobile", name:"PUBG Mobile UC", subtitle:"Nạp game · gói khởi đầu", price:59000, oldPrice:69000, sold:46, stock:30, badge:"MỚI", symbol:"🪖", tone:"pubg" },
  { id:"pubg-box", game:"PUBG Mobile", name:"Hộp vật phẩm PUBG", subtitle:"Vật phẩm · gói sự kiện", price:99000, sold:20, stock:12, symbol:"🎁", tone:"box" }
];
const games: {name:Game; icon:string; color:string}[] = [
  {name:"Liên Quân",icon:"⚔️",color:"game-lq"},
  {name:"Free Fire",icon:"🔥",color:"game-ff"},
  {name:"PUBG Mobile",icon:"🪖",color:"game-pubg"}
];
const money = (n:number) => new Intl.NumberFormat("vi-VN",{style:"currency",currency:"VND"}).format(n);
const CART_KEY="gamehub.cart.v1", ORDERS_KEY="gamehub.orders.v1";

export default function HomePage() {
  const [cart,setCart]=useState<Record<string,number>>({});
  const [ready,setReady]=useState(false);
  const [activeGame,setActiveGame]=useState<Game|"Tất cả">("Tất cả");
  const [search,setSearch]=useState("");
  const [drawer,setDrawer]=useState<"cart"|"menu"|"account"|"support"|null>(null);
  const [checkout,setCheckout]=useState(false);
  const [loginTab,setLoginTab]=useState<"login"|"register">("login");
  const [notice,setNotice]=useState("");
  const [playerId,setPlayerId]=useState("");
  const [payment,setPayment]=useState<"bank"|"wallet">("bank");
  const [faq,setFaq]=useState<number|null>(0);

  useEffect(()=>{try{const raw=localStorage.getItem(CART_KEY);if(raw){const v=JSON.parse(raw);if(v&&typeof v==="object"&&!Array.isArray(v))setCart(v);}}catch{}setReady(true);},[]);
  useEffect(()=>{if(ready){try{localStorage.setItem(CART_KEY,JSON.stringify(cart));}catch{}}},[cart,ready]);
  const visible=useMemo(()=>products.filter(p=>(activeGame==="Tất cả"||p.game===activeGame)&&(`${p.name} ${p.game} ${p.subtitle}`.toLowerCase().includes(search.toLowerCase()))),[activeGame,search]);
  const cartItems=products.filter(p=>(cart[p.id]??0)>0);
  const count=Object.values(cart).reduce((a,b)=>a+b,0);
  const total=cartItems.reduce((a,p)=>a+p.price*(cart[p.id]??0),0);
  function add(p:Product){setCart(v=>({...v,[p.id]:Math.min(99,(v[p.id]??0)+1)}));setNotice("Đã thêm "+p.name+" vào giỏ hàng.");}
  function qty(id:string,d:number){setCart(v=>{const n={...v,[id]:Math.max(0,(v[id]??0)+d)};if(!n[id])delete n[id];return n;});}
  function placeOrder(){if(!playerId.trim()){setNotice("Vui lòng nhập ID game / thông tin nhận hàng.");return;}if(!cartItems.length)return;const order:Order={id:"SG-"+Date.now().toString(36).toUpperCase(),createdAt:new Date().toISOString(),playerId:playerId.trim(),payment,total,items:cartItems.map(p=>({id:p.id,name:p.name,game:p.game,quantity:cart[p.id],unitPrice:p.price}))};try{const old=JSON.parse(localStorage.getItem(ORDERS_KEY)||"[]");localStorage.setItem(ORDERS_KEY,JSON.stringify([order,...(Array.isArray(old)?old:[])].slice(0,50)));setCart({});setCheckout(false);setDrawer(null);setNotice("Đã lưu đơn demo "+order.id+". Chưa có thanh toán hoặc giao hàng thật.");}catch{setNotice("Không thể lưu đơn trên thiết bị này.");}}
  const faqs=["Mua hàng tại ShopGame như thế nào?","Nạp tiền vào ShopGame có được khuyến mãi không?","Sau khi mua tôi xem thông tin đơn ở đâu?","Shop có hỗ trợ khi gặp lỗi giao dịch không?"];

  return <main className="shopgame">
    <div className="top-notice"><Zap size={13}/> Nạp ATM/Momo <b>+10%</b><span>·</span> Giao dịch tự động 24/7</div>
    <header className="mobile-header">
      <button className="round-icon" onClick={()=>setDrawer("menu")} aria-label="Mở menu"><Menu size={19}/></button>
      <Link href="/" className="shop-logo"><span className="logo-mark">S</span><span>Shop<span>Game</span><small>GAME STORE</small></span></Link>
      <div className="header-actions">
        <button className="round-icon" onClick={()=>setDrawer("support")} aria-label="Hỗ trợ"><Headset size={18}/></button>
        <button className="round-icon cart-head" onClick={()=>setDrawer("cart")} aria-label="Giỏ hàng"><ShoppingCart size={18}/>{count>0&&<i>{count}</i>}</button>
        <button className="round-icon" onClick={()=>setDrawer("account")} aria-label="Tài khoản"><UserRound size={18}/></button>
      </div>
    </header>
    <div className="search-wrap"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Tìm kiếm sản phẩm, game..."/><button onClick={()=>setSearch("")}>⌕</button></div>

    <section className="hero-slider">
      <div className="hero-artwork"><div className="hero-copy"><span className="hero-kicker">SHOPGAME · GAME STORE</span><h1>THẾ GIỚI<br/><em>GAME ONLINE</em></h1><p>Nạp game nhanh chóng · An toàn · Tự động 24/7</p><button onClick={()=>document.getElementById("catalog")?.scrollIntoView({behavior:"smooth"})}>MUA NGAY <ChevronRight size={15}/></button></div><div className="hero-characters"><span>⚔️</span><span>🔥</span><span>🪖</span></div><div className="hero-stamp">SHOP<br/>GAME</div></div>
      <div className="slider-dots"><i className="on"/><i/><i/></div>
    </section>

    <section className="service-grid">
      <button onClick={()=>setDrawer("support")}><span className="service-icon purple"><Clock3/></span><b>Tự động 24/24</b><small>Tốc độ nhanh</small></button>
      <button onClick={()=>setDrawer("support")}><span className="service-icon orange"><Gift/></span><b>Ưu đãi nạp tiền</b><small>ATM/Momo +10%</small></button>
      <button onClick={()=>setDrawer("support")}><span className="service-icon blue"><ShieldCheck/></span><b>Uy tín cửa hàng</b><small>Hỗ trợ tận tâm</small></button>
    </section>

    <section className="announcement-card"><div className="announcement-title"><span>📢</span><b>Thông báo</b><span className="live-pill">MỚI</span></div><p>🔥 Nạp tiền & mua acc tự động dễ dàng</p><p>💰 Nạp ATM/Momo sẽ được khuyến mãi <b>10%</b></p><p>💬 Zalo hỗ trợ: <b>0777 776 025</b></p><p>🎮 Shop cập nhật sản phẩm mỗi ngày</p><button onClick={()=>setDrawer("support")}>Liên hệ shop ngay <ChevronRight size={14}/></button></section>

    <section className="quick-game-section">
      <div className="section-title"><div><span className="section-kicker">DANH MỤC</span><h2>Kho game <em>nổi bật</em></h2></div><button onClick={()=>{setActiveGame("Tất cả");document.getElementById("catalog")?.scrollIntoView({behavior:"smooth"});}}>Xem tất cả <ChevronRight size={15}/></button></div>
      <div className="game-shortcuts">{games.map(g=><button key={g.name} className={g.color} onClick={()=>{setActiveGame(g.name);document.getElementById("catalog")?.scrollIntoView({behavior:"smooth"});}}><span>{g.icon}</span><b>{g.name}</b><small>Khám phá ngay <ChevronRight size={12}/></small></button>)}</div>
    </section>

    <section className="catalog-section" id="catalog">
      <div className="section-title"><div><span className="section-kicker">SẢN PHẨM SHOPGAME</span><h2>{activeGame==="Tất cả"?"Sản phẩm":activeGame} <em>nổi bật</em></h2></div><button onClick={()=>setActiveGame("Tất cả")}>Tất cả <ChevronRight size={15}/></button></div>
      <div className="filter-pills"><button className={activeGame==="Tất cả"?"active":""} onClick={()=>setActiveGame("Tất cả")}>Tất cả</button>{games.map(g=><button className={activeGame===g.name?"active":""} key={g.name} onClick={()=>setActiveGame(g.name)}>{g.name}</button>)}</div>
      <div className="product-grid">{visible.map(p=><article className="product-card" key={p.id}><div className={"product-image "+p.tone}><span className="product-badge">{p.badge||"SHOPGAME"}</span><span className="product-art">{p.symbol}</span><span className="product-game">{p.game}</span></div><div className="product-details"><h3>{p.name}</h3><p>{p.subtitle}</p><div className="product-stats"><span>Số tài khoản: <b>{p.stock}</b></span><span>Đã bán: <b>{p.sold}</b></span></div><div className="product-price"><div><strong>{money(p.price)}</strong>{p.oldPrice&&<del>{money(p.oldPrice)}</del>}</div><button onClick={()=>add(p)} aria-label={"Thêm "+p.name}><ShoppingCart size={16}/></button></div></div></article>)}</div>
      {visible.length===0&&<div className="no-products">Không tìm thấy sản phẩm phù hợp.</div>}
    </section>

    <section className="trust-section" id="trust"><div className="section-title"><div><span className="section-kicker">SHOPGAME CAM KẾT</span><h2>Uy tín của <em>chúng tôi</em></h2></div></div><div className="trust-video"><div className="play-button">▶</div><div><b>SHOP CÓ UY TÍN KHÔNG?</b><span>Thông tin cửa hàng & quy trình giao dịch</span></div></div><div className="trust-points"><span><ShieldCheck/> Giao dịch minh bạch</span><span><Star/> Hỗ trợ khách hàng</span><span><Clock3/> Hoạt động 24/7</span></div></section>

    <section className="faq-section"><div className="section-title"><div><span className="section-kicker">HỖ TRỢ KHÁCH HÀNG</span><h2>Câu hỏi <em>thường gặp</em></h2></div></div>{faqs.map((q,i)=><div className="faq-item" key={q}><button onClick={()=>setFaq(faq===i?null:i)}>{q}<ChevronDown className={faq===i?"rotate":""} size={17}/></button>{faq===i&&<p>ShopGame đang ở phiên bản xem trước. Bạn có thể xem sản phẩm, thêm vào giỏ và tạo đơn demo. Thanh toán và giao hàng thật sẽ được tích hợp sau khi cấu hình nhà cung cấp.</p>}</div>)}</section>

    <section className="contact-card"><div className="contact-head"><span className="contact-phone"><Headset/></span><div><small>HOTLINE HỖ TRỢ</small><b>0777.776.025</b><span>Nguyễn Huỳnh Trung Hiếu</span></div></div><div className="contact-hours"><Clock3/> <span><b>THỜI GIAN LÀM VIỆC</b>Giao dịch tự động 24/24<br/>Có người hỗ trợ trong thời gian hoạt động</span></div><button onClick={()=>setDrawer("support")}><MessageCircle size={17}/> Chat hỗ trợ ngay</button></section>

    <footer className="shop-footer"><Link href="/" className="shop-logo"><span className="logo-mark">S</span><span>Shop<span>Game</span><small>GAME STORE</small></span></Link><p>© 2026 ShopGame · Cửa hàng game độc lập. Không liên kết chính thức với nhà phát hành.</p><div><a href="#catalog">Sản phẩm</a><a href="#trust">Uy tín</a><Link href="/orders">Đơn hàng</Link></div></footer>

    <nav className="bottom-nav"><button className="selected" onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}><Home/><span>Trang chủ</span></button><button onClick={()=>setDrawer("menu")}><Grid2X2/><span>Menu</span></button><button onClick={()=>document.getElementById("trust")?.scrollIntoView({behavior:"smooth"})}><Star/><span>Uy tín</span></button><button onClick={()=>setDrawer("support")}><Wallet/><span>Nạp tiền</span></button><button onClick={()=>setDrawer("account")}><UserRound/><span>Tài khoản</span></button></nav>

    {notice&&<div className="toast-message" role="status">{notice}<button onClick={()=>setNotice("")}><X size={16}/></button></div>}
    {drawer&&<div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setDrawer(null);}}><aside className="side-panel"><div className="panel-heading"><b>{drawer==="cart"?"GIỎ HÀNG":drawer==="menu"?"DANH MỤC":drawer==="account"?"TÀI KHOẢN":"HỖ TRỢ KHÁCH HÀNG"}</b><button onClick={()=>setDrawer(null)}><X/></button></div>
      {drawer==="cart"&&<>{cartItems.length===0?<div className="panel-empty"><ShoppingCart/><b>Giỏ hàng đang trống</b><p>Chọn sản phẩm để tiếp tục.</p></div>:<><div className="cart-list">{cartItems.map(p=><div className="cart-line" key={p.id}><span>{p.symbol}</span><div><b>{p.name}</b><small>{money(p.price)}</small><div className="quantity-control"><button onClick={()=>qty(p.id,-1)}>−</button>{cart[p.id]}<button onClick={()=>qty(p.id,1)}>+</button></div></div><strong>{money(p.price*cart[p.id])}</strong></div>)}</div><div className="cart-total"><span>Tổng cộng</span><b>{money(total)}</b></div><button className="primary-wide" onClick={()=>{setDrawer(null);setCheckout(true);}}>Tiến hành thanh toán</button><p className="demo-disclaimer">Đơn hàng hiện chỉ được lưu demo trên thiết bị.</p></>}</>}
      {drawer==="menu"&&<div className="panel-links">{["Tất cả sản phẩm","Liên Quân","Free Fire","PUBG Mobile"].map((v,i)=><button key={v} onClick={()=>{setActiveGame(i===0?"Tất cả":v as Game);setDrawer(null);document.getElementById("catalog")?.scrollIntoView({behavior:"smooth"});}}>{v}<ChevronRight/></button>)}<Link href="/orders" onClick={()=>setDrawer(null)}>Lịch sử đơn hàng <ChevronRight/></Link></div>}
      {drawer==="account"&&<div className="account-form"><div className="account-tabs"><button className={loginTab==="login"?"active":""} onClick={()=>setLoginTab("login")}>Đăng nhập</button><button className={loginTab==="register"?"active":""} onClick={()=>setLoginTab("register")}>Đăng ký</button></div><label>Tên đăng nhập<input placeholder="Nhập tên đăng nhập"/></label>{loginTab==="register"&&<label>Email<input type="email" placeholder="Nhập email"/></label>}<label>Mật khẩu<input type="password" placeholder="Nhập mật khẩu"/></label><button className="primary-wide" onClick={()=>setNotice("Đăng nhập sẽ hoạt động sau khi cấu hình OAuth và cơ sở dữ liệu.")}>{loginTab==="login"?"Đăng nhập":"Tạo tài khoản"}</button><div className="social-login"><span>Hoặc đăng nhập bằng</span><button onClick={()=>setNotice("Google OAuth chưa được cấu hình.")}>Google</button><button onClick={()=>setNotice("GitHub OAuth chưa được cấu hình.")}>GitHub</button></div><small className="demo-disclaimer">Kết nối Auth.js đang chờ cấu hình thông tin OAuth và Neon.</small></div>}
      {drawer==="support"&&<div className="support-panel"><div className="support-number"><Headset/><small>HOTLINE 24/7</small><b>0777.776.025</b></div><p>Đội ngũ ShopGame hỗ trợ các câu hỏi về sản phẩm, nạp tiền và đơn hàng.</p><button className="primary-wide" onClick={()=>setNotice("Kênh Zalo hỗ trợ sẽ được liên kết khi có URL chính thức.")}><MessageCircle/> Liên hệ Zalo</button><div className="support-row"><CircleHelp/> Hướng dẫn mua hàng <ChevronRight/></div><div className="support-row"><CreditCard/> Hướng dẫn nạp tiền <ChevronRight/></div></div>}
    </aside></div>}
    {checkout&&<div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setCheckout(false);}}><section className="checkout-panel"><div className="panel-heading"><b>THANH TOÁN ĐƠN HÀNG</b><button onClick={()=>setCheckout(false)}><X/></button></div><label>ID game / thông tin nhận hàng<input value={playerId} onChange={e=>setPlayerId(e.target.value)} placeholder="Nhập ID nhân vật"/></label><div className="payment-choices"><button className={payment==="bank"?"active":""} onClick={()=>setPayment("bank")}>QR ngân hàng</button><button className={payment==="wallet"?"active":""} onClick={()=>setPayment("wallet")}>Ví nội bộ</button></div><div className="cart-total"><span>Tổng thanh toán xem trước</span><b>{money(total)}</b></div><button className="primary-wide" onClick={placeOrder}>Tạo đơn demo</button><p className="demo-disclaimer">Chưa có cổng thanh toán thật. Không chuyển tiền theo màn hình demo này.</p></section></div>}
  </main>;
}
