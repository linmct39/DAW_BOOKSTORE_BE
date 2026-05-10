# # DAW_BOOKSTORE - Development Branch

Đây là branch `dev` dùng cho quá trình phát triển chính của dự án.

## Branch Structure

- `main` : Production stable
- `dev`: Development branch
- `feature/*`: Feature branches

## Workflow

Tạo branch mới từ `dev`

```bash
git checkout dev
git pull origin dev
git checkout -b feature/feature-name