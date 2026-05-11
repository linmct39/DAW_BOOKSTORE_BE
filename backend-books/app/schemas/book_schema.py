from pydantic import BaseModel, Field

from app.schemas.category_schema import CategoryOut


class BookBase(BaseModel):
    title: str = Field(..., max_length=200)
    author: str | None = Field(default=None, max_length=120)
    description: str | None = None
    price: float = Field(..., ge=0)
    category_id: int


class BookCreate(BookBase):
    pass


class BookUpdate(BaseModel):
    title: str | None = Field(default=None, max_length=200)
    author: str | None = Field(default=None, max_length=120)
    description: str | None = None
    price: float | None = Field(default=None, ge=0)
    category_id: int | None = None


class BookOut(BookBase):
    id: int
    category: CategoryOut

    class Config:
        from_attributes = True
