# Serenity Research Labs — Email/SMS Retention System

## Goal
Capture qualified researcher emails after age verification, unlock `SERENITY15`, and use compliant email/SMS reminders to convert first orders and bring buyers back.

## Current implementation
- Frontend popup: `js/lead-capture.js`
- Backend endpoint: `POST /api/lead-capture`
- Local lead storage: `data/leads.jsonl` by default
- Promo gate: server only honors `SERENITY15` if the browser has the `serenity_promo_unlocked=true` cookie set by lead capture.
- Checkout UX: if `SERENITY15` is typed before signup, checkout opens the signup popup instead of applying the discount.

## Production provider options
Recommended stack:
1. **Klaviyo** for email + SMS ecommerce flows if the site moves to a real ecommerce platform or custom backend.
2. **Postscript** if SMS becomes the main retention channel.
3. **Twilio + SendGrid** if staying custom/local-first and we want full control.

## Compliance rules
- SMS must be explicit opt-in. No pre-checked box.
- Store consent timestamp, source page, phone, IP/user agent.
- Include “Reply STOP to opt out” language in signup and SMS.
- Do not message anyone who only provided email.
- Research-only positioning. Avoid medical, healing, fat-loss, anti-aging, or consumption claims.
- Add/confirm Privacy Policy language before live launch: email/SMS marketing, opt-out, data storage, carrier fees.

## Suggested signup popup offer
Headline: `Unlock 15% off your first order.`
Body: `Join the Serenity list for product availability notes, documentation updates, and researcher-only offers.`
CTA: `Unlock SERENITY15`
SMS checkbox: `I agree to receive automated SMS updates and offers from Serenity Research Labs. Consent is not required to purchase. Msg/data rates may apply. Reply STOP to opt out.`

## Flows

### Flow 1 — Welcome / first-order conversion
- Trigger: lead capture with email, optional SMS consent.
- Immediately: deliver `SERENITY15` and link to shop.
- +24 hours if no order: remind that the code is unlocked; research-only language.
- +72 hours if no order: highlight third-party testing / COA availability.
- +7 days if no order: last reminder for the first-order code.

### Flow 2 — Abandoned checkout/cart
- Trigger: cart/checkout started with email captured but no successful payment.
- +1 hour: “Your cart is still saved.”
- +24 hours: remind about documentation/testing and code if eligible.
- +48 hours: final reminder.

### Flow 3 — Post-purchase retention
- Trigger: successful order.
- Immediately: order confirmation handled by Stripe/email provider.
- +10 days: ask if docs/COA were easy to access; support link.
- +21–30 days: invite reorder/research supply restock. Avoid usage/dosing language.
- +45 days: announce new lots/testing updates or bundles.

### Flow 4 — Winback
- Trigger: no purchase in 60–90 days.
- Message: new inventory/testing docs/restock note + compliant offer.

## Example compliant messages

Email/SMS welcome:
> SERENITY15 is unlocked for 15% off your first Serenity Research Labs order. Research-use only. Shop: {{link}} Reply STOP to opt out.

Abandoned cart:
> Your Serenity cart is still saved. Use your unlocked SERENITY15 code at checkout. Research-use only, not for human consumption. {{link}} Reply STOP to opt out.

Post-purchase docs:
> Thanks for your Serenity Research Labs order. COA/testing documentation is available with each lot. Need help finding docs? {{support_link}} Reply STOP to opt out.

Winback:
> Serenity inventory/testing docs have been updated. Researcher-only offers are available here: {{link}} Research-use only. Reply STOP to opt out.

## Next production wiring
1. Pick provider: Klaviyo/Postscript or Twilio+SendGrid.
2. Replace local `data/leads.jsonl` append with provider API call.
3. Add order-success webhook from Stripe to trigger post-purchase flows.
4. Add abandoned cart capture once checkout collects email before payment intent creation.
5. Add unsubscribe/STOP handling if using Twilio directly.
