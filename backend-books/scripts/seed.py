import os
import sys

from dotenv import load_dotenv

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from app.database.connection import SessionLocal
from app.models.book import Book
from app.models.category import Category

load_dotenv()


def get_or_create_category(db, name, description=None):
    category = db.query(Category).filter(Category.name == name).first()
    if category:
        return category

    category = Category(name=name, description=description)
    db.add(category)
    db.flush()
    return category


def seed():
    db = SessionLocal()
    try:
        categories = [
            ("Fiction", "Stories and novels"),
            ("Programming", "Software and engineering"),
            ("Business", "Management and entrepreneurship"),
        ]

        category_map = {}
        for name, description in categories:
            category_map[name] = get_or_create_category(db, name, description)

        books = [
            {
                "title": "Clean Code",
                "author": "Robert C. Martin",
                "description": "A handbook of agile software craftsmanship",
                "price": 19.99,
                "category": "Programming",
            },
            {
                "title": "The Pragmatic Programmer",
                "author": "Andrew Hunt",
                "description": "Journey to mastery in software development",
                "price": 24.50,
                "category": "Programming",
            },
            {
                "title": "The Lean Startup",
                "author": "Eric Ries",
                "description": "Innovation and entrepreneurship strategy",
                "price": 15.75,
                "category": "Business",
            },
            {
                "title": "1984",
                "author": "George Orwell",
                "description": "Dystopian classic novel",
                "price": 9.99,
                "category": "Fiction",
            },
        ]

        for item in books:
            existing = (
                db.query(Book)
                .filter(
                    Book.title == item["title"],
                    Book.category_id == category_map[item["category"]].id,
                )
                .first()
            )
            if existing:
                continue

            book = Book(
                title=item["title"],
                author=item["author"],
                description=item["description"],
                price=item["price"],
                category_id=category_map[item["category"]].id,
            )
            db.add(book)

        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    seed()
