#!/usr/bin/env python3
"""
TROPTIONS Revenue Calculator v3.0
IOU Issuer Model with MSB/SWIFT/FedWire
"""

from dataclasses import dataclass
from typing import Dict

@dataclass
class RevenueModel:
    """Complete revenue model for IOU issuer"""
    
    # Inputs
    monthly_iou_volume_millions: float
    float_size_millions: float
    neobank_users: int
    baas_clients: int
    b2b_clients: int
    
    # Rates
    issuance_fee_pct: float = 0.0025  # 0.25%
    redemption_fee_pct: float = 0.0025  # 0.25%
    float_yield_gross: float = 0.04  # 4%
    float_yield_net: float = 0.02  # 2% after paying holders
    exchange_spread_pct: float = 0.001  # 0.1%
    b2b_fee_pct: float = 0.005  # 0.5%
    interchange_pct: float = 0.015  # 1.5%
    premium_subscription: float = 9.99
    baas_platform_fee: float = 10000  # $10K/month
    
    def calculate(self) -> Dict:
        """Calculate all revenue streams"""
        
        monthly_volume = self.monthly_iou_volume_millions * 1000000
        float_size = self.float_size_millions * 1000000
        
        # A. Issuance & Redemption
        issuance_revenue = monthly_volume * self.issuance_fee_pct
        redemption_revenue = monthly_volume * self.redemption_fee_pct
        total_issuance = issuance_revenue + redemption_revenue
        
        # B. Float Income
        float_revenue = float_size * self.float_yield_net / 12
        
        # C. Exchange Spread
        exchange_revenue = monthly_volume * self.exchange_spread_pct
        
        # D. B2B Payments
        b2b_volume = self.b2b_clients * 1000000  # $1M per client
        b2b_revenue = b2b_volume * self.b2b_fee_pct
        
        # E. Neobank
        avg_spend_per_user = 500  # $500/month
        total_spend = self.neobank_users * avg_spend_per_user
        interchange_revenue = total_spend * self.interchange_pct
        
        premium_users = int(self.neobank_users * 0.1)  # 10% premium
        subscription_revenue = premium_users * self.premium_subscription
        
        neobank_float = self.neobank_users * 4000  # $4K avg balance
        neobank_float_revenue = neobank_float * self.float_yield_net / 12
        
        total_neobank = interchange_revenue + subscription_revenue + neobank_float_revenue
        
        # F. BaaS
        baas_revenue = self.baas_clients * self.baas_platform_fee
        
        # Totals
        total_monthly = (total_issuance + float_revenue + exchange_revenue + 
                        b2b_revenue + total_neobank + baas_revenue)
        total_annual = total_monthly * 12
        
        return {
            'issuance_and_redemption': {
                'monthly': total_issuance,
                'annual': total_issuance * 12,
                'calculation': f'${self.monthly_iou_volume_millions}M × 0.5% = ${total_issuance:,.0f}'
            },
            'float_income': {
                'monthly': float_revenue,
                'annual': float_revenue * 12,
                'calculation': f'${self.float_size_millions}M × 2% ÷ 12 = ${float_revenue:,.0f}'
            },
            'exchange_spread': {
                'monthly': exchange_revenue,
                'annual': exchange_revenue * 12,
                'calculation': f'${self.monthly_iou_volume_millions}M × 0.1% = ${exchange_revenue:,.0f}'
            },
            'b2b_payments': {
                'monthly': b2b_revenue,
                'annual': b2b_revenue * 12,
                'calculation': f'{self.b2b_clients} clients × $1M × 0.5% = ${b2b_revenue:,.0f}'
            },
            'neobank': {
                'interchange_monthly': interchange_revenue,
                'subscriptions_monthly': subscription_revenue,
                'float_monthly': neobank_float_revenue,
                'total_monthly': total_neobank,
                'total_annual': total_neobank * 12
            },
            'baas': {
                'monthly': baas_revenue,
                'annual': baas_revenue * 12,
                'calculation': f'{self.baas_clients} clients × $10K = ${baas_revenue:,.0f}'
            },
            'total': {
                'monthly': total_monthly,
                'annual': total_annual,
                'valuation_low': total_annual * 10,  # 10x revenue
                'valuation_high': total_annual * 20  # 20x revenue
            }
        }

def print_scenario(name: str, model: RevenueModel):
    """Print a revenue scenario"""
    results = model.calculate()
    
    print(f"\n{'='*70}")
    print(f"SCENARIO: {name}")
    print(f"{'='*70}")
    
    print(f"\nInputs:")
    print(f"  IOU Volume: ${model.monthly_iou_volume_millions}M/month")
    print(f"  Float Size: ${model.float_size_millions}M")
    print(f"  Neobank Users: {model.neobank_users:,}")
    print(f"  BaaS Clients: {model.baas_clients}")
    print(f"  B2B Clients: {model.b2b_clients}")
    
    print(f"\nRevenue Breakdown:")
    print(f"  Issuance/Redemption: ${results['issuance_and_redemption']['monthly']:15,.0f}/month")
    print(f"  Float Income:        ${results['float_income']['monthly']:15,.0f}/month")
    print(f"  Exchange Spread:     ${results['exchange_spread']['monthly']:15,.0f}/month")
    print(f"  B2B Payments:        ${results['b2b_payments']['monthly']:15,.0f}/month")
    print(f"  Neobank:             ${results['neobank']['total_monthly']:15,.0f}/month")
    print(f"    - Interchange:     ${results['neobank']['interchange_monthly']:15,.0f}/month")
    print(f"    - Subscriptions:   ${results['neobank']['subscriptions_monthly']:15,.0f}/month")
    print(f"    - Float:           ${results['neobank']['float_monthly']:15,.0f}/month")
    print(f"  BaaS:                ${results['baas']['monthly']:15,.0f}/month")
    
    print(f"\n{'─'*70}")
    print(f"  TOTAL MONTHLY:       ${results['total']['monthly']:15,.0f}")
    print(f"  TOTAL ANNUAL:        ${results['total']['annual']:15,.0f}")
    print(f"  VALUATION (10x):     ${results['total']['valuation_low']:15,.0f}")
    print(f"  VALUATION (20x):     ${results['total']['valuation_high']:15,.0f}")
    print(f"{'='*70}")

if __name__ == '__main__':
    print("=" * 70)
    print("TROPTIONS REVENUE CALCULATOR v3.0")
    print("IOU Issuer Model with MSB/SWIFT/FedWire")
    print("=" * 70)
    
    # Scenario 1: Conservative
    conservative = RevenueModel(
        monthly_iou_volume_millions=50,
        float_size_millions=100,
        neobank_users=10000,
        baas_clients=10,
        b2b_clients=10
    )
    print_scenario("CONSERVATIVE", conservative)
    
    # Scenario 2: Moderate
    moderate = RevenueModel(
        monthly_iou_volume_millions=200,
        float_size_millions=300,
        neobank_users=50000,
        baas_clients=25,
        b2b_clients=50
    )
    print_scenario("MODERATE", moderate)
    
    # Scenario 3: Scale
    scale = RevenueModel(
        monthly_iou_volume_millions=500,
        float_size_millions=500,
        neobank_users=100000,
        baas_clients=50,
        b2b_clients=100
    )
    print_scenario("SCALE", scale)
    
    print("\n" + "=" * 70)
    print("KEY INSIGHT:")
    print("  $874M in IOU demand → Fully-backed digital dollars")
    print("  Current: Unfunded promises")
    print("  With MSB: Regulated, redeemable, revenue-generating")
    print("=" * 70)
