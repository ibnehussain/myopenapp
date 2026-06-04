from database import get_db


def get_all_products(category=None):
    conn = get_db()
    if category:
        rows = conn.execute(
            "SELECT * FROM products WHERE category = ? ORDER BY id", (category,)
        ).fetchall()
    else:
        rows = conn.execute("SELECT * FROM products ORDER BY id").fetchall()
    conn.close()
    return [dict(r) for r in rows]


def get_product_by_id(product_id):
    conn = get_db()
    row = conn.execute(
        "SELECT * FROM products WHERE id = ?", (product_id,)
    ).fetchone()
    conn.close()
    return dict(row) if row else None


def create_order(customer_name, customer_email, address, items):
    """
    items: list of dicts with keys product_id, quantity, price_at_purchase
    Returns the new order dict including its generated id.
    """
    conn = get_db()
    try:
        total = sum(i["quantity"] * i["price_at_purchase"] for i in items)

        cursor = conn.execute(
            """INSERT INTO orders (customer_name, customer_email, address, total)
               VALUES (?, ?, ?, ?)""",
            (customer_name, customer_email, address, total),
        )
        order_id = cursor.lastrowid

        conn.executemany(
            """INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
               VALUES (?, ?, ?, ?)""",
            [
                (order_id, i["product_id"], i["quantity"], i["price_at_purchase"])
                for i in items
            ],
        )

        conn.commit()

        order = conn.execute(
            "SELECT * FROM orders WHERE id = ?", (order_id,)
        ).fetchone()
        return dict(order)
    finally:
        conn.close()


def get_order_by_id(order_id):
    conn = get_db()
    order = conn.execute(
        "SELECT * FROM orders WHERE id = ?", (order_id,)
    ).fetchone()
    if not order:
        conn.close()
        return None

    items = conn.execute(
        """SELECT oi.quantity, oi.price_at_purchase,
                  p.id AS product_id, p.name, p.image_url
           FROM order_items oi
           JOIN products p ON p.id = oi.product_id
           WHERE oi.order_id = ?""",
        (order_id,),
    ).fetchall()
    conn.close()

    result = dict(order)
    result["items"] = [dict(i) for i in items]
    return result
