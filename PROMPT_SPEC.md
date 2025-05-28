# 📘 Project Specification: LinkHub (Tumbuh Ide)

This document contains the **complete reference** for building the LinkHub platform (Linktree-like), initiated by **Tumbuh Ide Agency** to connect **Brands** and **Content Creators**.

---

## 🧭 Overview

* **Project Type**: Link-in-Bio Platform
* **Audience**: Brands (Basic) and Content Creators (Advanced)
* **Tech Stack**: Next.js 14+, Supabase, Tailwind CSS, shadcn/ui, Framer Motion, Cloudflare, Upstash
* **Deployment**: Vercel + Cloudflare CDN
* **Key Values**: Transparansi, Kolaborasi, Inklusif
* **Goal**: Menjadikan Tumbuh Ide dikenal melalui tautan yang dibagikan kreator & brand

---

## 🚀 Features Summary

### 🔐 Authentication & User Flow

* Sign up/login (email/password)
* Email verification
* Role selection (Brand / Creator)
* Password reset, password policy
* Profile completion (step by step)

### 📊 Dashboard Modules (Role-Based)

* Global: Overview, Analytics, Social Links, Themes, Settings
* Creator: Profile, Portfolio, Niche
* Brand: Profile, Business Category
* Admin: User, Niche, Category, City Management

### 🌐 Public Bio Page

* URL: `/{username}`
* Brand layout: Simple, linktree-style
* Creator layout: Portfolio, animated, categories
* Features: SEO, Open Graph, QR code, Stats, Social Icons

### 💼 Portfolio (Creator Only)

* Showcase grid
* Lightbox, category filter
* Service offering, testimonial, booking
* Integration: Calendly, Instagram feed

### 📈 Analytics

* Overview stats, top clicks
* Real-time count, click-through rate
* Export CSV/PDF
* Device, country, source

### 🧩 Link Management

* CRUD custom links
* Social platform links
* Drag & drop sorting
* Auto-thumbnail, preview

### 🎨 Themes & Customization

* Light/Dark mode
* Color palette system
* Live preview simulator
* Layout presets (modern, minimal)

### 🔐 Security Features

* DOMPurify for input sanitization
* Rate limiting (Upstash)
* JWT + Session
* bcrypt + password rules
* CSRF, XSS, CORS protection

### 🔎 SEO & Metadata

* Dynamic meta for `/[username]`
* Structured JSON-LD
* Sitemap, robots.txt
* Canonical tags

### 🗂️ Admin Panel

* User management
* Master data (niche, business category, city)
* Bulk actions, export

### ☁️ Cloudflare Integration

* R2 for image storage
* Workers for image resizing
* Brotli, CDN, bot protection

### 📨 Email & Notifications

* Resend (email API)
* Verification, reset password
* Weekly digest, transactional templates

---

## 🔧 File Structure

```
src/
├── app/
│   ├── (auth)/
│   ├── (dashboard)/
│   ├── [username]/
│   ├── api/
│   └── globals.css
├── components/
├── lib/
├── hooks/
├── types/
└── middleware.ts
```

---

## 🧪 Testing Checklist

* ✅ Unit test (utils, validations)
* ✅ Integration test (API routes)
* ✅ E2E test (auth, link, dashboard)
* ✅ Lighthouse audit (performance)

---

## 📄 .env.local Template (Required)

See `.env.local.example` in project root. Includes:

* Supabase keys
* Cloudflare R2 config
* SMTP (Resend)
* SEO, metadata, site name, Twitter handle
* Rate limiting keys (Upstash)
* Password policy values

---

## 🧠 Philosophy (Tumbuh Ide)

* Tidak mengeksploitasi kreator.
* Menghubungkan secara setara: kreator dan brand.
* "Bukan Sekadar Agensi" → dipresentasikan di setiap public content.
* Semua komponen UI, copywriting, dan error state harus mencerminkan nilai humanis.

---

## 📦 Dependencies (Only Free)

* Next.js 14+, Tailwind CSS, shadcn/ui, Supabase
* Resend (email), Cloudflare R2, Upstash
* Zod, React Hook Form, Framer Motion, DOMPurify
* bcryptjs, dotenv, next-auth, swr

---

## ✅ Notes

* Follow `PROMPT_SPEC.md` in all development.
* No paid tools.
* Reuse official packages whenever possible.
* Use Server Components for non-interactive parts.
* Mobile-first responsive UI.
* Each feature must reference a section in this spec.
