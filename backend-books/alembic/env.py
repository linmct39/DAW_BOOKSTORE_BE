import os
from logging.config import fileConfig

from alembic import context
from dotenv import load_dotenv
from sqlalchemy import create_engine, pool

from app.database.base import Base
from app.models import book, category

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

load_dotenv()

database_url = os.getenv(
    "DATABASE_URL",
    "mysql+pymysql://root:password@localhost:3306/bookstore",
)
config.set_main_option("sqlalchemy.url", database_url)

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    ssl_required = os.getenv("MYSQL_SSL_REQUIRED", "false").lower() in (
        "1",
        "true",
        "yes",
    )
    connect_args = {}
    if ssl_required:
        ssl_args = {}
        ssl_ca = os.getenv("MYSQL_SSL_CA")
        if ssl_ca:
            ssl_args["ca"] = ssl_ca
        connect_args = {"ssl": ssl_args}

    connectable = create_engine(
        database_url,
        poolclass=pool.NullPool,
        connect_args=connect_args,
    )

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
