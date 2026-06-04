from flask import Blueprint, jsonify, request
from models import get_all_products, get_product_by_id

products_bp = Blueprint("products", __name__)


@products_bp.route("/api/products", methods=["GET"])
def list_products():
    category = request.args.get("category", "").strip() or None
    products = get_all_products(category)
    return jsonify(products)


@products_bp.route("/api/products/<int:product_id>", methods=["GET"])
def get_product(product_id):
    product = get_product_by_id(product_id)
    if not product:
        return jsonify({"error": "Product not found"}), 404
    return jsonify(product)
