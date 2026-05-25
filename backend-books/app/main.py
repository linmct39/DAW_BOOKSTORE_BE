from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.models import book, category
from app.routers import books, categories

app = FastAPI(title="Bookstore Books Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(books.router)
app.include_router(categories.router)


@app.get("/")
def health_check():
    return {"status": "ok"}