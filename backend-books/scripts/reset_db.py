import os
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy.engine import make_url
import pymysql

load_dotenv()

SQL_ROOT = Path(__file__).resolve().parents[2] / "shared" / "database"


def _connect():
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        raise RuntimeError("DATABASE_URL is not set")

    url = make_url(database_url)
    ssl_required = os.getenv("MYSQL_SSL_REQUIRED", "false").lower() in (
        "1",
        "true",
        "yes",
    )
    ssl_args = None
    if ssl_required:
        ssl_args = {}
        ssl_ca = os.getenv("MYSQL_SSL_CA")
        if ssl_ca:
            ssl_args["ca"] = ssl_ca

    return pymysql.connect(
        host=url.host,
        user=url.username,
        password=url.password,
        port=url.port or 3306,
        database=url.database,
        ssl=ssl_args,
        autocommit=True,
        charset="utf8mb4",
    )


def _execute_sql_file(connection, path):
    sql = Path(path).read_text(encoding="utf-8")
    statements = [stmt.strip() for stmt in sql.split(";") if stmt.strip()]
    with connection.cursor() as cursor:
        for statement in statements:
            cursor.execute(statement)


def main():
    schema_path = SQL_ROOT / "schema.sql"
    seed_path = SQL_ROOT / "seed.sql"

    if not schema_path.exists():
        raise RuntimeError(f"Schema file not found: {schema_path}")

    if not seed_path.exists():
        raise RuntimeError(f"Seed file not found: {seed_path}")

    connection = _connect()
    try:
        _execute_sql_file(connection, schema_path)
        _execute_sql_file(connection, seed_path)
    finally:
        connection.close()


if __name__ == "__main__":
    main()
