from fastapi import FastAPI

from app.models import book, category
from app.routers import books, categories

app = FastAPI(title="Bookstore Books Service")

app.include_router(books.router)
app.include_router(categories.router)


@app.get("/")
def health_check():
    return {"status": "ok"}

