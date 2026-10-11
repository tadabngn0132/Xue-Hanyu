# Technical Specification — Xue Hanyu Frontend

**Trạng thái:** As-is — mô tả implementation hiện tại  
**Ngày chụp trạng thái:** 11/10/2026  
**Repository:** `XueHanyu`  
**Package version:** `0.0.0`  
**Commit khảo sát:** `612fb8e` — Remove speak button

## 1. Mục tiêu và phạm vi

Frontend Xue Hanyu là ứng dụng web học từ vựng tiếng Trung bằng flashcard. Người học có thể:

- Chọn một trong 12 bài hoặc học toàn bộ.
- Xem chữ Hán và pinyin ở mặt trước.
- Lật thẻ để xem nghĩa tiếng Việt, tiếng Anh và câu ví dụ.
- Chuyển tới thẻ trước/tiếp theo theo vòng lặp.
- Trộn ngẫu nhiên thứ tự thẻ.

Phiên bản hiện tại là SPA chạy độc lập. Dữ liệu được bundle trực tiếp vào ứng dụng; chưa gọi Backend, chưa có tài khoản và chưa lưu tiến độ học.

## 2. Kiến trúc

```text
Browser
  |
  v
main.jsx -> App.jsx
              |
              +-- AppHeader
              +-- StudyToolbar
              +-- StudyProgress
              +-- FlashCard
              +-- CardNavigation
              |
              +-- NEW_WORDS (src/data/words.js)
```

Ứng dụng không có router, global store hoặc data-access layer. `App.jsx` là điểm điều phối và nguồn state duy nhất.

## 3. Technology stack

| Hạng mục | Công nghệ |
|---|---|
| UI runtime | React 19.2.x, React DOM 19.2.x |
| Build tool | Vite 8.0.x |
| Ngôn ngữ | JavaScript ES Modules + JSX |
| Styling | CSS thuần |
| State | React `useState`, `useMemo` |
| Lint | ESLint 10, React Hooks, React Refresh |
| HTTP client | Chưa có |
| Routing | Chưa có |
| Test framework | Chưa có |

Các dependency dùng range `^`; patch version thực tế trong `node_modules` có thể cao hơn version tối thiểu trong `package.json`.

## 4. Cấu trúc module

| File/module | Trách nhiệm |
|---|---|
| `src/main.jsx` | Mount ứng dụng vào `#root`, bật `StrictMode` |
| `src/App.jsx` | Quản lý state và các hành vi học thẻ |
| `src/data/words.js` | Nguồn dữ liệu từ vựng tĩnh |
| `src/components/AppHeader.jsx` | Nhận diện và tiêu đề ứng dụng |
| `src/components/StudyToolbar.jsx` | Chọn bài và trộn thẻ |
| `src/components/StudyProgress.jsx` | Số thứ tự, bài và thanh tiến độ |
| `src/components/FlashCard.jsx` | Hai mặt thẻ và thao tác lật |
| `src/components/CardNavigation.jsx` | Điều hướng thẻ trước/tiếp |
| `src/App.css`, `src/index.css` | Theme, layout, animation và responsive |

## 5. State model

| State | Kiểu | Giá trị đầu | Ý nghĩa |
|---|---|---|---|
| `selectedLesson` | `string` | `'all'` | Bài đang lọc; giá trị từ `<select>` là chuỗi |
| `currentIndex` | `number` | `0` | Vị trí trong danh sách đang hiển thị |
| `isFlipped` | `boolean` | `false` | Mặt đang hiển thị của flashcard |
| `wordOrder` | `number[]` | Danh sách ID gốc | Thứ tự từ sau khi trộn |

Derived state:

- `lessons`: danh sách bài duy nhất lấy từ `NEW_WORDS`.
- `displayedWords`: dữ liệu sau lọc bài và sắp xếp theo `wordOrder`.
- `currentWord`: từ tại `currentIndex`.

## 6. Luồng nghiệp vụ

### 6.1. Chọn bài

1. Người dùng chọn `Tất cả` hoặc bài 1–12.
2. `selectedLesson` được cập nhật.
3. Vị trí quay về thẻ đầu tiên.
4. Flashcard trở về mặt trước.

### 6.2. Trộn thẻ

1. Sao chép toàn bộ `NEW_WORDS`.
2. Trộn bằng Fisher–Yates sử dụng `Math.random()`.
3. Lưu thứ tự ID mới vào `wordOrder`.
4. Quay về thẻ đầu tiên.

Khi đang lọc một bài, thứ tự của bài là phép chiếu từ thứ tự trộn toàn bộ dữ liệu.

### 6.3. Điều hướng

- `Thẻ tiếp`: tăng index; từ thẻ cuối quay về thẻ đầu.
- `Thẻ trước`: giảm index; từ thẻ đầu quay về thẻ cuối.
- Đổi thẻ luôn reset về mặt trước.

### 6.4. Lật thẻ

- Click/tap để lật.
- Khi flashcard có focus, `Enter` hoặc `Space` cũng lật thẻ.
- Mặt trước hiển thị chữ Hán và pinyin.
- Mặt sau hiển thị nghĩa tiếng Việt, tiếng Anh và ví dụ.

## 7. Data model

```ts
type Word = {
  id: number;
  word: string;
  pinyin: string;
  english: string;
  vietnamese: string;
  example: string;
  lesson: number;
};
```

Ví dụ:

```json
{
  "id": 1,
  "word": "你",
  "pinyin": "nǐ",
  "english": "you",
  "vietnamese": "bạn",
  "example": "你好！很高兴见到你。 (Hello! Nice to meet you.)",
  "lesson": 1
}
```

Thống kê dữ liệu hiện tại:

- 282 từ thuộc 12 bài.
- 282 ID duy nhất, không có ID trùng.
- Tất cả từ có đủ 7 trường bắt buộc.
- Số từ mỗi bài: B1 23, B2 14, B3 17, B4 31, B5 31, B6 25, B7 26, B8 23, B9 21, B10 18, B11 29, B12 24.
- `example` đang gộp câu tiếng Trung và bản dịch tiếng Anh trong một chuỗi.

## 8. UI, responsive và accessibility

- Layout rộng tối đa 920px; breakpoint mobile tại 640px.
- Flashcard dùng CSS 3D `rotateY`, cao 420px trên desktop và 390px trên mobile.
- `prefers-reduced-motion` được dùng để tắt transition khi người dùng yêu cầu.
- Flashcard có `role="button"`, `tabIndex`, keyboard interaction và dynamic `aria-label`.
- Thanh tiến độ có role và thuộc tính ARIA.
- Select và button có focus-visible style.
- Document hiện dùng `<html lang="en">` dù nội dung chính là tiếng Việt; nên đổi thành `vi`.

## 9. Build và vận hành

```bash
cd XueHanyu
npm install
npm run dev
```

| Script | Mục đích |
|---|---|
| `npm run dev` | Chạy Vite development server |
| `npm run build` | Build production vào `dist/` |
| `npm run preview` | Preview production build |
| `npm run lint` | Chạy ESLint |

Kết quả xác minh ngày 11/10/2026:

- Production build: **pass**, 23 modules transformed.
- JS: 236.59 kB, gzip 73.52 kB.
- CSS: 5.47 kB, gzip 2.00 kB.
- ESLint: **pass**.

## 10. Tích hợp Backend

### Trạng thái hiện tại

- Không có `fetch`, HTTP client hoặc API base URL.
- Không có loading, empty hoặc network error state.
- Vite chưa cấu hình API proxy.
- Toàn bộ dữ liệu production được import từ `src/data/words.js`.
- Backend hiện chưa cung cấp API hoạt động.

### Contract đọc dữ liệu đề xuất

Đây là target contract, không phải behavior hiện tại:

```http
GET /api/words?lesson=1
```

```json
{
  "data": [
    {
      "id": 1,
      "word": "你",
      "pinyin": "nǐ",
      "english": "you",
      "vietnamese": "bạn",
      "example": "你好！很高兴见到你。 (Hello! Nice to meet you.)",
      "lesson": 1
    }
  ],
  "meta": { "total": 23 }
}
```

Khi tích hợp, FE cần cấu hình base URL theo environment và bổ sung loading/error/empty states trước khi bỏ dữ liệu tĩnh.

## 11. Rủi ro và technical debt

1. **P1 — Phụ thuộc dữ liệu build-time:** cập nhật từ vựng bắt buộc build/deploy lại FE.
2. **P1 — Chưa tích hợp BE:** chưa có data-access abstraction hoặc xử lý network state.
3. **P2 — Không có automated test:** chưa bảo vệ các luồng lọc, trộn, lật và điều hướng.
4. **P2 — Bundle tăng theo dữ liệu:** toàn bộ từ được tải trong JS ban đầu.
5. **P3 — Sai document language:** `lang="en"` không phản ánh UI tiếng Việt.
6. **P3 — CSS không còn dùng:** `.speak-button` vẫn tồn tại sau khi tính năng phát âm bị gỡ.
7. **P3 — Accessibility mở rộng:** chưa có phím trái/phải hoặc live announcement khi đổi thẻ.

## 12. Lộ trình đề xuất

### Mốc 1 — Chuẩn hóa FE hiện tại

- Đổi document language sang `vi`.
- Xóa CSS không dùng.
- Bổ sung test cho chọn bài, lật, shuffle và navigation wrap-around.

### Mốc 2 — Tích hợp API

- Tạo API client và environment config.
- Đọc danh sách từ từ `GET /api/words`.
- Thêm loading, error, retry và empty states.
- Giữ file tĩnh chỉ làm seed/fixture hoặc loại khỏi production bundle.

### Mốc 3 — Production readiness

- Thêm CI chạy lint, test và build.
- Thêm error boundary và error monitoring.
- Chốt chiến lược cache và deployment cùng origin/reverse proxy.

## 13. Definition of Done cho tích hợp đầu tiên

- FE lấy đủ 282 từ từ API và lọc được theo bài.
- Không còn import dữ liệu production trực tiếp từ `src/data/words.js`.
- Các hành vi hiện tại không thay đổi đối với người dùng.
- Có loading, empty và error/retry state.
- Component/integration test cho các luồng chính đều pass.
- Lint, test và production build chạy tự động trong CI.

## 14. Ngoài phạm vi hiện tại

- Đăng nhập, tài khoản và phân quyền.
- Lưu hoặc đồng bộ tiến độ học.
- Spaced repetition, đánh giá nhớ/quên.
- Audio/phát âm.
- Tìm kiếm, pagination và quản trị nội dung.
- Offline/PWA và analytics học tập.

