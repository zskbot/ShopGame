# CineWave — trạng thái xác thực

CineWave hiện hoạt động theo chế độ khám phá công khai, không yêu cầu tài khoản.

## Thay đổi trong ứng dụng
- Đã gỡ các liên kết Đăng nhập, Đăng ký và Tài khoản khỏi giao diện.
- Đã gỡ các trang đăng nhập, đăng ký và tài khoản.
- Đã gỡ API đăng ký và API Auth.js.
- Đã gỡ Auth.js, Neon Auth adapter và mã xử lý mật khẩu khỏi ứng dụng.
- Không còn yêu cầu `AUTH_SECRET`, GitHub OAuth hoặc Google OAuth.

## Dữ liệu hiện có
Các bảng và bản ghi xác thực cũ trong cơ sở dữ liệu không bị xóa hoặc sửa đổi. Migration xác thực mật khẩu chưa áp dụng trước đây đã được loại khỏi mã nguồn triển khai. Không chạy migration xóa bảng hoặc xóa người dùng.

## Cấu hình
`DATABASE_URL` và `DATABASE_URL_UNPOOLED` chỉ còn là biến tùy chọn cho các chức năng máy chủ/health check khác nếu được sử dụng. Không cần cấu hình chúng để duyệt thư viện phim mẫu.

## Giới hạn hiện tại
- Danh sách phim yêu thích đang lưu cục bộ trên trình duyệt.
- Chưa có đồng bộ danh sách yêu thích giữa thiết bị.
- Chưa có hồ sơ người dùng, đăng nhập, đăng ký hoặc đăng xuất.
