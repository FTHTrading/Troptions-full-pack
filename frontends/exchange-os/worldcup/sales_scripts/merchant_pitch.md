# World Cup Atlanta — Merchant Sales Scripts

**Product:** TROPTIONS World Cup Merchant Listing  
**Target:** Restaurants, bars, hotels, parking, drivers, retail near Mercedes-Benz Stadium  
**URL:** troptions.com/worldcup/join  
**Contact:** merchants@troptions.com

---

## 15-Second Pitch (cold approach / voicemail)

> "Hey, this is Kevan with TROPTIONS. We're building the Atlanta World Cup fan map — local businesses near the stadium with QR offers for fans who can't get tickets. The starter package is $199 setup. I'll send you the link. No long meeting needed."

---

## 60-Second Pitch (phone / in-person)

> "Hey, this is Kevan from TROPTIONS. Quick question — are you aware that 8 World Cup matches are being played at Mercedes-Benz Stadium this summer?
>
> Tickets are going for $500+ on resale. Which means millions of fans will be in Atlanta and around the stadium, but most of them won't have a ticket. They'll be looking for places to watch, eat, drink, and celebrate.
>
> We're building the local fan-commerce map — a system where Atlanta businesses near the stadium get a merchant profile, a QR offer campaign, and placement in the World Cup fan route. Fans scan the QR, redeem the offer, and you get traffic tracking with every redemption.
>
> The starter package is $199 setup, then $99 a month. We're onboarding the first 50 businesses before the map goes public.
>
> I'm not asking for a big commitment. Can I send you the signup link so you can see what's included?"

---

## Objection Handling

### "We're already covered for World Cup."
> "That's great. Most of what I'm seeing from businesses is general awareness, but not a specific fan-acquisition system. The QR offer campaign is what makes the difference — it creates a trackable foot-traffic loop specifically for fan traffic. Even if you're busy, you can see exactly how many scans and redemptions come from World Cup fans."

### "What is TROPTIONS?"
> "TROPTIONS is a merchant commerce and trade network. For World Cup, we're running the local fan-map activation — it's specifically a program for Atlanta businesses to capture World Cup foot traffic with QR offers and a verified merchant profile."

### "I don't have time right now."
> "Totally understand. The signup takes 5 minutes at troptions.com/worldcup/join. I can send you the link right now and you can review it when you have 10 minutes. The list fills in order."

### "Is this a one-time fee or recurring?"
> "The setup is a one-time $199 to get on the map and activate your QR offer campaign. Then there's an optional $99/month to stay listed through the season. You control the listing and offers."

### "How do fans find us?"
> "Two ways — the TROPTIONS World Cup fan map and QR codes distributed through partner channels near the stadium corridor. When a fan scans your code, it shows your offer on their phone and they redeem it in-store. You see every scan and redemption in your merchant dashboard."

### "We don't need more marketing."
> "I hear that. This is less about marketing, more about capturing fans who are already looking for somewhere to go. The QR offer turns foot-traffic intent into an in-store redemption. If you get even 50 redemptions across 8 match days at $30 each, that's $1,500 in fan spend you'd track back to this system."

---

## Closing Script

> "Based on what you've told me, the starter package at $199 sounds like a fit. Do you want me to get you set up right now?
>
> I can take your business name and email, register you in the system, and you'll have a merchant profile and QR campaign active within 24 hours.
>
> What email should I use?"

**After they give email — run in Telegram:**
```
/wcmerchant BusinessName|Type|Email|starter
```

**Follow up same day:**
> "I just registered you — your reference ID is [ID]. The signup confirmation is at troptions.com/worldcup/join and payment will be sent to your email. Looking forward to getting you on the map."

---

## SMS Follow-Up Template

```
World Cup Atlanta merchant signup:
https://troptions.com/worldcup/join

TROPTIONS is building the local fan-commerce map for businesses near the stadium. Starter package is $199 setup — puts your business on the map with a QR offer campaign and redemption tracking.

Questions: merchants@troptions.com
```

---

## Email Follow-Up Template

**Subject:** World Cup Atlanta — Your Merchant Spot

Hi [Name],

Following up on our call about the TROPTIONS World Cup merchant program.

**The short version:**
- 8 World Cup matches at Mercedes-Benz Stadium, Atlanta (June–July 2026)
- Millions of fans in the area — most can't afford tickets
- They'll be looking for local restaurants, bars, hotels, and venues
- TROPTIONS puts your business on the fan map with QR offers + redemption tracking

**Starter package: $199 setup + $99/month**
- Merchant profile on the World Cup fan map
- QR offer campaign (fans scan → redeem in-store)
- Redemption tracking and analytics
- "World Cup Atlanta" merchant badge

**Sign up here (5 minutes):**
https://troptions.com/worldcup/join

The first 50 businesses get priority placement on the map.

Questions? Reply here or email merchants@troptions.com

— Kevan  
TROPTIONS / UNYKORN

---

## Priority Call Order — First 10

From `C:\Users\Kevan\data\worldcup\call_list.json` — Priority 1 (closest to MBS):

1. **No Mas! Cantina** — Mexican restaurant, Castleberry Hill
2. **Emporium Social** — Food hall + bar, Castleberry Hill
3. **The Optimist** — Seafood restaurant, Westside
4. **Red's Beer Garden** — Beer garden, Castleberry Hill
5. **Anis Café & Bistro** — French bistro, Westside
6. **Hampton Inn Atlanta Downtown** — Hotel, downtown
7. **The Iberian Pig** — Spanish restaurant, Westside
8. **Westside Provisions District** — Retail + dining hub
9. **Banshee** — Craft cocktail bar
10. **Ladybird Grove & Mess Hall** — Outdoor bar + restaurant

---

## Revenue Recap

| Package | Setup | Monthly | Target | 90-Day Revenue |
|---------|-------|---------|--------|----------------|
| Starter | $199 | $99/mo | 20 merchants | $7,940 |
| Verified | $499 | $199/mo | 5 merchants | $5,490 |
| Matchday | $500/day | — | 3 match days | $4,500 |
| **QR commissions** | — | — | 750 redemptions/match | $18,000 |
| **TOTAL** | | | | **~$35,930** |

---

## First Revenue Milestone

```
Goal: First paid merchant
Timeline: Today
Action: Call top 3 businesses, pitch $199 starter
Command: /wcmerchant Name|Type|Email|starter
Next: Send payment link → confirm paid → activate QR campaign
```
