from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.book import Book
from app.models.category import Category
from app.schemas.book_schema import BookCreate, BookOut, BookUpdate

router = APIRouter(prefix="/books", tags=["books"])


@router.post("/", response_model=BookOut, status_code=status.HTTP_201_CREATED)
def create_book(payload: BookCreate, db: Session = Depends(get_db)):
    category = db.query(Category).filter(Category.id == payload.category_id).first()
    if not category:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid category")

    book = Book(**payload.model_dump())
    db.add(book)
    db.commit()
    db.refresh(book)
    return book


@router.get("/", response_model=list[BookOut])
def list_books(
    skip: int = 0,
    limit: int = 50,
    q: str | None = None,
    category_id: int | None = None,
    category_name: str | None = None,
    db: Session = Depends(get_db),
):
    query = db.query(Book).join(Category)

    if q:
        like = f"%{q.lower()}%"
        query = query.filter(func.lower(Book.title).like(like))

    if category_id is not None:
        query = query.filter(Book.category_id == category_id)

    if category_name:
        like = f"%{category_name.lower()}%"
        query = query.filter(func.lower(Category.name).like(like))

    return query.offset(skip).limit(limit).all()


@router.get("/{book_id}", response_model=BookOut)
def get_book(book_id: int, db: Session = Depends(get_db)):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")
    return book


@router.put("/{book_id}", response_model=BookOut)
def update_book(book_id: int, payload: BookUpdate, db: Session = Depends(get_db)):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")

    if payload.category_id is not None:
        category = db.query(Category).filter(Category.id == payload.category_id).first()
        if not category:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid category"
            )

    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(book, key, value)

    db.commit()
    db.refresh(book)
    return book


@router.delete("/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_book(book_id: int, db: Session = Depends(get_db)):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")

    db.delete(book)
    db.commit()
    return None
