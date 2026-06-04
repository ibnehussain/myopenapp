from flask import Flask
from flask_cors import CORS
from database import init_db
from routes.products import products_bp
from routes.orders import orders_bp

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

app.register_blueprint(products_bp)
app.register_blueprint(orders_bp)


@app.route("/api/health")
def health():
    return {"status": "ok"}


if __name__ == "__main__":
    init_db()
    app.run(debug=True, port=5000)
