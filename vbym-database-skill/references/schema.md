# VBYM Database Schema Reference

Supabase project: `fetfhywmyogoctvghldj`

---

## properties

Primary table. Each row is one listing.

| Column | Type | Notes |
|---|---|---|
| id | uuid | PK, auto-generated |
| agency_id | uuid | FK → agencies.id |
| title | text | Display title (nullable) |
| address_line1 | text | Street address |
| address_line2 | text | Nullable |
| city | text | Nullable |
| postcode | text | Nullable |
| price | integer | Price in GBP (not pence). e.g. 500000 = £500k |
| price_qualifier | text | e.g. 'Guide price', 'Offers over', nullable |
| bedrooms | integer | 0 if studio/commercial |
| bathrooms | integer | |
| area_sqft | integer | Nullable |
| property_type | text | e.g. 'apartment', 'detached', 'terraced', 'flat', 'mews', 'penthouse' |
| listing_type | text | 'sale' or 'rent' |
| tenure | text | 'Freehold', 'Leasehold', nullable |
| description | text | Full property description |
| features | text[] | Array of feature strings |
| market_status | text | 'New' / 'Under offer' / 'Sold STC' / 'Let agreed' |
| status | text | 'draft' / 'published' / 'archived' (workflow status) |
| featured | boolean | Shows in featured section |
| latitude | float8 | Nullable |
| longitude | float8 | Nullable |
| published_at | timestamptz | Auto-set when status → published |
| created_at | timestamptz | Auto |
| updated_at | timestamptz | Auto |

---

## agencies

| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| name | text | Agency display name |
| website | text | Nullable |
| phone | text | Nullable |
| email | text | Nullable |
| status | text | pending / in_review / approved / rejected / suspended |
| plan | text | free / paid |
| internal_notes | text | Admin notes, not shown publicly |
| created_at | timestamptz | |
| updated_at | timestamptz | |

Showcase/dummy agency ID: `00000000-0000-0000-0000-000000000001`

---

## property_media

| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| property_id | uuid | FK → properties.id (CASCADE DELETE) |
| type | text | 'photo' / 'floorplan' / 'document' |
| storage_path | text | Supabase storage key (e.g. property-media/uuid/file.jpg) |
| public_url | text | Full public URL for display |
| sort_order | integer | 0 = first/cover image |
| created_at | timestamptz | |

Photos with sort_order 0 become the cover image. Lower = earlier in gallery.

---

## property_vr

One row per property (unique constraint on property_id).

| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| property_id | uuid | FK → properties.id (CASCADE DELETE) |
| provider | text | 'matterport' / 'kuula' / 'custom' — nullable |
| video_path | text | Storage object key in private 'property-vr' bucket |
| embed_url | text | DEPRECATED — old iframe embed URL |
| iframe_html | text | DEPRECATED |
| is_enabled | boolean | true = VR is active for this property (was `is_active` in some migrations) |
| created_at | timestamptz | |
| updated_at | timestamptz | |

VR video files live in the **private** `property-vr` bucket.
Signed URLs are generated server-side at `/api/vr/[propertyId]`.
Do NOT store public URLs here — store only the storage path.

---

## agency_members

Links auth users to agencies (who can log into the agent portal).

| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| agency_id | uuid | FK → agencies.id |
| user_id | uuid | FK → auth.users.id |
| role | text | 'owner' / 'member' |
| created_at | timestamptz | |

---

## enquiries

Buyer messages submitted via property detail page.

| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| property_id | uuid | FK → properties.id |
| name | text | Buyer name |
| email | text | Buyer email |
| phone | text | Nullable |
| message | text | |
| is_handled | boolean | false by default |
| created_at | timestamptz | |

---

## agent_applications

Pre-registration requests from agents wanting to join.

| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| agency_name | text | |
| branch_location | text | Nullable |
| contact_name | text | |
| contact_role | text | Nullable |
| business_email | text | |
| phone | text | Nullable |
| website | text | Nullable |
| status | text | new / in_review / approved / rejected |
| notes | text | Admin notes |
| created_at | timestamptz | |
| updated_at | timestamptz | |

---

## Dummy / Seed Data IDs

These are the showcase properties to delete when going live:

| ID | Title |
|---|---|
| 00000000-0000-0000-0000-000000000001 | VBYM Showcase (agency) |
| 00000000-0000-0000-0000-000000000101 | Knightsbridge Penthouse |
| 00000000-0000-0000-0000-000000000102 | Chelsea Family Home |
| 00000000-0000-0000-0000-000000000103 | Notting Hill Mews House |
| 00000000-0000-0000-0000-000000000104 | Shoreditch Warehouse Apartment |
| 00000000-0000-0000-0000-000000000105 | Brighton Seafront Apartment |
| 00000000-0000-0000-0000-000000000106 | Manchester City Centre Loft |
| 00000000-0000-0000-0000-000000000107 | Edinburgh New Town Flat |
| 00000000-0000-0000-0000-000000000108 | Clifton Victorian Villa |
| 00000000-0000-0000-0000-000000000109 | Leeds Riverside Apartment |

Deleting the agency (00000000-0000-0000-0000-000000000001) cascades and removes all its properties, media, and VR records automatically.

---

## Storage Buckets

| Bucket | Access | Contains |
|---|---|---|
| property-media | PUBLIC | Photos, walkthrough MP4s, floor plans — use public_url directly |
| property-vr | PRIVATE | 360° VR video files — served via signed URL from /api/vr/[id] |
