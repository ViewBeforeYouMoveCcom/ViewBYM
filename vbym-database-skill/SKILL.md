---
name: vbym-database
description: >
  Direct read/write access to the View Before You Move (VBYM) Supabase database.
  Use this skill aggressively whenever Kabeer says anything involving the VBYM database —
  "delete the dummy listings", "add a property", "create an agency", "update the price",
  "wipe the test data", "insert media", "add a VR record", "publish this listing",
  "show me what's in the DB", "read all properties", "remove the seed data", or any
  instruction that reads from or writes to the VBYM platform database.

  Covers all core tables: properties, agencies, property_media, property_vr,
  agency_members, enquiries, agent_applications, saved_properties.

  HARD RULE: Data values only. No schema changes, no DROP TABLE, no ALTER COLUMN,
  no RLS policy edits. Only SELECT, INSERT, UPDATE (PATCH), and DELETE on existing rows.

  IMPORTANT: All Supabase API calls MUST use the Claude in Chrome JavaScript fetch()
  tool (mcp__Claude_in_Chrome__javascript_tool). The sandbox Python cannot reach
  the Supabase REST API.
---

# VBYM Database Skill

Gives Claude direct, plain-English-driven access to the VBYM Supabase database.
Parse the user's intent, build the right REST call, execute via Chrome JS, verify, and report.

---

## Credentials

```
URL:  https://fetfhywmyogoctvghldj.supabase.co
KEY:  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZldGZoeXdteW9nb2N0dmdobGRqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTQ5MzE5MiwiZXhwIjoyMDg1MDY5MTkyfQ.5ONB7fFaTJo1xvCr1tHfBMkDftEA5bPud5_2MV1Lggs
BASE: https://fetfhywmyogoctvghldj.supabase.co/rest/v1
```

This is the **service role key** — it bypasses RLS. Use it only for legitimate admin/dev operations.

---

## Core Rules

1. **Data only** — never modify schema, policies, triggers, or functions.
2. **Confirm before bulk destructive ops** — for DELETE of more than 5 rows or full table wipes, confirm with the user first unless they've clearly already asked for it.
3. **Always use Chrome JS** — all API calls via `mcp__Claude_in_Chrome__javascript_tool`. Never Python requests.
4. **Verify after write** — after any INSERT/UPDATE/DELETE, do a quick GET to confirm the change landed, then report clearly.
5. **Check references/schema.md** for full column lists before writing — wrong column names cause silent failures.

---

## JS Template — copy and adapt

```javascript
(async () => {
  const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZldGZoeXdteW9nb2N0dmdobGRqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTQ5MzE5MiwiZXhwIjoyMDg1MDY5MTkyfQ.5ONB7fFaTJo1xvCr1tHfBMkDftEA5bPud5_2MV1Lggs';
  const BASE = 'https://fetfhywmyogoctvghldj.supabase.co/rest/v1';
  const H = {
    'Authorization': 'Bearer ' + KEY,
    'apikey': KEY,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };

  // --- SELECT ---
  // const res = await fetch(`${BASE}/properties?status=eq.published&select=id,title,agency_id`, { headers: H });

  // --- INSERT ---
  // const res = await fetch(`${BASE}/properties`, { method: 'POST', headers: H, body: JSON.stringify({...}) });

  // --- UPDATE ---
  // const res = await fetch(`${BASE}/properties?id=eq.SOME-UUID`, { method: 'PATCH', headers: H, body: JSON.stringify({...}) });

  // --- DELETE ---
  // const res = await fetch(`${BASE}/properties?id=eq.SOME-UUID`, { method: 'DELETE', headers: H });

  const data = await res.json();
  return { status: res.status, data };
})()
```

---

## Common Operations

### Read all published properties
```javascript
fetch(`${BASE}/properties?status=eq.published&select=id,title,address_line1,city,price,bedrooms,status`, { headers: H })
```

### Read all properties regardless of status (admin view)
```javascript
fetch(`${BASE}/properties?select=id,title,address_line1,city,status,agency_id&order=created_at.desc`, { headers: H })
```

### Read property with media and VR
```javascript
fetch(`${BASE}/properties?id=eq.PROPERTY-UUID&select=*,property_media(public_url,sort_order,type),property_vr(is_enabled,video_path)`, { headers: H })
```

### Delete all dummy/seed properties (IDs starting with 00000000-0000-0000-0000-00000000010*)
```javascript
fetch(`${BASE}/properties?agency_id=eq.00000000-0000-0000-0000-000000000001`, { method: 'DELETE', headers: H })
```
(media and VR cascade delete automatically due to ON DELETE CASCADE)

### Insert a new agency
```javascript
fetch(`${BASE}/agencies`, {
  method: 'POST', headers: H,
  body: JSON.stringify({
    name: 'Agency Name',
    phone: '+44...',
    email: 'email@agency.com',
    website: 'https://...',
    status: 'approved',
    plan: 'paid'
  })
})
```

### Insert a new property
```javascript
fetch(`${BASE}/properties`, {
  method: 'POST', headers: H,
  body: JSON.stringify({
    agency_id: 'AGENCY-UUID',
    title: 'Property Title',
    address_line1: '123 Example Street',
    address_line2: null,
    city: 'London',
    postcode: 'SW1A 1AA',
    price: 500000,           // integer pence or full price as integer
    price_qualifier: null,   // e.g. 'Guide price', 'Offers over'
    bedrooms: 3,
    bathrooms: 2,
    area_sqft: 1200,
    property_type: 'apartment',
    listing_type: 'sale',    // 'sale' or 'rent'
    tenure: 'Leasehold',
    description: 'Property description here.',
    features: ['Feature 1', 'Feature 2'],
    market_status: 'New',    // 'New' | 'Under offer' | 'Sold STC' | 'Let agreed'
    featured: true,
    status: 'published',
    latitude: 51.5074,
    longitude: -0.1278
  })
})
```

### Add media to a property
```javascript
fetch(`${BASE}/property_media`, {
  method: 'POST', headers: H,
  body: JSON.stringify({
    property_id: 'PROPERTY-UUID',
    type: 'photo',           // 'photo' | 'floorplan' | 'document'
    storage_path: 'property-media/filename.jpg',
    public_url: 'https://...',
    sort_order: 0
  })
})
```

### Enable/set VR for a property
```javascript
fetch(`${BASE}/property_vr`, {
  method: 'POST', headers: H,
  body: JSON.stringify({
    property_id: 'PROPERTY-UUID',
    is_enabled: true,        // replaced is_active in live DB
    video_path: 'property-vr/filename.mp4',
    provider: 'custom'
  })
})
```

### Publish a draft property
```javascript
fetch(`${BASE}/properties?id=eq.PROPERTY-UUID`, {
  method: 'PATCH', headers: H,
  body: JSON.stringify({ status: 'published' })
})
```

### Bulk delete all media for a property
```javascript
fetch(`${BASE}/property_media?property_id=eq.PROPERTY-UUID`, { method: 'DELETE', headers: H })
```

---

## Table Quick-Reference

| What user says | Table | PK |
|---|---|---|
| property / listing | properties | id (uuid) |
| agency / estate agent | agencies | id (uuid) |
| photo / image / media / floorplan | property_media | id (uuid) |
| VR / 360 / immersive | property_vr | id (uuid) |
| enquiry / message | enquiries | id (uuid) |
| application / request access | agent_applications | id (uuid) |
| agent member / user access | agency_members | id (uuid) |

See `references/schema.md` for full column lists.

---

## Constraint Cheatsheet

| Table | Column | Valid Values |
|---|---|---|
| properties | status | `draft` `published` `archived` |
| properties | market_status | `New` `Under offer` `Sold STC` `Let agreed` |
| properties | listing_type | `sale` `rent` |
| agencies | status | `pending` `in_review` `approved` `rejected` `suspended` |
| agencies | plan | `free` `paid` |
| property_media | type | `photo` `floorplan` `document` |
| agency_members | role | `owner` `member` |
| agent_applications | status | `new` `in_review` `approved` `rejected` |

---

## Wipe Demo Data (Confirm First)

The showcase/dummy data uses agency_id `00000000-0000-0000-0000-000000000001`.
To wipe all of it cleanly (media and VR cascade):

```javascript
// Step 1: delete properties (media + VR cascade)
fetch(`${BASE}/properties?agency_id=eq.00000000-0000-0000-0000-000000000001`, { method: 'DELETE', headers: H })

// Step 2 (optional): delete the showcase agency itself
fetch(`${BASE}/agencies?id=eq.00000000-0000-0000-0000-000000000001`, { method: 'DELETE', headers: H })
```
