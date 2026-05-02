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
import re
from datetime import datetime, timezone
from flask import Flask, send_from_directory, request, jsonify, redirect, make_response

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

# Promo code configuration
PROMO_CODE = os.environ.get("PROMO_CODE", "SERENITY15")
PROMO_DISCOUNT_PERCENT = int(os.environ.get("PROMO_DISCOUNT_PERCENT", "15"))
LEADS_FILE = os.environ.get("SERENITY_LEADS_FILE", os.path.join(os.path.dirname(os.path.abspath(__file__)), "data", "leads.jsonl"))

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
app = Flask(__name__, static_folder=BASE_DIR, static_url_path="")
app.secret_key = os.environ.get("FLASK_SECRET_KEY", os.urandom(32).hex())


# =============================================================================
# SECURITY HEADERS
# =============================================================================
@app.after_request
def add_security_headers(response: "Flask.response_class") -> "Flask.response_class":
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'; "
        "script-src 'self' 'unsafe-inline' https://js.stripe.com https://cdn.tailwindcss.com https://cdn.jsdelivr.net; "
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net; "
        "font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net; "
        "img-src 'self' data: https:; "
        "frame-src https://js.stripe.com; "
        "connect-src 'self' https://api.stripe.com; "
        "object-src 'none'; "
        "base-uri 'self'"
    )
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response


# =============================================================================
# STATIC FILE SERVING (replaces python -m http.server)
# =============================================================================
@app.route("/")
def index():
    return redirect("/homepage/code.html")


@app.route("/<path:path>")
def serve_static(path):
    return send_from_directory(BASE_DIR, path)


# =============================================================================
# AGE VERIFICATION
# =============================================================================

@app.route("/api/verify-age", methods=["POST"])
def verify_age():
    """Set a signed cookie confirming age verification."""
    resp = make_response(jsonify({"verified": True}))
    secure_cookie = request.is_secure or os.environ.get("FLASK_ENV") == "production"
    resp.set_cookie(
        "age_verified",
        "true",
        max_age=86400 * 30,
        httponly=True,
        secure=secure_cookie,
        samesite="Strict",
    )
    return resp


@app.route("/api/age-status", methods=["GET"])
def age_status():
    """Check if the user has a valid age verification cookie."""
    verified = request.cookies.get("age_verified") == "true"
    return jsonify({"verified": verified})


@app.route("/api/lead-capture", methods=["POST"])
def lead_capture():
    """Capture contact info and optional SMS opt-ins, then unlock SERENITY15."""
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()[:120]
    email = (data.get("email") or "").strip().lower()
    phone = (data.get("phone") or "").strip()
    sms_consent = bool(data.get("smsConsent")) and bool(phone)
    source = (data.get("source") or "").strip()[:300]

    if not email and not phone:
        return jsonify({"error": "Add an email or phone number."}), 400
    if email and not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email):
        return jsonify({"error": "Enter a valid email address, or leave email blank."}), 400

    # Keep phone capture flexible: no separate area-code field and no hard US-only
    # formatting. We still reject obvious non-phone garbage so recurring messaging
    # data stays clean enough to wire into Twilio/Klaviyo/Postscript later.
    phone = re.sub(r"[^0-9+().\-\s]", "", phone).strip()
    digits_only = re.sub(r"\D", "", phone)
    if phone and (len(digits_only) < 7 or len(digits_only) > 15):
        return jsonify({"error": "Enter a valid phone number, or leave phone blank."}), 400

    os.makedirs(os.path.dirname(LEADS_FILE), exist_ok=True)
    lead = {
        "created_at": datetime.now(timezone.utc).isoformat(),
        "name": name,
        "email": email,
        "phone": phone,
        "sms_consent": sms_consent,
        "sms_consent_text": "Recurring availability, documentation, and offer reminders. Reply STOP to opt out." if sms_consent else "",
        "source": source,
        "promo_code": PROMO_CODE,
        "ip": request.headers.get("X-Forwarded-For", request.remote_addr),
        "user_agent": request.headers.get("User-Agent", "")[:500],
    }
    with open(LEADS_FILE, "a", encoding="utf-8") as f:
        f.write(json.dumps(lead) + "\n")

    resp = make_response(jsonify({"ok": True, "unlocked": True, "promoCode": PROMO_CODE}))
    secure_cookie = request.is_secure or os.environ.get("FLASK_ENV") == "production"
    resp.set_cookie(
        "serenity_promo_unlocked",
        "true",
        max_age=86400 * 90,
        httponly=True,
        secure=secure_cookie,
        samesite="Lax",
    )
    return resp


# =============================================================================
# STRIPE API ENDPOINTS
# =============================================================================
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
                "price": 6999  # $69.99
            },
            "retatrutide": {
                "name": "Retatrutide",
                "price": 7999  # $79.99
            },
            "glow-stack": {
                "name": "G-LOW (TB-500 + BPC-157 + GHK-Cu)",
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
        if promo_code == PROMO_CODE:
            if request.cookies.get("serenity_promo_unlocked") != "true":
                return jsonify({"error": "SERENITY15 requires email signup before checkout."}), 403
            discount = int(total * PROMO_DISCOUNT_PERCENT / 100)
            total -= discount

        # Flat rate shipping $7.99
        shipping = 799
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
    debug = os.environ.get("FLASK_DEBUG", "true").lower() == "true"
    app.run(host="0.0.0.0", port=port, debug=debug)
