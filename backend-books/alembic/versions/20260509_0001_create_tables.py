"""create tables

Revision ID: 20260509_0001
Revises: 
Create Date: 2026-05-09 00:01:00

"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "20260509_0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "categories",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("description", sa.String(length=255), nullable=True),
    )
    op.create_index("ix_categories_id", "categories", ["id"])
    op.create_index("ix_categories_name", "categories", ["name"], unique=True)

    op.create_table(
        "books",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("title", sa.String(length=200), nullable=False),
        sa.Column("author", sa.String(length=120), nullable=True),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("price", sa.Numeric(10, 2), nullable=False),
        sa.Column("category_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(["category_id"], ["categories.id"], ondelete="CASCADE"),
    )
    op.create_index("ix_books_id", "books", ["id"])
    op.create_index("ix_books_title", "books", ["title"])
    op.create_index("ix_books_category_id", "books", ["category_id"])


def downgrade() -> None:
    op.drop_index("ix_books_category_id", table_name="books")
    op.drop_index("ix_books_title", table_name="books")
    op.drop_index("ix_books_id", table_name="books")
    op.drop_table("books")

    op.drop_index("ix_categories_name", table_name="categories")
    op.drop_index("ix_categories_id", table_name="categories")
    op.drop_table("categories")
