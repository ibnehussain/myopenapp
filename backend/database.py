import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "shop.db")


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db():
    conn = get_db()
    cursor = conn.cursor()

    cursor.executescript("""
        CREATE TABLE IF NOT EXISTS products (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            name        TEXT    NOT NULL,
            description TEXT    NOT NULL,
            price       REAL    NOT NULL,
            image_url   TEXT    NOT NULL,
            category    TEXT    NOT NULL,
            stock       INTEGER NOT NULL DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS orders (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_name   TEXT    NOT NULL,
            customer_email  TEXT    NOT NULL,
            address         TEXT    NOT NULL,
            total           REAL    NOT NULL,
            status          TEXT    NOT NULL DEFAULT 'pending',
            created_at      TEXT    NOT NULL DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS order_items (
            id                  INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id            INTEGER NOT NULL REFERENCES orders(id),
            product_id          INTEGER NOT NULL REFERENCES products(id),
            quantity            INTEGER NOT NULL,
            price_at_purchase   REAL    NOT NULL
        );
    """)

    conn.commit()
    conn.close()
