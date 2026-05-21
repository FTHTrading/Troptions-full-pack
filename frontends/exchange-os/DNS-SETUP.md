# Troptions Domain Configuration Guide

## Setup: troptions.unykorn.org

This guide explains how to configure the domain `troptions.unykorn.org` to route to the Troptions application.

### Prerequisites
- DNS provider access (GoDaddy, Cloudflare, Route 53, etc.)
- Current deployment endpoint (Vercel, Docker, or local IP)
- Domain already registered (troptions.unykorn.org exists under unykorn.org)

### Option 1: Cloudflare DNS (Recommended for Security & Performance)

If unykorn.org is hosted on Cloudflare:

1. **Log into Cloudflare Dashboard**
   - Navigate to your unykorn.org zone

2. **Add DNS Record**
   - Go to DNS Records section
   - Click "Add Record"
   - Type: `CNAME` (if pointing to existing host) or `A` (if pointing to IP)
   
   **For Vercel deployment:**
   ```
   Type: CNAME
   Name: troptions
   Content: cname.vercel-dns.com
   TTL: Auto
   Proxy Status: Proxied
   ```

   **For Docker/Local IP:**
   ```
   Type: A
   Name: troptions
   Content: YOUR_SERVER_IP
   TTL: 3600
   Proxy Status: DNS only (if behind own firewall)
   ```

3. **SSL/TLS Configuration**
   - In Cloudflare dashboard, go to SSL/TLS
   - Set encryption mode to "Full (strict)"
   - Enable "Always Use HTTPS"
   - Enable "HTTP/2"

4. **Page Rules (Optional)**
   ```
   Rule: troptions.unykorn.org/*
   - Cache Level: Cache Everything
   - Browser Cache TTL: 1 hour
   - Always Use HTTPS: On
   ```

### Option 2: Standard DNS Provider (GoDaddy, Namecheap, etc.)

1. **Log into DNS Provider**
   - Access DNS management for unykorn.org

2. **Add CNAME Record**
   ```
   Subdomain: troptions
   Record Type: CNAME
   Value: your-deployment.vercel.app  (or your actual endpoint)
   TTL: 3600
   ```

   OR **Add A Record** (if you have a static IP):
   ```
   Subdomain: troptions
   Record Type: A
   Value: YOUR_SERVER_IP
   TTL: 3600
   ```

3. **Wait for Propagation**
   - DNS changes can take 15 minutes to 48 hours
   - Check status: `nslookup troptions.unykorn.org` or `dig troptions.unykorn.org`

### Option 3: Route 53 (AWS)

If unykorn.org is hosted on AWS Route 53:

1. **Create Record Set**
   - Go to Hosted Zones → unykorn.org
   - Click "Create Record"
   - Name: `troptions.unykorn.org`

2. **For Vercel:**
   ```
   Type: CNAME
   Value: cname.vercel-dns.com
   TTL: 300
   ```

3. **For EC2/Self-hosted:**
   ```
   Type: A
   Value: YOUR_ELASTIC_IP
   TTL: 300
   ```

4. **Create Health Check** (optional)
   - Ensures domain fails over if service is down

### Verification

After DNS propagation, verify the setup:

```bash
# Check DNS resolution
nslookup troptions.unykorn.org
dig troptions.unykorn.org

# Test HTTPS connectivity
curl -v https://troptions.unykorn.org

# Check SSL certificate
echo | openssl s_client -servername troptions.unykorn.org -connect troptions.unykorn.org:443
```

### Environment Configuration

Once domain is live, update application configuration:

**In `.env.production`:**
```
NEXT_PUBLIC_SITE_URL=https://troptions.unykorn.org
NEXT_PUBLIC_API_URL=https://troptions.unykorn.org/api
```

**In `next.config.js`:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  // Force HTTPS in production
  async redirects() {
    return [
      {
        source: '/:path*',
        destination: '/:path*',
        permanent: true,
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ]
      }
    ];
  },
};
module.exports = nextConfig;
```

### Deployment Checklist

- [ ] DNS record created (CNAME or A)
- [ ] DNS propagated globally (test with `nslookup`)
- [ ] SSL certificate valid (`curl -v`)
- [ ] HTTPS redirect working
- [ ] Application environment variables updated
- [ ] Build deployed with correct domain
- [ ] Test voice narration endpoint on live domain
- [ ] Monitor error logs for 24 hours

### Troubleshooting

**Domain not resolving:**
```bash
# Clear DNS cache (Windows)
ipconfig /flushdns

# Check nameservers
whois troptions.unykorn.org

# Verify propagation
nslookup -type=CNAME troptions.unykorn.org
```

**SSL Certificate Issues:**
- Wait 24 hours for Let's Encrypt certificate to auto-issue
- Or manually trigger SSL certificate generation in hosting provider

**Slow Response:**
- Check CDN cache settings (may need to purge cache)
- Verify DNS TTL (lower = faster updates)
- Check server logs for slowdowns

## Voice Narration API Endpoint

Once domain is live, voice narration works at:

```
POST https://troptions.unykorn.org/api/troptions/narration/synthesize
Content-Type: application/json

{
  "text": "Welcome to Troptions...",
  "segmentId": "intro",
  "pageId": "homepage"
}
```

Response: MP3 audio stream

## Next Steps

1. Configure DNS per your provider above
2. Wait for propagation
3. Update environment variables in deployment
4. Deploy application with `git push main`
5. Test voice narration on live domain
6. Monitor analytics and error logs
