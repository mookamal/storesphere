**Project Name:** StoreSphere
**Repository:** `github.com/mookamal/storesphere`

# 🎯 StoreSphere

Interactive Multi-Store SaaS Prototype

A Django 5–based backend with Next.js frontend, supporting subdomain-based multi-tenant architecture.

---

## 🚀 Key Features

* Subdomain routing (`www`, `accounts`, `admin`, `storeX`) via `django-hosts`
* REST & GraphQL APIs (`DRF`, `Simple JWT`, `Graphene`)
* Email‑only auth & social login (Google) with `django-allauth`
* CKEditor5 for rich content and media uploads
* Clear separation: `accounts`, `stores`, `products`, `orders`, `subscriptions`

---

## 🛠️ Tech Stack

* **Backend:** Django 5, Django REST Framework, Graphene-Django
* **Auth:** dj-rest-auth, Simple JWT, django-allauth (Google OAuth)
* **Frontend:** Next.js, Tailwind CSS
* **Hosting:** Nginx config for subdomains

---

## ⚙️ Getting Started

1. Clone repo:

   ```bash
   git clone https://github.com/mookamal/storesphere.git
   ```
2. Install dependencies:

   ```bash
   pip install -r backend/requirements.txt
   cd frontend && npm install
   ```
3. Configure `.env` in `backend/` (DB, SECRET\_KEY, hosts)
4. Run backend & frontend:

   ```bash
   # Backend
   cd backend
   python manage.py migrate
   python manage.py runserver

   # Frontend
   cd ../frontend
   npm run dev
   ```

---

---

## 🛑 Status & Notes

* **Prototype:** partial implementation; some modules paused in favor of Go microservices.
* **Public for review:** illustrates multi-tenant design and decision-making.

---

## 📬 Contact

Mohamed kamal • [GitHub](https://github.com/mookamal) • [your.email@example.com](mailto:your.email@example.com)
