import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "mysql+pymysql://root:password@localhost:3306/bookstore",
)

def _build_connect_args():
    ssl_required = os.getenv("MYSQL_SSL_REQUIRED", "false").lower() in (
        "1",
        "true",
        "yes",
    )
    if not ssl_required:
        return {}

    ssl_args = {}
    ssl_ca = os.getenv("MYSQL_SSL_CA")
    if ssl_ca:
        ssl_args["ca"] = ssl_ca

    return {"ssl": ssl_args}


engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    connect_args=_build_connect_args(),
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
