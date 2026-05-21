"""
Stripe Payment Integration for DONK AI TUTOR
Handles course purchases, subscriptions, and $PICK token rewards
"""

import os
import stripe
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

# Initialize Stripe
stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "")
STRIPE_PUBLISHABLE_KEY = os.getenv("STRIPE_PUBLISHABLE_KEY", "")

router = APIRouter(prefix="/payments", tags=["payments"])

class PurchaseRequest(BaseModel):
    course_id: str
    email: str
    success_url: str = "http://localhost:8090/static/success.html"
    cancel_url: str = "http://localhost:8090/static/cancel.html"

class PaymentIntentRequest(BaseModel):
    amount: int  # in cents
    currency: str = "usd"
    course_id: str
    customer_email: str

@router.get("/config")
async def get_stripe_config():
    """Get Stripe publishable key for frontend."""
    return {
        "publishableKey": STRIPE_PUBLISHABLE_KEY,
        "prices": {
            "amm-trading": 2999,  # $29.99
            "wc2026-sponsor": 9900  # $99.00
        }
    }

@router.post("/create-checkout-session")
async def create_checkout_session(request: PurchaseRequest):
    """Create Stripe Checkout Session for course purchase."""
    from main import COURSES
    
    if request.course_id not in COURSES:
        raise HTTPException(status_code=404, detail="Course not found")
    
    course = COURSES[request.course_id]
    if course["price"] == 0:
        return {"status": "free", "message": "This course is free!", "url": "/learn/crypto-basics"}
    
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[{
                "price_data": {
                    "currency": "usd",
                    "product_data": {
                        "name": course["title"],
                        "description": course["description"],
                        "images": ["https://troptions.unykorn.org/logo.png"]
                    },
                    "unit_amount": int(course["price"] * 100)
                },
                "quantity": 1
            }],
            mode="payment",
            success_url=request.success_url + "?session_id={CHECKOUT_SESSION_ID}",
            cancel_url=request.cancel_url,
            customer_email=request.email,
            metadata={
                "course_id": request.course_id,
                "course_name": course["title"],
                "pick_reward": int(course["price"] * 10)  # 10 $PICK per $1
            }
        )
        
        return {
            "sessionId": session.id,
            "url": session.url,
            "amount": course["price"],
            "pick_reward": int(course["price"] * 10)
        }
    
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/create-payment-intent")
async def create_payment_intent(request: PaymentIntentRequest):
    """Create PaymentIntent for custom payment flows."""
    try:
        intent = stripe.PaymentIntent.create(
            amount=request.amount,
            currency=request.currency,
            receipt_email=request.customer_email,
            metadata={
                "course_id": request.course_id,
                "integration_check": "accept_a_payment"
            }
        )
        return {"clientSecret": intent.client_secret}
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/webhook")
async def stripe_webhook(request: Request):
    """Handle Stripe webhooks for payment confirmations."""
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, os.getenv("STRIPE_WEBHOOK_SECRET", "")
        )
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")
    
    # Handle successful payment
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        course_id = session.get("metadata", {}).get("course_id")
        customer_email = session.get("customer_email")
        
        # TODO: Grant course access, send $PICK tokens, send email
        print(f"Payment complete: {course_id} for {customer_email}")
        
        return {
            "status": "success",
            "course_id": course_id,
            "customer": customer_email,
            "amount_paid": session.get("amount_total", 0) / 100,
            "pick_reward": session.get("metadata", {}).get("pick_reward", 0)
        }
    
    return {"status": "received"}

@router.get("/verify/{session_id}")
async def verify_payment(session_id: str):
    """Verify a completed payment session."""
    try:
        session = stripe.checkout.Session.retrieve(session_id)
        return {
            "status": session.payment_status,
            "customer": session.customer_email,
            "amount": session.amount_total / 100,
            "course_id": session.metadata.get("course_id")
        }
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))
