# fiat-rails/compliance-engine/main.py
from flask import Flask, request, jsonify
import os
import hashlib
from datetime import datetime

app = Flask(__name__)

# In-memory screening results (use Redis/DB in production)
screenings = {}

# OFAC SDN list placeholder (load from CSV in production)
SANCTIONED_ADDRESSES = set()

@app.route('/health')
def health():
 return jsonify({"status": "ok", "service": "compliance-engine", "port": 4025})

@app.route('/screen', methods=['POST'])
def screen():
 """Screen a transaction for compliance"""
 data = request.get_json()
 payment_id = data.get('payment_id')
 sender = data.get('sender', {})
 amount = data.get('amount', 0)
 currency = data.get('currency', 'USD')
 wire_ref = data.get('wire_ref', '')
 
 print(f"[Compliance] Screening payment {payment_id}: {amount} {currency}")
 
 # 1. Amount threshold check (CTR for $10K+)
 if amount >= 10000:
 print(f"[Compliance] CTR triggered for {amount} {currency}")
 
 # 2. Sanctions screening (simplified)
 sender_name = sender.get('name', '').upper()
 sender_country = sender.get('country', '').upper()
 
 # Check against OFAC (placeholder logic)
 sanctioned_countries = {'IR', 'KP', 'SY', 'CU', 'RU'} # Simplified
 if sender_country in sanctioned_countries:
 result = {
 "approved": False,
 "reason": f"Sanctions match: {sender_country}",
 "screening_id": hashlib.sha256(payment_id.encode()).hexdigest()[:16],
 "timestamp": datetime.utcnow().isoformat()
 }
 screenings[payment_id] = result
 return jsonify(result), 422
 
 # 3. Velocity check (simplified)
 # In production: check transaction history per user
 
 result = {
 "approved": True,
 "screening_id": hashlib.sha256(payment_id.encode()).hexdigest()[:16],
 "checks_passed": [
 "sanctions_screening",
 "amount_threshold",
 "velocity_check"
 ],
 "timestamp": datetime.utcnow().isoformat()
 }
 
 screenings[payment_id] = result
 print(f"[Compliance] Payment {payment_id} approved")
 return jsonify(result)

@app.route('/screening/<payment_id>')
def get_screening(payment_id):
 if payment_id in screenings:
 return jsonify(screenings[payment_id])
 return jsonify({"error": "Screening not found"}), 404

if __name__ == '__main__':
 port = int(os.environ.get('PORT', 4025))
 app.run(host='0.0.0.0', port=port)
