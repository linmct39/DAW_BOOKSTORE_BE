# Backend Books (FastAPI)

## Setup

1. Create a MySQL database named `bookstore`.
2. Update `DATABASE_URL` in `.env`.
3. Create and activate a virtual environment.
4. Install dependencies.

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

## Migrations (Alembic)

```bash
alembic upgrade head
```

## Seed data

```bash
python scripts/seed.py
```

## Run

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

## Endpoints

- `GET /books` (query: `q`, `category_id`, `category_name`, `skip`, `limit`)
- `POST /books`
- `GET /books/{id}`
- `PUT /books/{id}`
- `DELETE /books/{id}`
- `GET /categories` (query: `q`, `skip`, `limit`)
- `POST /categories`
- `GET /categories/{id}`
- `PUT /categories/{id}`
- `DELETE /categories/{id}`
