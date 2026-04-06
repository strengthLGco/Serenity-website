"""
Serenity Research Labs - Flask Server with Stripe Payment Processing
====================================================================
Replace your basic Python HTTP server with this to handle real payments.

SETUP:
1. pip install flask stripe
2. Create a Stripe account at https://stripe.com
3. Get your API keys from https://dashboard.stripe.com/apikeys
4. Replace the placeholder keys below with your real keys
5. Run: python server.py
"""

import os
import json
from flask import Flask, send_from_directory, request, jsonify, redirect

try:
    import stripe
except ImportError:
    print("\n⚠️  Stripe not installed. Run: pip install stripe\n")
    raise

# =============================================================================
# 🔑 STRIPE API KEYS — REPLACE THESE WITH YOUR REAL KEYS
# =============================================================================
# Test keys (start with sk_test_ and pk_test_) for development
# Live keys (start with sk_live_ and pk_live_) for production
#
# Get yours at: https://dashboard.stripe.com/apikeys
# =============================================================================
stripe.api_key = os.environ.get("STRIPE_SECRET_KEY", "sk_test_REPLACE_WITH_YOUR_SECRET_KEY")
STRIPE_PUBLISHABLE_KEY = os.environ.get("STRIPE_PUBLISHABLE_KEY", "pk_test_REPLACE_WITH_YOUR_PUBLISHABLE_KEY")
STRIPE_WEBHOOK_SECRET = os.environ.get("STRIPE_WEBHOOK_SECRET", "whsec_REPLACE_WITH_YOUR_WEBHOOK_SECRET")

# Your domain — update this when you deploy
YOUR_DOMAIN = os.environ.get("DOMAIN", "http://localhost:8080")

app = Flask(__name__, static_folder=".", static_url_path="")


# =============================================================================
# STATIC FILE SERVING (replaces python -m http.server)
# =============================================================================
@app.route("/")
def index():
    return redirect("/homepage/code.html")


@app.route("/<path:path>")
def serve_static(path):
    return send_from_directory(".", path)


# =============================================================================
# STRIPE API ENDPOINTS
# =============================================================================

@app.route("/api/config", methods=["GET"])
def get_config():
    """Send publishable key to frontend so Stripe.js can initialize."""
    return jsonify({
        "publishableKey": STRIPE_PUBLISHABLE_KEY
    })


@app.route("/api/create-payment-intent", methods=["POST"])
def create_payment_intent():
    """
    Create a Stripe PaymentIntent for the order.
    The frontend sends cart data, we calculate the total server-side
    (NEVER trust client-side totals) and create the intent.
    """
    try:
        data = request.get_json()

        # -----------------------------------------------------------
        # PRODUCT CATALOG — define your real prices here (in cents)
        # This ensures customers can't manipulate prices client-side
        # -----------------------------------------------------------
        PRODUCTS = {
            "gym-stack": {
                "name": "The Gym Stack (BPC-157 + TB-500 + CJC/Ipa)",
                "price": 11999  # $119.99
            },
            "bac-water": {
                "name": "Bacteriostatic Water 30ml",
                "price": 999  # $9.99
            },
            "bpc-157": {
                "name": "BPC-157",
                "price": 4499  # $44.99
            },
            "tb-500": {
                "name": "TB-500",
                "price": 4999  # $49.99
            },
            "cjc-ipa": {
                "name": "CJC-1295 / Ipamorelin",
                "price": 5499  # $54.99
            },
            "ghk-cu": {
                "name": "GHK-Cu",
                "price": 3999  # $39.99
            },
            "mt2": {
                "name": "Melanotan II",
                "price": 3499  # $34.99
            },
            "igf1-lr3": {
                "name": "IGF-1 LR3",
                "price": 5999  # $59.99
            },
            "retatrutide": {
                "name": "Retatrutide",
                "price": 6500  # $65.00
            },
            "glow-stack": {
                "name": "The Glow Stack",
                "price": 8999  # $89.99
            },
        }

        # Calculate total from cart items (server-side validation)
        items = data.get("items", [])
        total = 0
        line_items_description = []

        for item in items:
            product_id = item.get("id")
            quantity = item.get("quantity", 1)

            if product_id not in PRODUCTS:
                return jsonify({"error": f"Unknown product: {product_id}"}), 400

            product = PRODUCTS[product_id]
            total += product["price"] * quantity
            line_items_description.append(f"{product['name']} x{quantity}")

        if total == 0:
            return jsonify({"error": "Cart is empty"}), 400

        # Apply promo code if provided
        promo_code = data.get("promoCode", "").strip().upper()
        discount = 0
        if promo_code == "SERENITY15":
            discount = int(total * 0.15)
            total -= discount

        # Free shipping on orders $100+ (10000 cents), otherwise $7.99
        shipping = 0 if (total >= 10000) else 799
        total += shipping

        # Minimum charge is $0.50 (Stripe requirement)
        if total < 50:
            return jsonify({"error": "Order total too low"}), 400

        # Create the PaymentIntent
        intent = stripe.PaymentIntent.create(
            amount=total,
            currency="usd",
            # Enable all the payment methods you want
            automatic_payment_methods={"enabled": True},
            metadata={
                "items": json.dumps(line_items_description),
                "promo_code": promo_code,
                "discount_cents": str(discount),
                "shipping_cents": str(shipping),
            },
            # Shipping info from the form
            shipping={
                "name": data.get("name", ""),
                "address": {
                    "line1": data.get("address", ""),
                    "city": data.get("city", ""),
                    "state": data.get("state", ""),
                    "postal_code": data.get("zip", ""),
                    "country": "US",
                },
            } if data.get("name") else None,
            receipt_email=data.get("email") if data.get("email") else None,
            description="Serenity Research Labs Order",
        )

        return jsonify({
            "clientSecret": intent.client_secret,
            "total": total,
            "discount": discount,
            "shipping": shipping,
        })

    except stripe.error.StripeError as e:
        return jsonify({"error": str(e.user_message or e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/payment-status/<payment_intent_id>", methods=["GET"])
def payment_status(payment_intent_id):
    """Check the status of a payment (used by the success page)."""
    try:
        intent = stripe.PaymentIntent.retrieve(payment_intent_id)
        return jsonify({
            "status": intent.status,
            "amount": intent.amount,
            "receipt_email": intent.receipt_email,
        })
    except stripe.error.StripeError as e:
        return jsonify({"error": str(e.user_message or e)}), 400


@app.route("/api/webhook", methods=["POST"])
def stripe_webhook():
    """
    Handle Stripe webhooks for payment confirmations.
    Set this up at: https://dashboard.stripe.com/webhooks
    Endpoint URL: https://yourdomain.com/api/webhook
    Events to listen for: payment_intent.succeeded, payment_intent.payment_failed
    """
    payload = request.data
    sig_header = request.headers.get("Stripe-Signature")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
        return "Invalid payload", 400
    except stripe.error.SignatureVerificationError:
        return "Invalid signature", 400

    # Handle the event
    if event["type"] == "payment_intent.succeeded":
        payment_intent = event["data"]["object"]
        print(f"✅ Payment succeeded: ${payment_intent['amount'] / 100:.2f}")
        print(f"   Email: {payment_intent.get('receipt_email', 'N/A')}")
        print(f"   Items: {payment_intent['metadata'].get('items', 'N/A')}")
        # TODO: Send confirmation email, update inventory, etc.

    elif event["type"] == "payment_intent.payment_failed":
        payment_intent = event["data"]["object"]
        print(f"❌ Payment failed: {payment_intent.get('last_payment_error', {}).get('message', 'Unknown error')}")

    return jsonify({"received": True})


# =============================================================================
# RUN SERVER
# =============================================================================
if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("  SERENITY RESEARCH LABS — Payment Server")
    print("=" * 60)

    if "REPLACE" in stripe.api_key:
        print("\n⚠️  WARNING: Using placeholder Stripe keys!")
        print("   The checkout will NOT process real payments.")
        print("   Get your keys at: https://dashboard.stripe.com/apikeys")
        print("   Then update server.py or set environment variables:\n")
        print("   export STRIPE_SECRET_KEY=sk_test_your_key_here")
        print("   export STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here\n")

    print(f"\n🌐 Server running at: {YOUR_DOMAIN}")
    print(f"   Homepage: {YOUR_DOMAIN}/homepage/code.html")
    print(f"   Checkout: {YOUR_DOMAIN}/checkout/code.html")
    print("\n   Press Ctrl+C to stop.\n")

    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port, debug=True)
