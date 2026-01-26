# Golden Barrel

Production-ready full-stack liquor e-commerce platform.

Tech stack:
- Backend: NestJS + MongoDB (Mongoose)
- Frontend: Next.js + Tailwind CSS
- Auth: JWT (access + refresh) + RBAC
- Payments: Stripe + Cash on Delivery

## Folder Structure

- backend/
  - src/
    - auth/
    - users/
    - products/
    - categories/
    - brands/
    - reviews/
    - cart/
    - orders/
    - coupons/
    - payments/
    - uploads/
    - reports/
    - common/
  - test/
- frontend/
  - app/
  - components/
  - lib/

## Setup

### Backend

```bash
cd backend
copy .env.example .env
npm install
npm run seed
npm run start:dev
```

API docs: `http://localhost:4000/docs`

### Frontend

```bash
cd frontend
copy .env.example .env
npm install
npm run dev
```

### Docker (optional)

```bash
docker compose up --build
```

## Environment Variables

Backend `.env`:
- `PORT`
- `NODE_ENV`
- `MONGODB_URI`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `JWT_ACCESS_EXPIRES`
- `JWT_REFRESH_EXPIRES`
- `BCRYPT_SALT_ROUNDS`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `APP_URL`
- `STORAGE_PROVIDER`
- `LOCAL_UPLOAD_DIR`
- `S3_ENDPOINT`
- `S3_ACCESS_KEY`
- `S3_SECRET_KEY`
- `S3_BUCKET`
- `S3_REGION`
- `CORS_ORIGIN`
- `RATE_LIMIT_WINDOW_MS`
- `RATE_LIMIT_MAX`
- `LEGAL_DRINKING_AGE`

Frontend `.env`:
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_LEGAL_AGE`

## Seeded Demo Users

- Admin: `admin@goldenbarrel.com` / `AdminPass1`
- Staff: `staff@goldenbarrel.com` / `StaffPass1`
- Customer: `customer@goldenbarrel.com` / `CustomerPass1`

## Notes

- Stripe webhooks require `rawBody` enabled (configured in `backend/src/main.ts`).
- Uploads use local storage in dev and S3-compatible storage in prod (`STORAGE_PROVIDER=s3`).
- Frontend admin guard checks `gb_role` in both cookie (middleware) and localStorage for demo. Replace with real JWT decoding in production.
