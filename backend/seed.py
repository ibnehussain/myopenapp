"""Run this once to populate the database with sample products."""
from database import init_db, get_db

PRODUCTS = [
    # Electronics
    {
        "name": "Wireless Noise-Cancelling Headphones",
        "description": "Premium over-ear headphones with active noise cancellation, 30-hour battery life, and foldable design for travel.",
        "price": 79.99,
        "image_url": "https://picsum.photos/seed/headphones/400/300",
        "category": "Electronics",
        "stock": 50,
    },
    {
        "name": "Mechanical Keyboard",
        "description": "Compact TKL mechanical keyboard with blue switches, RGB backlighting, and USB-C connectivity.",
        "price": 54.99,
        "image_url": "https://picsum.photos/seed/keyboard/400/300",
        "category": "Electronics",
        "stock": 35,
    },
    {
        "name": "USB-C Hub 7-in-1",
        "description": "Multiport adapter with HDMI 4K, 3x USB-A, SD card reader, and 100W PD charging pass-through.",
        "price": 34.99,
        "image_url": "https://picsum.photos/seed/usbhub/400/300",
        "category": "Electronics",
        "stock": 80,
    },
    {
        "name": "Portable Bluetooth Speaker",
        "description": "Waterproof IPX7 speaker with 360° sound, 12-hour battery, and built-in microphone for calls.",
        "price": 49.99,
        "image_url": "https://picsum.photos/seed/speaker/400/300",
        "category": "Electronics",
        "stock": 60,
    },
    # Clothing
    {
        "name": "Classic Crewneck Sweatshirt",
        "description": "Heavyweight 100% cotton fleece sweatshirt. Pre-shrunk, ribbed cuffs and waistband. Available in S–XL.",
        "price": 34.99,
        "image_url": "https://picsum.photos/seed/sweatshirt/400/300",
        "category": "Clothing",
        "stock": 120,
    },
    {
        "name": "Slim-Fit Chino Pants",
        "description": "Stretch cotton blend chinos with a modern slim fit. Wrinkle-resistant and machine washable.",
        "price": 44.99,
        "image_url": "https://picsum.photos/seed/chinos/400/300",
        "category": "Clothing",
        "stock": 90,
    },
    {
        "name": "Lightweight Running Jacket",
        "description": "Wind and water resistant running jacket with reflective details, two zip pockets, and packable hood.",
        "price": 64.99,
        "image_url": "https://picsum.photos/seed/jacket/400/300",
        "category": "Clothing",
        "stock": 45,
    },
    # Books
    {
        "name": "Clean Code",
        "description": "A handbook of agile software craftsmanship by Robert C. Martin. Essential reading for every developer.",
        "price": 29.99,
        "image_url": "https://picsum.photos/seed/cleancode/400/300",
        "category": "Books",
        "stock": 200,
    },
    {
        "name": "The Pragmatic Programmer",
        "description": "20th anniversary edition. Timeless advice on software craftsmanship, career development, and best practices.",
        "price": 27.99,
        "image_url": "https://picsum.photos/seed/pragmatic/400/300",
        "category": "Books",
        "stock": 150,
    },
    {
        "name": "Designing Data-Intensive Applications",
        "description": "The big ideas behind reliable, scalable, and maintainable systems by Martin Kleppmann.",
        "price": 39.99,
        "image_url": "https://picsum.photos/seed/ddia/400/300",
        "category": "Books",
        "stock": 75,
    },
]


if __name__ == "__main__":
    init_db()
    conn = get_db()
    existing = conn.execute("SELECT COUNT(*) FROM products").fetchone()[0]
    if existing > 0:
        print(f"Database already has {existing} products — skipping seed.")
    else:
        conn.executemany(
            """INSERT INTO products (name, description, price, image_url, category, stock)
               VALUES (:name, :description, :price, :image_url, :category, :stock)""",
            PRODUCTS,
        )
        conn.commit()
        print(f"Seeded {len(PRODUCTS)} products successfully.")
    conn.close()
