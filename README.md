# AI-Powered Theme & Plugin Generator Platform

## Overview
This platform allows users (Creators, Guests, Admins) to generate, modify, and download WordPress and Shopify templates/plugins.  
The system incorporates AI refinement, versioning, payment logic, and a public/in-house library.

---

## 1. User Types

| User Type | Access | Payment Rules |
|-----------|--------|---------------|
| **Creator** | Can create templates/plugins | First copy $5, subsequent modifications $4 |
| **Guest / Public User** | Can buy public templates/plugins | First purchase discounted $14 ($19 - $5 creator contribution), first modification $5, second+ $4 |
| **Guest buying in-house templates** | Can buy only | $19 bundle, no modifications allowed |
| **Admin / Owner** | Full access | Manage in-house templates, analytics, moderation |

---

## 2. Template / Plugin Sources

| Source | Pricing | Modification | Access |
|--------|---------|-------------|--------|
| **In-House** | $19 (theme + plugin) | ❌ Never allowed | All users |
| **Public (Creator Generated)** | $5 first creation / $4 modifications | ✅ Allowed | All users (guests pay discounted first time) |

---

## 3. Workflow – Creator Path

1. Creator logs in → selects platform → inputs template details  
2. Payment triggered: first copy $5  
3. AI refinement → generates ZIP → version stored → public library updated  
4. Modifications: $4 per subsequent copy → AI refinement → new version stored  

---

## 4. Workflow – Guest / Public User Path

1. Guest browses public library → selects template  
2. Payment triggered: discounted first copy $14  
3. Download granted  
4. Modifications: first $5, second+ $4 → AI refinement → new version stored  

---

## 5. In-House Templates

- Purchase $19 bundle  
- Download only → ❌ modifications  
- Stored in storage → version fixed → searchable in library  

---

## 6. AI Refinement Points

- After first generation (creator or guest)  
- After every modification (creator or guest)  
- Refines title, description, purpose, tags  
- Checks code syntax (PHP/JS/Liquid)  
- Suggests layout improvements  
- Optional: recommend featured placement or categories  

---

## 7. Database Schema

### Users Table
| Field | Type | Notes |
|-------|------|------|
| user_id | string | Primary key |
| role | enum | Creator / Guest / Admin |
| email | string | Login |
| created_at | timestamp | |

### Templates Table
| Field | Type | Notes |
|-------|------|------|
| template_id | string | Primary key |
| platform | enum | WordPress / Shopify |
| source | enum | In-House / Public |
| title | string | AI-refined |
| description | string | AI-refined |
| purpose | string | Construction, Doctor, Teacher, etc. |
| tags | array | AI-generated keywords |
| creator_id | string | FK to Users |
| price_first | number | $5, $14, $19 depending on source |
| modification_price | number | $4 or $5 depending on context |
| immutable | boolean | True for in-house templates |
| version_number | int | Tracks copy/modification number |
| created_at | timestamp | |
| updated_at | timestamp | |

### Payments Table
| Field | Type | Notes |
|-------|------|------|
| payment_id | string | Primary key |
| user_id | string | FK to Users |
| template_id | string | FK to Templates |
| action | enum | Creation / Purchase / Modification |
| price | number | Amount paid |
| timestamp | timestamp | |
| version_number | int | Links to template version |

### Storage / ZIP Files
- Path: `/templates/{template_id}/version_{version_number}.zip`  
- Metadata stored in DB → maps version to ZIP  

---

## 8. Folder Structure

/frontend (Next.js)
/pages
index.tsx
login.tsx
library.tsx
create.tsx
template/[id].tsx
/components
Editor.tsx
PaymentModal.tsx
TemplateCard.tsx
/backend (Serverless Functions)
generateTemplate.js
aiRefine.js
download.js
paymentWebhook.js
/storage
/templates/{template_id}/version_{version_number}.zip


---

## 9. Serverless Functions Workflow

### generateTemplate.js
- Receives user input  
- Checks user role + template source  
- Charges user ($5/$4/$14/$19)  
- Calls aiRefine.js  
- Generates ZIP → storage  
- Updates Templates DB  
- Returns download link  

### aiRefine.js
- Input: template + metadata  
- Checks code syntax  
- Refines title/description  
- Generates tags for search  
- Suggests layout improvements  

### download.js
- Validates payment + permissions  
- Retrieves ZIP from storage  
- Provides temporary signed download link  

### paymentWebhook.js
- Receives payment confirmation  
- Updates Payments Table  
- Triggers version increment  
- Optional: triggers AI refinement for public library  

---

## 10. Payment Rules
