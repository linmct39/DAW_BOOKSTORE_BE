from pydantic import BaseModel, Field


class CategoryBase(BaseModel):
    name: str = Field(..., max_length=100)
    description: str | None = Field(default=None, max_length=255)


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: str | None = Field(default=None, max_length=100)
    description: str | None = Field(default=None, max_length=255)


class CategoryOut(CategoryBase):
    id: int

    class Config:
        from_attributes = True
