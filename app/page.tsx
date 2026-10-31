"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Bookmark, Check, ChevronDown, Clapperboard, Clock3, Film, Menu, Play, Search, ShieldCheck, Sparkles, X } from "lucide-react";

type Movie = {
  id: string;
  title: string;
  year: number;
  genre: string;
  duration: string;
  rating: string;
  description: string;
  tone: string;
  featured?: boolean;
};

const movies: Movie[] = [
  { id: "starfall", title: "Hành Trình Sao Rơi", year: 2026, genre: "Khoa học viễn tưởng", duration: "2 giờ 08 phút", rating: "T13", description: "Một tín hiệu bí ẩn ngoài rìa thiên hà mở ra hành trình khám phá giới hạn cuối cùng của con người.", tone: "cosmos", featured: true },
  { id: "night-city", title: "Thành Phố Sau Nửa Đêm", year: 2025, genre: "Tâm lý · Giật gân", duration: "1 giờ 52 phút", rating: "T16", description: "Một phóng viên lần theo những manh mối kỳ lạ trong thành phố không bao giờ ngủ.", tone: "noir" },
  { id: "last-land", title: "Vùng Đất Cuối Cùng", year: 2026, genre: "Phiêu lưu", duration: "2 giờ 01 phút", rating: "T13", description: "Nhóm thám hiểm tìm kiếm vùng đất chưa từng xuất hiện trên bất kỳ tấm bản đồ nào.", tone: "island" },
  { id: "red-line", title: "Đường Ranh Đỏ", year: 2024, genre: "Hành động", duration: "1 giờ 46 phút", rating: "T18", description: "Một quyết định trong vài giây có thể thay đổi số phận của cả thành phố.", tone: "ember" },
  { id: "blue-hour", title: "Khoảnh Khắc Xanh", year: 2025, genre: "Chính kịch", duration: "1 giờ 39 phút", rating: "K", description: "Cuộc gặp tình cờ đưa hai người xa lạ trở lại với những điều quan trọng nhất.", tone: "blue" },
  { id: "little-orbit", title: "Vệ Tinh Nhỏ", year: 2026, genre: "Hoạt hình", duration: "1 giờ 28 phút", rating: "P", description: "Một chuyến phiêu lưu ấm áp qua những hành tinh đầy màu sắc.", tone: "orbit" },
  { id: "deep-signal", title: "Tín Hiệu Vực Sâu", year: 2025, genre: "Bí ẩn", duration: "1 giờ 57 phút", rating: "T16", description: "Một đội nghiên cứu đại dương nhận được tín hiệu không thể giải thích từ đáy biển.", tone: "deep" },
  { id: "paper-moon", title: "Mặt Trăng Giấy", year: 2024, genre: "Tình cảm", duration: "1 giờ 44 phút", rating: "T13", description: "Một câu chuyện nhẹ nhàng về ký ức, những lời hứa và cơ hội bắt đầu lại.", tone: "moon" },
];

const categories = ["Tất cả", "Hành động", "Khoa học viễn tưởng", "Tâm lý · Giật gân", "Phiêu lưu", "Hoạt hình", "Chính kịch"];
const navItems = ["Trang chủ", "Phim mới", "Thể loại", "Danh sách"];

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Tất cả");
  const [selected, setSelected] = useState<Movie | null>(null);
  const [saved, setSaved] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const visibleMovies = useMemo(() => movies.filter((movie) => {
    const matchesCategory = category === "Tất cả" || movie.genre.toLowerCase().includes(category.toLowerCase());
    const matchesQuery = (movie.title + " " + movie.genre + " " + movie.year).toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  }), [category, query]);

  function toggleSaved(id: string) {
    setSaved((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  return (
    <main className="cinema-app">
      <div className="cinema-topline"><Sparkles size={13} /> KHÔNG GIAN ĐIỆN ẢNH CỦA BẠN <span>•</span> THƯ VIỆN ĐANG PHÁT TRIỂN</div>
      <header className="cinema-header">
        <a className="cinema-brand" href="#home" aria-label="CineWave trang chủ"><span className="brand-mark"><Clapperboard size={19} /></span><span>Cine<span>Wave</span><i>.</i></span></a>
        <nav className="cinema-nav" aria-label="Điều hướng chính">
          {navItems.map((item, index) => <a key={item} className={index === 0 ? "active" : ""} href={index === 1 ? "#new" : index === 2 ? "#genres" : "#catalog"}>{item}</a>)}
        </nav>
        <div className="cinema-actions">
          <label className="cinema-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm phim..." aria-label="Tìm phim" /></label>
          <a className="cinema-login" href="/login">Đăng nhập</a>
          <button className="cinema-menu-button" onClick={() => setMenuOpen((value) => !value)} aria-label="Mở menu">{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
      </header>
      {menuOpen && <nav className="cinema-mobile-menu"><a href="#home" onClick={() => setMenuOpen(false)}>Trang chủ</a><a href="#new" onClick={() => setMenuOpen(false)}>Phim mới</a><a href="#genres" onClick={() => setMenuOpen(false)}>Thể loại</a><a href="#catalog" onClick={() => setMenuOpen(false)}>Danh sách phim</a><a href="/login">Đăng nhập</a></nav>}

      <section className="cinema-hero" id="home">
        <div className="hero-backdrop hero-cosmos" />
        <div className="hero-grid" />
        <div className="hero-content">
          <div className="hero-eyebrow"><span className="live-dot" /> PHIM NỔI BẬT <span className="hero-divider" /> GIỚI THIỆU</div>
          <h1>Hành Trình<br /><em>Sao Rơi</em></h1>
          <div className="hero-meta"><span>2026</span><span>·</span><span>Khoa học viễn tưởng</span><span>·</span><span>2 giờ 08 phút</span><span className="age-tag">T13</span></div>
          <p>Một tín hiệu bí ẩn ngoài rìa thiên hà mở ra hành trình khám phá giới hạn cuối cùng của con người.</p>
          <div className="hero-buttons"><button className="primary-play" onClick={() => setSelected(movies[0])}><Play size={17} fill="currentColor" /> Khám phá phim</button><button className="secondary-info" onClick={() => setSelected(movies[0])}>Thông tin phim <ArrowRight size={16} /></button></div>
          <div className="hero-footnote"><ShieldCheck size={14} /> Nội dung giới thiệu mẫu · chưa cung cấp luồng phát</div>
        </div>
        <div className="hero-art"><div className="planet planet-one" /><div className="planet planet-two" /><div className="orbit orbit-one" /><div className="orbit orbit-two" /><span className="hero-star star-one">✦</span><span className="hero-star star-two">✧</span><span className="hero-art-label">CINEWAVE / ORIGINAL CONCEPT</span></div>
        <div className="hero-pagination"><span>01</span><i /><span>04</span></div>
      </section>

      <section className="cinema-benefits">
        <div><span className="benefit-icon"><Film size={18} /></span><span><b>Khám phá phim</b><small>Danh mục được tuyển chọn</small></span></div>
        <div><span className="benefit-icon"><Bookmark size={18} /></span><span><b>Lưu phim yêu thích</b><small>Danh sách lưu trên thiết bị</small></span></div>
        <div><span className="benefit-icon"><ShieldCheck size={18} /></span><span><b>Nội dung minh bạch</b><small>Chỉ phát nội dung có quyền</small></span></div>
      </section>

      <section className="cinema-section" id="new">
        <div className="cinema-section-heading"><div><span className="section-overline">CINEWAVE SELECTION</span><h2>Phim <em>được đề xuất</em></h2></div><a href="#catalog">Khám phá thư viện <ArrowRight size={15} /></a></div>
        <div className="featured-strip">
          {movies.filter((movie) => movie.featured || movie.id === "night-city" || movie.id === "last-land").map((movie) => <button className={"featured-card poster-" + movie.tone} key={movie.id} onClick={() => setSelected(movie)}><span className="featured-art"><span className="poster-symbol">{movie.id === "starfall" ? "✦" : movie.id === "night-city" ? "夜" : "⌁"}</span><span className="poster-index">CW / 0{movies.indexOf(movie) + 1}</span></span><span className="featured-info"><b>{movie.title}</b><small>{movie.year} <i>·</i> {movie.genre}</small></span></button>)}
        </div>
      </section>

      <section className="cinema-section catalog-section" id="catalog">
        <div className="cinema-section-heading"><div><span className="section-overline">EXPLORE THE LIBRARY</span><h2>Thư viện <em>điện ảnh</em></h2></div><span className="catalog-count">{visibleMovies.length} PHIM MẪU</span></div>
        <div className="genre-pills" id="genres">{categories.map((item) => <button key={item} className={category === item ? "selected" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div>
        {query && <div className="search-result">Kết quả tìm kiếm cho “{query}” <button onClick={() => setQuery("")}>Xóa <X size={13} /></button></div>}
        <div className="movie-grid">{visibleMovies.map((movie, index) => <article className="movie-card" key={movie.id}>
          <button className={"movie-poster poster-" + movie.tone} onClick={() => setSelected(movie)} aria-label={"Xem thông tin " + movie.title}>
            <span className="poster-symbol">{["✦", "夜", "⌁", "◈", "◌", "✧", "≈", "☾"][index % 8]}</span><span className="poster-brand">CINEWAVE</span><span className="poster-bottom"><span>{movie.genre}</span><b>{movie.rating}</b></span><span className="poster-hover"><Play size={22} fill="currentColor" /></span>
          </button>
          <div className="movie-card-info"><div><h3>{movie.title}</h3><p>{movie.year} <span>·</span> {movie.duration}</p></div><button className={"save-movie " + (saved.includes(movie.id) ? "is-saved" : "")} onClick={() => toggleSaved(movie.id)} aria-label={saved.includes(movie.id) ? "Bỏ lưu phim" : "Lưu phim"}>{saved.includes(movie.id) ? <Check size={16} /> : <Bookmark size={16} />}</button></div>
        </article>)}</div>
        {visibleMovies.length === 0 && <div className="empty-movies"><Film size={28} /><b>Chưa tìm thấy phim phù hợp</b><span>Thử từ khóa hoặc thể loại khác.</span><button onClick={() => { setQuery(""); setCategory("Tất cả"); }}>Đặt lại bộ lọc</button></div>}
        <p className="movie-disclaimer">Thư viện hiện sử dụng dữ liệu minh họa và artwork đồ họa tự tạo. Chưa có phim bản quyền, tập phim hoặc nguồn phát được tích hợp.</p>
      </section>

      <section className="cinema-callout"><div className="callout-icon"><Clapperboard size={23} /></div><div><span className="section-overline">YOUR NEXT WATCH</span><h2>Một thế giới phim đang chờ bạn.</h2><p>CineWave đang được xây dựng từng bước. Các tính năng xem phim sẽ chỉ mở khi nguồn nội dung hợp pháp sẵn sàng.</p></div><a href="#catalog">Khám phá phim <ArrowRight size={15} /></a></section>

      <footer className="cinema-footer"><a className="cinema-brand" href="#home"><span className="brand-mark"><Clapperboard size={18} /></span><span>Cine<span>Wave</span><i>.</i></span></a><p>© 2026 CineWave. Nền tảng khám phá điện ảnh đang trong giai đoạn phát triển.</p><div><a href="#home">Trang chủ</a><a href="#catalog">Thư viện</a><a href="/login">Tài khoản</a></div></footer>

      <nav className="cinema-bottom-nav"><a className="current" href="#home"><Film size={18} /><span>Khám phá</span></a><a href="#new"><Sparkles size={18} /><span>Phim mới</span></a><a href="#genres"><Clapperboard size={18} /><span>Thể loại</span></a><a href="/login"><Bookmark size={18} /><span>Đã lưu</span></a></nav>

      {selected && <div className="movie-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}><section className="movie-modal" role="dialog" aria-modal="true" aria-label={"Thông tin phim " + selected.title}><button className="modal-close" onClick={() => setSelected(null)} aria-label="Đóng"><X size={19} /></button><div className={"modal-art poster-" + selected.tone}><span className="poster-symbol">✦</span><span className="poster-brand">CINEWAVE / FEATURE</span></div><div className="modal-copy"><span className="section-overline">MOVIE PREVIEW</span><h2>{selected.title}</h2><div className="hero-meta"><span>{selected.year}</span><span>·</span><span>{selected.genre}</span><span>·</span><span>{selected.duration}</span><span className="age-tag">{selected.rating}</span></div><p>{selected.description}</p><div className="modal-notice"><Clock3 size={16} /> Thông tin mẫu. Trang chi tiết và trình phát sẽ được triển khai ở giai đoạn tiếp theo.</div><button className="primary-play" onClick={() => toggleSaved(selected.id)}>{saved.includes(selected.id) ? <Check size={16} /> : <Bookmark size={16} />} {saved.includes(selected.id) ? "Đã lưu vào danh sách" : "Lưu phim yêu thích"}</button></div></section></div>}
    </main>
  );
}
