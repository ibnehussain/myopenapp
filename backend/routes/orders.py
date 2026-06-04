from flask import Blueprint, jsonify, request
from models import create_order, get_order_by_id

orders_bp = Blueprint("orders", __name__)


@orders_bp.route("/api/orders", methods=["POST"])
def place_order():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Invalid JSON body"}), 400

    required_fields = ["customer_name", "customer_email", "address", "items"]
    missing = [f for f in required_fields if not data.get(f)]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    items = data["items"]
    if not isinstance(items, list) or len(items) == 0:
        return jsonify({"error": "Order must contain at least one item"}), 400

    for item in items:
        if not all(k in item for k in ("product_id", "quantity", "price_at_purchase")):
            return jsonify({"error": "Each item needs product_id, quantity, price_at_purchase"}), 400
        if item["quantity"] < 1:
            return jsonify({"error": "Item quantity must be at least 1"}), 400

    order = create_order(
        customer_name=data["customer_name"],
        customer_email=data["customer_email"],
        address=data["address"],
        items=items,
    )
    return jsonify(order), 201


@orders_bp.route("/api/orders/<int:order_id>", methods=["GET"])
def get_order(order_id):
    order = get_order_by_id(order_id)
    if not order:
        return jsonify({"error": "Order not found"}), 404
    return jsonify(order)
