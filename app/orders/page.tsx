"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type OrderItem = {
  id: string;
  name: string;
  game: string;
  quantity: number;
  unitPrice: number;
};

type StoredOrder = {
  id: string;
  createdAt: string;
  playerId: string;
  payment: "bank" | "wallet";
  total: number;
  items: OrderItem[];
};

const ORDERS_STORAGE_KEY = "gamehub.orders.v1";
const money = (value: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);

function isStoredOrder(value: unknown): value is StoredOrder {
  if (!value || typeof value !== "object") return false;
  const order = value as Partial<StoredOrder>;
  return typeof order.id === "string" &&
    typeof order.createdAt === "string" &&
    typeof order.playerId === "string" &&
    (order.payment === "bank" || order.payment === "wallet") &&
    typeof order.total === "number" &&
    Array.isArray(order.items);
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(ORDERS_STORAGE_KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      setOrders(Array.isArray(parsed) ? parsed.filter(isStoredOrder).slice(0, 50) : []);
    } catch {
      setOrders([]);
    } finally {
      setReady(true);
    }
  }, []);

  return (
    <main className="orders-page">
      <header className="orders-header">
        <Link className="brand" href="/">
          <span className="brand-mark">G</span>
          <span>GAME<span className="brand-accent">HUB</span><small>GAME DIGITAL MARKET</small></span>
        </Link>
        <Link className="orders-back" href="/">← Quay lại cửa hàng</Link>
      </header>

      <section className="orders-content">
        <div className="eyebrow"><span /> CUSTOMER AREA</div>
        <h1>Đơn hàng <em>của bạn</em></h1>
        <p className="orders-intro">Lịch sử đơn demo được lưu cục bộ trên trình duyệt và thiết bị hiện tại.</p>

        <div className="orders-notice">
          <strong>Chế độ xem trước</strong>
          <p>Đây không phải hệ thống đơn hàng trực tuyến. Dữ liệu không đồng bộ giữa thiết bị, không được gửi lên máy chủ và không xác nhận thanh toán hay giao hàng.</p>
        </div>

        {!ready ? (
          <div className="orders-empty">Đang tải lịch sử đơn hàng…</div>
        ) : orders.length === 0 ? (
          <div className="orders-empty">
            <span>▤</span>
            <h2>Chưa có đơn hàng nào</h2>
            <p>Đơn demo bạn tạo tại bước thanh toán sẽ xuất hiện ở đây trên thiết bị này.</p>
            <Link className="primary-button" href="/">Khám phá cửa hàng <span>↗</span></Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <article className="order-card" key={order.id}>
                <div className="order-card-head">
                  <div>
                    <span className="order-label">MÃ ĐƠN</span>
                    <h2>{order.id}</h2>
                    <time dateTime={order.createdAt}>{new Date(order.createdAt).toLocaleString("vi-VN")}</time>
                  </div>
                  <span className="order-status">DEMO · CHƯA THANH TOÁN</span>
                </div>
                <div className="order-items">
                  {order.items.map((item) => (
                    <div className="order-line" key={item.id}>
                      <div><strong>{item.name}</strong><small>{item.game} · SL: {item.quantity}</small></div>
                      <b>{money(item.unitPrice * item.quantity)}</b>
                    </div>
                  ))}
                </div>
                <div className="order-meta">
                  <span>ID nhận hàng: <b>{order.playerId}</b></span>
                  <span>Phương thức chọn: <b>{order.payment === "bank" ? "QR ngân hàng" : "Ví nội bộ"}</b></span>
                </div>
                <div className="order-total"><span>Tổng xem trước</span><strong>{money(order.total)}</strong></div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
