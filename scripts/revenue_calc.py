#!/usr/bin/env python3
print('=' * 70)
print('TROPTIONS REVENUE CALCULATOR v3.0')
print('=' * 70)

scenarios = [
    ('CONSERVATIVE', 50, 100, 10000, 10, 10),
    ('MODERATE', 200, 300, 50000, 25, 50),
    ('SCALE', 500, 500, 100000, 50, 100)
]

for name, volume, float_size, users, baas, b2b in scenarios:
    mv = volume * 1000000
    fv = float_size * 1000000
    issuance = mv * 0.005
    float_rev = fv * 0.02 / 12
    spread = mv * 0.001
    b2b_rev = b2b * 1000000 * 0.005
    interchange = users * 500 * 0.015
    subs = int(users * 0.1) * 9.99
    nb_float = users * 4000 * 0.02 / 12
    neobank = interchange + subs + nb_float
    baas_rev = baas * 10000
    total = issuance + float_rev + spread + b2b_rev + neobank + baas_rev
    
    print(f"\nSCENARIO: {name}")
    print(f"  Volume: ${volume}M/month | Float: ${float_size}M")
    print(f"  Issuance: ${issuance:,.0f} | Float: ${float_rev:,.0f} | Spread: ${spread:,.0f}")
    print(f"  B2B: ${b2b_rev:,.0f} | Neobank: ${neobank:,.0f} | BaaS: ${baas_rev:,.0f}")
    print(f"  TOTAL: ${total:,.0f}/month = ${total*12:,.0f}/year")
    print(f"  Value (20x): ${total*12*20:,.0f}")

print(f"\n{'='*70}")
print("KEY: $874M IOU demand + MSB = Regulated digital dollar issuer")
